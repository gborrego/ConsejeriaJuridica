//const template = document.createElement('template');
//import { ControllerUtils } from '......./lib/controllerUtils';
import { APIModel } from '../../models/api.model'
import { ValidationError } from '../../lib/errors.js'

 
class EscolaridadTab extends HTMLElement {
  //Variables privadas de la API
  #api
  #idSeleccion
  #escolaridades
  #escolaridad
  #estatusEscolaridad

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
      this.mostrarEscolaridades()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina < this.#numeroPaginas) {
      //Incremento de la pagina
      this.#pagina++
      //Llamada al metodo de consultar asesorias
      this.mostrarEscolaridades()
    }
  }

  getNumeroPaginas = async () => {
    try {
      const { totalEscolaridades } = await this.#api.getEscolaridadesTotal()
      const total = this.shadowRoot.getElementById('total')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + totalEscolaridades
      this.#numeroPaginas = (totalEscolaridades) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => {});

      modal.message = 'Error al obtener el total de escolaridades, intente de nuevo mas tarde o verifique el status del servidor';
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
    const table = this.#escolaridades
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/Registros/escolaridad-tab.html')).text();
    template.innerHTML = html;
    return template;
  }

  //Constructro de la clase
  constructor() {
    super();
    //Llamada a la función init para inicializar las variables
    this.init();
  }

  //Función para inicializar las variables, manejador de eventos y campos del formulario
  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Inicializacion de la variable de la clase APIModel
    this.#api = new APIModel();
    //Inicializacion de la variable de idSeleccion en null
    this.#idSeleccion = null;
    //Llamada a la función manageFormFields para manejar los campos del formulario
    this.manageFormFields();
    //Llamada a la función fillInputs para llenar los campos del formulario
    this.fillInputs();
  }
  //Función que maneja los campos del formulario
  manageFormFields() {
    this.#escolaridades = this.shadowRoot.getElementById('table-escolaridad');
    this.#escolaridad = this.shadowRoot.getElementById('escolaridad');
    this.#estatusEscolaridad = this.shadowRoot.getElementById('estatus-escolaridad');
   //Llamada a la función que maneja la entrada de texto en el campo de escolaridad
   this.manejadorEntradaTexto();
  }

  //Función que maneja la entrada de texto en el campo de escolaridad
manejadorEntradaTexto() {

  var escolaridadInput = this.#escolaridad;

  escolaridadInput.addEventListener('input', function () {
    if (escolaridadInput.value.length > 50) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});
      modal.message = 'El campo de escolaridad no puede contener más de 50 caracteres.'
      modal.title = 'Error de validación'
      modal.open = true
    }
  });
}

//MEtodo que manda a llamar a las funciones correspondientes de agregar eventos a los botones y mostrar las escolaridades
  fillInputs() {
    this.mostrarEscolaridades(); 
    this.getNumeroPaginas()
    this.buttonsEventListeners()
    this.agregarEventosBotones();
  }

  //Función que agrega eventos a los botones de la interfaz
  agregarEventosBotones = () => {
     
    //Asignacion del boton de agregar escolaridad
    const agregarEscolaridadBtn = this.shadowRoot.getElementById('agregar-escolaridad');

    //Asignación del evento click al boton de agregar escolaridad
    agregarEscolaridadBtn.addEventListener('click', this.agregarEscolaridad);

    //Asignación del boton de editar escolaridad
    const editarEscolaridadBtn = this.shadowRoot.getElementById('editar-escolaridad');

    //Asignación del evento click al boton de editar escolaridad
    editarEscolaridadBtn.addEventListener('click', this.editarEscolaridad);

    //Obtencion de todos los botones de seleccionar escolaridad creados en la tabla de escolaridades con el metodo de mostrarEscolaridades
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-escolaridad');

    //Iteración de los botones de seleccionar escolaridad para asignarles un evento click
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const escolaridadId = boton.dataset.id;
        console.log(escolaridadId);
        this.#idSeleccion = escolaridadId;
         
        //Llamada a la función de activar boton seleccionar
        this.activarBotonSeleccionar(escolaridadId);
      });
    });

    //Función que llama a la función de activar boton seleccionar
    const llamarActivarBotonSeleccionar = (escolaridadId) => {
      this.activarBotonSeleccionar(escolaridadId);
    };

    //Asignación de la función de activar boton seleccionar a la variable global de window
    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;

  }
  //Metodo que agrega una escolaridad
  agregarEscolaridad = async () => {
  
    //Variable que nos ayuda a obtener el id de la escolaridad seleccionada y asi poder agregar una nueva escolaridad
    const escolaridadID = this.#idSeleccion;
     
    //Validación de si ya se ha seleccionado una escolaridad para agregar una nueva
    if (escolaridadID === null) {

      //Obtención de los valores de los campos de escolaridad y estatus de escolaridad
      const escolaridadInput = this.#escolaridad.value;
      const estatusEscolaridadInput = this.#estatusEscolaridad.value;

      try {
        //Validación de si el campo de escolaridad está vacío
        if (escolaridadInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});
          modal.message = 'El campo de escolaridad es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Validación de si el campo de estatus de escolaridad está vacío
        if (estatusEscolaridadInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});
          modal.message = 'El campo de estatus de escolaridad es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //En caso de que los campos de escolaridad y estatus de escolaridad no estén vacíos
        if (escolaridadInput !== '' && estatusEscolaridadInput !== '0') {
          //Se prpcede a validar que el campo de escolaridad no contenga más de 50 caracteres
          if (escolaridadInput.length > 50) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {});
            modal.message = 'El campo de escolaridad no puede contener más de 50 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else {
            //Creación de un objeto con los valores de los campos de escolaridad y estatus de escolaridad

            const nuevaEscolaridad = {
              descripcion: escolaridadInput,
              estatus_general: estatusEscolaridadInput.toUpperCase()
            };
/*
            //Llamada a la función de postEscolaridad de la API para agregar una nueva escolaridad
            const response = await this.#api.postEscolaridad(nuevaEscolaridad);
            //En caso de que la respuesta sea exitosa se limpian los campos y se muestra la tabla de escolaridades
            if (response) {
              this.#escolaridad.value = '';
              this.#estatusEscolaridad.value = '0';
              this.IdSeleccion = null;
              this.mostrarEscolaridades();
            } */
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false
                  this.#api.postEscolaridad(nuevaEscolaridad).then(response => {
                    if (response) {
                      console.log(response)
                      this.#escolaridad.value = '';
                      this.#estatusEscolaridad.value = '0';
                      this.#idSeleccion = null;
                      this.#pagina = 1
                      this.getNumeroPaginas()
                      this.mostrarEscolaridades();
                    }
                  }).catch(error => {
                    console.error('Error al agregar una nueva escolaridad:', error.message);
                    const modal = document.querySelector('modal-warning')
                    modal.setOnCloseCallback(() => {});
                    modal.message = 'Error al agregar una nueva escolaridad, intente de nuevo o verifique el status del servidor.'
                    modal.title = 'Error de validación'
                    modal.open = true
                  });
                }
              }
            });

            modal.message = 'Si esta seguro de agregar la escolaridad presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de agregar escolaridad?'

            modal.open = true
          }
        }
      } catch (error) {
        console.error('Error al agregar un nuevo escolaridad:', error);
      }
    }
    else {
      //En caso de que ya se haya seleccionado una escolaridad se muestra un mensaje de error y se limpian los campos
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});
      modal.message = 'No se puede agregar un nuevo escolaridad si ya se ha seleccionado uno, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#escolaridad.value = '';
      this.#estatusEscolaridad.value = '0';
      this.#idSeleccion = null;
      this.mostrarEscolaridades();
    }

  }

  //Metodo que edita una escolaridad seleccionada
  editarEscolaridad = async () => {
  
    //Variable que nos ayuda a obtener el id de la escolaridad seleccionada y asi poder editarla
    const escolaridadID = this.#idSeleccion;
     
    //Validación de si ya se ha seleccionado una escolaridad para editarla
    if (this.#idSeleccion === null) {
      //Muetsra un mensaje de error en caso de que no se haya seleccionado una escolaridad
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});
      modal.message = 'Debe seleccionar un escolaridad para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Obtención de los valores de los campos de escolaridad y estatus de escolaridad

      const escolaridadInput = this.#escolaridad.value;
      const estatusEscolaridadInput = this.#estatusEscolaridad.value;

      try {
        //Validación de si el campo de escolaridad está vacío
        if (escolaridadInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});
          modal.message = 'El campo de escolaridad es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Validación de si el campo de estatus de escolaridad está vacío
        if (estatusEscolaridadInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});
          modal.message = 'El campo de estatus de escolaridad es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //En caso de que los campos de escolaridad y estatus de escolaridad no estén vacíos
        if (escolaridadInput !== '' && estatusEscolaridadInput !== '0') {
          //Se procede a validar que el campo de escolaridad no contenga más de 50 caracteres
          if (escolaridadInput.length > 50) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {});
            modal.message = 'El campo de escolaridad no puede contener más de 50 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else {
            //Creación de un objeto con los valores de los campos de escolaridad y estatus de escolaridad
            const escolaridad = {
              id_escolaridad: escolaridadID,
              descripcion: escolaridadInput,
              estatus_general: estatusEscolaridadInput.toUpperCase()
            };

            //Se obtiene la escolaridad por ID para validar si se han realizado cambios en la escolaridad
            const escolaridadObtenida = await this.#api.getEscolaridadByID(escolaridadID);

            //Se valida si es posible editar la escolaridad
            if (escolaridadObtenida.descripcion === escolaridad.descripcion && escolaridadObtenida.estatus_general === escolaridad.estatus_general) {
              //En caso de que no se hayan realizado cambios se muestra un mensaje de error y se limpian los campos
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => {});
              modal.message = 'No se han realizado cambios en la escolaridad, ya que los datos son iguales a los actuales, se eliminaran los campos.'
              modal.title = 'Error de validación'
              modal.open = true
              this.#escolaridad.value = '';
              this.#estatusEscolaridad.value = '0';
              this.#idSeleccion = null;

            }
            else {
              /*
              //Llamada a la función de putEscolaridad de la API para editar la escolaridad
              const response = await this.#api.putEscolaridad(escolaridadID, escolaridad);

              //En caso de que la respuesta sea exitosa se limpian los campos y se muestra la tabla de escolaridades
              if (response) {
                this.#escolaridad.value = '';
                this.#estatusEscolaridad.value = '0';
                this.#idSeleccion = null;
                this.mostrarEscolaridades();
              }
              */
             /*
 const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => {
                if (modal.open === 'false') {
                  if (modal.respuesta === true) {
                    modal.respuesta = false
                    this.#api.postEstadosCivil(nuevoEstadoCivil).then(response => {
                      if (response) {
                        console.log(response)
                        this.#estadoCivil.value = '';
                        this.#estatusEstadoCivil.value = '0';
                        this.#idSeleccion = null;
                        this.#pagina = 1
                        this.getNumeroPaginas()
                        this.mostrarEstadosCiviles();
                      }
                    }).catch(error => {
                      console.error('Error al agregar un nuevo estado civil:', error.message);
                      const modal = document.querySelector('modal-warning')
                      modal.setOnCloseCallback(() => {});

                      modal.message = 'Error al agregar un nuevo estado civil, intente de nuevo o verifique el status del servidor.'
                      modal.title = 'Error de validación'
                      modal.open = true
                    });
                  }
                }
              });

              modal.message = 'Si esta seguro de agregar el estado civil presione aceptar, de lo contrario presione x para cancelar.'
              modal.title = '¿Confirmacion de agregar estado civil?'
              modal.open = true
             */
                   
               
               const modal = document.querySelector('modal-warning')
                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    if (modal.respuesta === true) {
                      modal.respuesta = false
                      this.#api.putEscolaridad(escolaridadID, escolaridad).then(response => {
                        if (response) {
                          console.log(response)
                          this.#escolaridad.value = '';
                          this.#estatusEscolaridad.value = '0';
                          this.#idSeleccion = null;
                          this.#pagina = 1
                          this.getNumeroPaginas()
                          this.mostrarEscolaridades();
                        }
                      }).catch(error => {
                        console.error('Error al editar la escolaridad:', error.message);
                        const modal = document.querySelector('modal-warning')
                        modal.setOnCloseCallback(() => {});
                        modal.message = 'Error al editar la escolaridad, intente de nuevo o verifique el status del servidor.'
                        modal.title = 'Error de validación'
                        modal.open = true
                      });
                    }
                  }
                });

                modal.message = 'Si esta seguro de editar la escolaridad presione aceptar, de lo contrario presione x para cancelar.'
                modal.title = '¿Confirmacion de editar escolaridad?'

                modal.open = true

            }

          }
        }

      } catch (error) {
        console.error('Error al editar la escolaridad:', error);
      }
    }


  }
  //Metodo que muestra las escolaridades en la tabla de escolaridades
  mostrarEscolaridades = async () => {


    try {
      const escolaridades = await this.#api.getEscolaridadesPagina(this.#pagina);
      const lista = escolaridades.escolaridades;
      const table = this.#escolaridades;
      const rowsTable = this.#escolaridades.rows.length
      if (this.validateRows(rowsTable)) {
        lista.forEach(escolaridad => {
          const row = document.createElement('tr');
          row.innerHTML = `
          <tr id="escolaridad-${escolaridad.id_escolaridad}">
          <td class="px-6 py-4 whitespace-nowrap">${escolaridad.id_escolaridad}</td>
          <td class="px-6 py-4 whitespace-nowrap">${escolaridad.descripcion}</td>
          <td class="px-6 py-4 whitespace-nowrap">${escolaridad.estatus_general}</td>
          <td class="px-6 py-4 whitespace-nowrap">
          <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-escolaridad" onclick="llamarActivarBotonSeleccionar(this.value)" value="${escolaridad.id_escolaridad}">
          Seleccionar
        </button>
      
          </td>
      </tr>
          `;
          table.appendChild(row);
        })

      }

    }
    catch (error) {
      console.error('Error al obtener las escolaridades:', error);
      const modal = document.querySelector('modal-warning')

      modal.setOnCloseCallback(() => {});
      modal.message = 'Error al obtener las escolaridades, intente de nuevo o verifique el status del servidor.'
      modal.title = 'Error de validación'
      modal.open = true

    }

  }

  //Metodo que activa el boton de seleccionar escolaridad el cual muestra la escolaridad seleccionada en los campos de escolaridad y estatus de escolaridad
  activarBotonSeleccionar = async escolaridadId => {
    
    try {
      //Llamada a la función de getEscolaridadByID de la API para obtener la escolaridad por ID
      const escolaridadID = await this.#api.getEscolaridadByID(escolaridadId);
       
      //Validación de si la escolaridad con el ID proporcionado existe
      if (escolaridadID) {
        //Asignación de los valores de la escolaridad seleccionada a los campos de escolaridad y estatus de escolaridad
        this.#idSeleccion = escolaridadID.id_escolaridad;
        this.#escolaridad.value = escolaridadID.descripcion;
        this.#estatusEscolaridad.value = escolaridadID.estatus_general;
      } else {
        console.error('La escolaridad con el ID proporcionado no existe.');
      }
    } catch (error) {
      console.error('Error al obtener la escolaridad por ID:', error);

    }
  }
}

customElements.define('escolaridad-tab', EscolaridadTab);
