//const template = document.createElement('template');
//import { ControllerUtils } from '......./lib/controllerUtils';
import { APIModel } from '../../models/api.model.js'
import { ValidationError } from '../../lib/errors.js'
 

class MotivosTab extends HTMLElement {

  //Variables de clase privadas
  #motivo
  #estatusMotivo
  #motivos
  #idSeleccion
  #api

  #pagina = 1
  #numeroPaginas

  //Este metodo se encarga de gestionar la paginacion de las asesorias
  buttonsEventListeners = () => {
    //Asignación de las variables correspondientes a los botones
    const prev = this.shadowRoot.getElementById('anterior')
    const next = this.shadowRoot.getElementById('siguiente')
    //Asignación de los eventos de los botones y la llamada de los metodos correspondientes en este caso la paginacion metodos de next y prev
    prev.addEventListener('click', this.handlePrevPage)
    next.addEventListener('click', this.handleNextPage)
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion previa
  handlePrevPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina > 1) {
      //Decremento de la pagina
      this.#pagina--
      //Llamada al metodo de consultar asesorias
      this.mostrarMotivos()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina < this.#numeroPaginas) {
      //Incremento de la pagina
      this.#pagina++
      //Llamada al metodo de consultar asesorias
      this.mostrarMotivos()
    }
  }

  getNumeroPaginas = async () => {
    try {
      const { totalMotivos } = await this.#api.getMotivosTotal()
      const total = this.shadowRoot.getElementById('total')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + totalMotivos
      this.#numeroPaginas = (totalMotivos) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => {});

      modal.message = 'Error al obtener el total de motivos, intente de nuevo mas tarde o verifique el status del servidor';
      modal.title = 'Error'
      modal.open = 'true'
    }
  }

  //Este metodo se encarga de verificar la cantidad de filas de la tabla y asi poder limpiar la tabla
  //y regesar true en caso de que la tabla tenga filas o regresar false en caso de que la tabla no tenga filas
  validateRows = rowsTable => {
    if (rowsTable > 0) {
      this.cleanTable(rowsTable);
      return true
    } else { return true }
  }

  //Este metodo se encarga de limpiar la tabla
  cleanTable = rowsTable => {
    const table = this.#motivos
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }

  //Función que muestra los motivos en la tabla
  mostrarMotivos = async () => {
    try {

        const motivos = await this.#api.getMotivosPagina(this.#pagina)
        const lista = motivos.motivos;
        const table = this.#motivos;
        const rowsTable = this.#motivos.rows.length

         if (this.validateRows(rowsTable)) {
          lista.forEach(motivo => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <tr id="motivo-${motivo.id_motivo}">
            <td class="px-6 py-4 whitespace-nowrap">${motivo.id_motivo}</td>
            <td class="px-6 py-4 whitespace-nowrap">${motivo.descripcion_motivo}</td>
            <td class="px-6 py-4 whitespace-nowrap">${motivo.estatus_general}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-motivo" onclick="llamarActivarBotonSeleccionar(this.value)" value="${motivo.id_motivo}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `;
            table.appendChild(row);
          })
        }

    } catch (error) {
      console.error('Error al obtener los motivos:', error);
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});

      modal.message = 'Error al obtener los motivos, intente de nuevo o verifique el status del servidor.'
      modal.title = 'Error de validación'
      modal.open = true
    }

  }

  //Constructor de la clase
  constructor() {
    super();
    //Inicialización de variables de clase en este caso se inicializa en null
    this.#idSeleccion = null;
    //Llamada a la función init
    this.init();
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/Registros/motivos-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  //Función que inicializa las variables de clase y los eventos de los botones,etc
  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Se inicializa la variable de clase api con la clase APIModel
    this.#api = new APIModel();
    //Llamada a la función manageFormFields
    this.manageFormFields();
    //Llamada a la función fillInputs
    this.fillInputs();
  }

  //Función que maneja los campos del formulario
  manageFormFields() {
    //Se obtienen los elementos del formulario
    this.#motivo = this.shadowRoot.getElementById('motivo');
    this.#estatusMotivo = this.shadowRoot.getElementById('estatus-motivo');
    this.#motivos = this.shadowRoot.getElementById('table-motivo');
  }

  //Función que maneja los eventos de entrada del motivo
  manejadorEventosEntrada() {
    //Validación de entrada de motivo
    var motivoInput = this.#motivo;

    //Evento de entrada de motivo
    motivoInput.addEventListener('input', function () {
      if (motivoInput.value !== '') {
        if (motivoInput.value.length > 75) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'El campo de motivo no puede contener más de 75 caracteres.'
          modal.title = 'Error de validación'
          modal.open = true
        }
      }

    });
  }

  //Función que manda a llamar a las funciones de llenar la tabla de motivos y agregar eventos a los botones
  fillInputs() {
    //Llamada a la función manejadorEventosEntrada
    this.agregarEventosBotones();
    //Llamada a la función mostrarMotivos
    this.getNumeroPaginas()
    this.buttonsEventListeners()
    this.mostrarMotivos();
  }

  //Función que agrega eventos a los botones
  agregarEventosBotones = () => {
    //Variable que obtiene el botón de agregar motivo
    const agregarMotivoBtn = this.shadowRoot.getElementById('agregar-motivo');

    //Evento de click en el botón de agregar motivo
    agregarMotivoBtn.addEventListener('click', this.agregarMotivo);

    //Variable que obtiene el botón de editar motivo
    const editarMotivoBtn = this.shadowRoot.getElementById('editar-motivo');
    //Evento de click en el botón de editar motivo
    editarMotivoBtn.addEventListener('click', this.editarMotivo);

    //Variable que obtiene los botones de seleccionar motivo esto con  respecto a su tabla y metodo de mostrarMotivos de la clase
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-motivo');

    //Evento de click en los botones de seleccionar motivo
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const motivoId = boton.value;
        console.log(motivoId);
        this.#idSeleccion = motivoId;
        this.activarBotonSeleccionar(motivoId);
      });
    });

    //Función que llama a la función activarBotonSeleccionar
    const llamarActivarBotonSeleccionar = (motivoId) => {
      this.activarBotonSeleccionar(motivoId);
    };

    //Se agrega la función llamarActivarBotonSeleccionar a la ventana global
    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;
  }

  //Función que agrega un motivo
  agregarMotivo = async () => {

    //De igual manera se obtiene el id de seleccion, con el fin de saber si se ha seleccionado un motivo o no
    const motivoID = this.#idSeleccion;

    //Validación de campos de entrada
    if (motivoID === null) {
      //Variable que obtiene el valor del campo de motivo
      const motivoInput = this.#motivo.value;
      //Variable que obtiene el valor del campo de estatus de motivo
      const estatusMotivoInput = this.#estatusMotivo.value;


      try {
        //Validación del campo de motivo en caso de que este vacío se muestra un modal de advertencia
        if (motivoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'El campo de motivo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Validación del campo de estatus de motivo en caso de que este vacío se muestra un modal de advertencia
        if (estatusMotivoInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'El campo de estatus de motivo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //En caso de que los campos de motivo y estatus de motivo no estén vacíos se procede a realizar la validación de la longitud del campo de motivo
        if (motivoInput !== '' && estatusMotivoInput !== '0') {

          //Validación de la longitud del campo de motivo en caso de que sea mayor a 75 se muestra un modal de advertencia
          if (motivoInput.length > 75) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {});

            modal.message = 'El campo de motivo no puede contener más de 75 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else {

            //Se crea un nuevo motivo con los campos de descripción de motivo y estatus de motivo
            const nuevoMotivo = {
              descripcion_motivo: motivoInput,
              estatus_general: estatusMotivoInput.toUpperCase()
            };

            //Se obtiene el motivo por descripción de motivo
            try {
            
             const modal = document.querySelector('modal-warning')
              modal.message = 'Si esta seguro de agregar el motivo presione aceptar, de lo contrario presione x para cancelar.'
              modal.title = '¿Confirmacion de agregar motivo?'

              modal.setOnCloseCallback(() => {
                if (modal.open === 'false') {
                  if (modal.respuesta === true) {
                    modal.respuesta = false

                    this.#api.postMotivo(nuevoMotivo).then(response => {
                      if (response) {
                        this.#motivo.value = '';
                        this.#estatusMotivo.value = '0';
                        this.#idSeleccion = null;
                        this.#pagina = 1
                        this.getNumeroPaginas()
                        this.mostrarMotivos();
                      }
                    }).catch(error => {
                      console.error('Error al agregar un nuevo motivo:', error);
                      const modal = document.querySelector('modal-warning')
                      modal.setOnCloseCallback(() => {});

                      modal.message = 'Error al agregar un nuevo motivo, intente de nuevo o verifique el status del servidor.'
                      modal.title = 'Error de validación'
                      modal.open = true
                    });
                  }
                }
              });
              modal.open = true
            } catch (error) {
              //Se muestra un modal de advertencia en caso de que haya un error al agregar un nuevo motivo en caso de error en el servidor
              console.error('Error al agregar un nuevo motivo:', error);
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => {});

              modal.message = 'Error al agregar un nuevo motivo, intente de nuevo o verifique el status del servidor.'
              modal.title = 'Error de validación'
              modal.open = true
            }
          }
        }

      } catch (error) {
        console.error('Error al agregar un nuevo motivo:', error);
      }
    } else {
      // Se muestra un modal de advertencia en caso de que ya se haya seleccionado un motivo
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});

      modal.message = 'No se puede agregar un nuevo motivo si ya se ha seleccionado uno, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#motivo.value = '';
      this.#estatusMotivo.value = '0';
      this.#idSeleccion = null;
      this.mostrarMotivos();
    }
  }

  //Función que edita un motivo
  editarMotivo = async () => {
    //Se obtiene el id de selección el cual es el id del motivo que se ha seleccionado y nos permite saber si se ha seleccionado un motivo o no
    const motivoID = this.#idSeleccion;
    //Validación de campos de entrada
    if (motivoID === null) {
      //Se muestra un modal de advertencia en caso de que no se haya seleccionado un motivo
      const modal = document.querySelector('modal-warning')

      modal.setOnCloseCallback(() => {});

      modal.message = 'Debe seleccionar un motivo para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Variable que obtiene el valor del campo de motivo
      const motivoInput = this.#motivo.value;
      //Variable que obtiene el valor del campo de estatus de motivo
      const estatusMotivoInput = this.#estatusMotivo.value;

      try {
        //Validacion del campo de motivo en caso de que este vacío se muestra un modal de advertencia
        if (motivoInput === '') {
          //Se muestra un modal de advertencia en caso de que el campo de motivo esté vacío
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'El campo de motivo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Validación del campo de estatus de motivo en caso de que este vacío se muestra un modal de advertencia
        if (estatusMotivoInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'El campo de estatus de motivo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //En caso de que los campos de motivo y estatus de motivo no estén vacíos se procede a realizar la validación de la longitud del campo de motivo
        if (motivoInput !== '' && estatusMotivoInput !== '0') {
          //Validación de la longitud del campo de motivo en caso de que sea mayor a 75 se muestra un modal de advertencia
          if (motivoInput.length > 75) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {});

            modal.message = 'El campo de motivo no puede contener más de 75 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else {

            //Se crea un nuevo motivo con los campos de descripción de motivo y estatus de motivo
            const motivo = {
              id_motivo: motivoID,
              descripcion_motivo: motivoInput,
              estatus_general: estatusMotivoInput.toUpperCase()
            };

            const motivoObtenido = await this.#api.getMotivoByID(motivoID);

            //Validación de que los datos del motivo sean iguales a los actuales 
            if (motivoObtenido.motivo.descripcion_motivo === motivo.descripcion_motivo && motivoObtenido.motivo.estatus_general === motivo.estatus_general) {
              //Se muestra un modal de advertencia en caso de que no se hayan realizado cambios en el motivo
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => {});

              modal.message = 'No se han realizado cambios en el motivo, ya que los datos son iguales a los actuales, se eliminaran los campos.'
              modal.title = 'Error de validación'
              modal.open = true
              this.#motivo.value = '';
              this.#estatusMotivo.value = '0';
              this.#idSeleccion = null;

            } else {
              try {
                  /*
                const response = await this.#api.putMotivo(motivoID, motivo);

                if (response) {
                  this.#motivo.value = '';
                  this.#estatusMotivo.value = '0';
                  this.#idSeleccion = null;
                  this.mostrarMotivos();
                } */ 
                const modal = document.querySelector('modal-warning')
                modal.message = 'Si esta seguro de editar el motivo presione aceptar, de lo contrario presione x para cancelar.'
                modal.title = '¿Confirmacion de editar motivo?'
                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    if (modal.respuesta === true) {
                      modal.respuesta = false

                      this.#api.putMotivo(motivoID, motivo).then(response => {
                        if (response) {
                          this.#motivo.value = '';
                          this.#estatusMotivo.value = '0';
                          this.#idSeleccion = null;
                          this.#pagina = 1
                          this.getNumeroPaginas()
                          this.mostrarMotivos();
                        }
                      }).catch(error => {
                        console.error('Error al editar el motivo:', error);
                        const modal = document.querySelector('modal-warning')
                        modal.message = 'Error al editar el motivo, intente de nuevo o verifique el status del servidor.'
                        modal.title = 'Error de validación'
                        modal.open = true
                      });
                    }
                  }
                });
                modal.open = true 

              } catch (error) {
                //Se muestra un modal de advertencia en caso de que haya un error al editar un motivo en caso de error en el servidor
                console.error('Error al editar el motivo:', error);
                const modal = document.querySelector('modal-warning')
              
                modal.message = 'Error al editar el motivo, intente de nuevo o verifique el status del servidor.'
                modal.title = 'Error de validación'
                modal.open = true
              }

            }
          }
        }
      } catch (error) {
        console.error('Error al editar el motivo:', error);
      }
    }


  }


  activarBotonSeleccionar = async motivoId => {

    try {
      //Se obtiene el motivo por ID
      const motivoID = await this.#api.getMotivoByID(motivoId);
      if (motivoID) {
        //Se rellenan los campos de motivo y estatus de motivo con los datos del motivo obtenido
        this.#idSeleccion = motivoID.motivo.id_motivo;
        this.#motivo.value = motivoID.motivo.descripcion_motivo;
        this.#estatusMotivo.value = motivoID.motivo.estatus_general;
      } else {
        console.error('El motivo con el ID proporcionado no existe.');
      }
    } catch (error) {
      console.error('Error al obtener el motivo por ID:', error);
    }
  }
}

customElements.define('motivo-tab', MotivosTab);
