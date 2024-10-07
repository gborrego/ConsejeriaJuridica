//const template = document.createElement('template');
//import { ControllerUtils } from '......./lib/controllerUtils';
import { APIModel } from '../../models/api.model'
import { ValidationError } from '../../lib/errors.js'


class OcupacionTab extends HTMLElement {
  // Variables de clase privadas
  #api
  #idSeleccion
  #ocupaciones
  #ocupacion
  #estatusOcupacion
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/Registros/ocupacion-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
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
      this.mostrarOcupaciones()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina < this.#numeroPaginas) {
      //Incremento de la pagina
      this.#pagina++
      //Llamada al metodo de consultar asesorias
      this.mostrarOcupaciones()
    }
  }

  getNumeroPaginas = async () => {
    try {
      const { totalOcupaciones } = await this.#api.getOcupacionesTotal()
      const total = this.shadowRoot.getElementById('total')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + totalOcupaciones
      this.#numeroPaginas = (totalOcupaciones) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de ocupaciones, intente de nuevo mas tarde o verifique el status del servidor';
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
    const table = this.#ocupaciones
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
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

  //Metodo que inicializa los campos del formulario
  manageFormFields() {
    //Inicialización de los campos del formulario
    this.#ocupaciones = this.shadowRoot.getElementById('table-ocupacion');
    this.#ocupacion = this.shadowRoot.getElementById('ocupacion');
    this.#estatusOcupacion = this.shadowRoot.getElementById('estatus-ocupacion');
    //Llamada al metodo que maneja la entrada de texto en el campo de ocupación
    this.manejadorEntradaTexto();

  }


  //Metodo encargado de manejar la entrada de texto en el campo de ocupación
  manejadorEntradaTexto() {
    //Inicialización del campo de ocupación
    var ocupacionInput = this.#ocupacion;

    //Evento que se dispara cuando se escribe en el campo de ocupación
    ocupacionInput.addEventListener('input', function () {
      if (ocupacionInput.value.length > 50) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'El campo de ocupación no puede contener más de 50 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });
  }

  //Metodo que manda a llamar a los metodos que llena la tabla y agrega los eventos a los botones
  fillInputs() {
    //Llamada al metodo que llena la tabla de ocupaciones
    this.mostrarOcupaciones();
    this.getNumeroPaginas()
    this.buttonsEventListeners()
    //Llamada al metodo que agrega los eventos a los botones
    this.agregarEventosBotones();
  }

  //Metodo que agrega los eventos a los botones
  agregarEventosBotones = () => {

    //Obtención del botón de agregar ocupación
    const agregarOcupacionBtn = this.shadowRoot.getElementById('agregar-ocupacion');

    //Evento que se dispara cuando se da click en el botón de agregar ocupación
    agregarOcupacionBtn.addEventListener('click', this.agregarOcupacion);

    //Obtención del botón de editar ocupación
    const editarOcupacionBtn = this.shadowRoot.getElementById('editar-ocupacion');

    //Evento que se dispara cuando se da click en el botón de editar ocupación
    editarOcupacionBtn.addEventListener('click', this.editarOcupacion);

    //Obtención de los botones de seleccionar ocupación creados en la tabla de mostrar ocupaciones creados en la tabla de mostrar ocupaciones
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-ocupacion');

    //Iteración de los botones de seleccionar ocupación
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const ocupacionId = boton.dataset.id;
        console.log(ocupacionId);
        this.#idSeleccion = ocupacionId;
        //Llamada al metodo que activa el botón de seleccionar
        this.activarBotonSeleccionar(ocupacionId);
      });
    });

    //Función que se encarga de llamar al metodo que activa el botón de seleccionar
    const llamarActivarBotonSeleccionar = (ocupacionId) => {
      //Llamada al metodo que activa el botón de seleccionar
      this.activarBotonSeleccionar(ocupacionId);
    };

    //Asignación de la función llamarActivarBotonSeleccionar a la ventana global
    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;
  }

  //Metodo que agrega una nueva ocupación
  agregarOcupacion = async () => {
    //Obtención del id de la ocupación seleccionada con el fin de validar si se puede agregar una nueva ocupación
    const ocupacionId = this.#idSeleccion;

    //Validación de si se puede agregar una nueva ocupación
    if (ocupacionId === null) {
      //Obtención de los valores de los campos de ocupación y estatus de ocupación
      const ocupacionInput = this.#ocupacion.value;
      const estatusOcupacionInput = this.#estatusOcupacion.value;
      try {
        //Validación de los campos de ocupación y estatus de ocupación
        //Validación del campo de ocupación si está vacío o no
        if (ocupacionInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El campo de ocupación es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Validación del campo de estatus de ocupación si está vacío o no
        if (estatusOcupacionInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El campo de estatus de ocupación es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //En caso de que los campos de ocupación y estatus de ocupación no estén vacíos
        if (ocupacionInput !== '' && estatusOcupacionInput !== '0') {
          //Se valida que el campo de ocupación no contenga más de 50 caracteres
          if (ocupacionInput.length > 50) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => { });
            modal.message = 'El campo de ocupación no puede contener más de 50 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else {

            //Creación de un objeto con los valores de los campos de ocupación y estatus de ocupación
            const nuevaOcupacion = {
              descripcion_ocupacion: ocupacionInput,
              estatus_general: estatusOcupacionInput.toUpperCase()
            };

            /*Llamada al metodo que agrega una nueva ocupación
            const response = await this.#api.postOcupacion(nuevaOcupacion);

            //Validación de la respuesta de la petición
            if (response) {
              this.#ocupacion.value = '';
              this.#estatusOcupacion.value = '0';
              this.#idSeleccion = null;
              this.mostrarOcupaciones();
            }
              */
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false
                  this.#api.postOcupacion(nuevaOcupacion).then(response => {
                    if (response) {
                      console.log(response)
                      this.#ocupacion.value = '';
                      this.#estatusOcupacion.value = '0';
                      this.#idSeleccion = null;
                      this.#pagina = 1
                      this.getNumeroPaginas()
                      this.mostrarOcupaciones();
                    }
                  }).catch(error => {
                    console.error('Error al agregar una nueva ocupación:', error.message);
                    const modal = document.querySelector('modal-warning')
                    modal.setOnCloseCallback(() => { });
                    modal.message = 'Error al agregar una nueva ocupación, intente de nuevo o verifique el status del servidor.'
                    modal.title = 'Error de validación'
                    modal.open = true
                  });
                }
              }
            }
            );

            modal.message = 'Si esta seguro de agregar la ocupación presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de agregar ocupación?'

            modal.open = true
          }
        }
      } catch (error) {
        console.error('Error al agregar una nueva ocupación:', error);
      }
    }
    else {
      //En caso de que ya se haya seleccionado una ocupación, se muestra un mensaje de error
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });
      modal.message = 'No se puede agregar una nueva ocupación si ya se ha seleccionado una, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#ocupacion.value = '';
      this.#estatusOcupacion.value = '0';
      this.#idSeleccion = null;
      this.mostrarOcupaciones();
    }
  }

  //Metodo que edita una ocupación
  editarOcupacion = async () => {

    //Obtención del id de la ocupación seleccionada
    //que nos ayudará a validar si se puede editar una ocupación
    const ocupacionID = this.#idSeleccion;

    //Validación de si se puede editar una ocupación
    if (this.#idSeleccion === null) {
      //Mensaje de error en caso de que no se haya seleccionado una ocupación
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });
      modal.message = 'Debe seleccionar una ocupación para poder editarla.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Obtención de los valores de los campos de ocupación y estatus de ocupación
      const ocupacionInput = this.#ocupacion.value;
      const estatusOcupacionInput = this.#estatusOcupacion.value;


      try {
        //Validación de los campos de ocupación y estatus de ocupación
        //Validación del campo de ocupación si está vacío o no  
        if (ocupacionInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El campo de ocupación es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Validación del campo de estatus de ocupación si está vacío o no
        if (estatusOcupacionInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El campo de estatus de ocupación es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }
        //En caso de que los campos de ocupación y estatus de ocupación no estén vacíos
        if (ocupacionInput !== '' && estatusOcupacionInput !== '0') {
          //Se valida que el campo de ocupación no contenga más de 50 caracteres
          if (ocupacionInput.length > 50) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => { });
            modal.message = 'El campo de ocupación no puede contener más de 50 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else {
            //Creación de un objeto con los valores de los campos de ocupación y estatus de ocupación
            const ocupacion = {
              id_ocupacion: ocupacionID,
              descripcion_ocupacion: ocupacionInput,
              estatus_general: estatusOcupacionInput.toUpperCase()
            };

            //Se obtiene la ocupación por ID para validar si se realizaron cambios en la ocupación
            const ocupacionObtenida = await this.#api.getOcupacionByID(ocupacionID);

            //Se procede a verificar si se realizaron cambios en la ocupación, mas bien que si los datos son iguales a los actuales  se procedera o no con la actualización
            if (ocupacionObtenida.descripcion_ocupacion === ocupacion.descripcion_ocupacion && ocupacionObtenida.estatus_general === ocupacion.estatus_general) {
              //Mensaje de error en caso de que no se haya realizado cambios en la ocupación
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => { });
              modal.message = 'No se han realizado cambios en la ocupación, ya que los datos son iguales a los actuales, se eliminaran los campos.'
              modal.title = 'Error de validación'
              modal.open = true
              this.#ocupacion.value = '';
              this.#estatusOcupacion.value = '0';
              this.#idSeleccion = null;

            }
            else {

              /*Llamada al metodo que edita una ocupación
              const response = await this.#api.putOcupacion(ocupacionID, ocupacion);

              //Validación de la respuesta de la petición
              if (response) {
                //Mensaje de éxito en caso de que se haya editado la ocupación
                this.#ocupacion.value = '';
                this.#estatusOcupacion.value = '0';
                this.#idSeleccion = null;
                //Llamada al metodo que muestra las ocupaciones
                this.mostrarOcupaciones();
              }
                */
              /*
const modal = document.querySelector('modal-warning')
           modal.setOnCloseCallback(() => {
             if (modal.open === 'false') {
               if (modal.respuesta === true) {
                 modal.respuesta = false
                 this.#api.postJuzgado(nuevoJuzgado).then(response => {
                   if (response) {
                     console.log(response)
                     this.#juzgado.value = '';
                     this.#estatusJuzgado.value = '0';
                     this.#idSeleccion = null;
                     this.#pagina = 1
                     this.getNumeroPaginas()
                     this.mostrarJuzgados();
                   }
                 }).catch(error => {
                   console.error('Error al agregar un nuevo juzgado:', error.message);
                   const modal = document.querySelector('modal-warning')
                   modal.setOnCloseCallback(() => {});
                   modal.message = 'Error al agregar un nuevo juzgado, intente de nuevo o verifique el status del servidor.'
                   modal.title = 'Error de validación'
                   modal.open = true
                 });
               }
             }
           }
           );

           modal.message = 'Si esta seguro de agregar el juzgado presione aceptar, de lo contrario presione x para cancelar.'
           modal.title = '¿Confirmacion de agregar juzgado?'

           modal.open = true
              */
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => {
                if (modal.open === 'false') {
                  if (modal.respuesta === true) {
                    modal.respuesta = false
                    this.#api.putOcupacion(ocupacionID, ocupacion).then(response => {
                      if (response) {
                        console.log(response)
                        this.#ocupacion.value = '';
                        this.#estatusOcupacion.value = '0';
                        this.#idSeleccion = null;
                        this.mostrarOcupaciones();
                      }
                    }).catch(error => {
                      console.error('Error al editar la ocupación:', error.message);
                      const modal = document.querySelector('modal-warning')
                      modal.setOnCloseCallback(() => { });
                      modal.message = 'Error al editar la ocupación, intente de nuevo o verifique el status del servidor.'
                      modal.title = 'Error de validación'
                      modal.open = true
                    });
                  }
                }
              }
              );

              modal.message = 'Si esta seguro de editar la ocupación presione aceptar, de lo contrario presione x para cancelar.'
              modal.title = '¿Confirmacion de editar ocupación?'

              modal.open = true

            }



          }


        }

      } catch (error) {
        console.error('Error al editar la ocupación:', error);
      }

    }
  }

  //Metodo que se muestra las ocupaciones
  mostrarOcupaciones = async () => {
    /*
        try {
          //Llamada al metodo que obtiene las ocupaciones
          const ocupaciones = await this.#api.getOcupaciones();
          //Obtención del cuerpo de la tabla de ocupaciones
          const tableBody = this.#ocupaciones;
          //Llamada al metodo que llena la tabla de ocupaciones
          tableBody.innerHTML = '';
          //Se recorre la lista de ocupaciones
          const lista = ocupaciones;
          const funcion =
            lista.forEach(ocupacion => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <tr id="ocupacion-${ocupacion.id_ocupacion}">
                <td class="px-6 py-4 whitespace-nowrap">${ocupacion.id_ocupacion}</td>
                <td class="px-6 py-4 whitespace-nowrap">${ocupacion.descripcion_ocupacion}</td>
                <td class="px-6 py-4 whitespace-nowrap">${ocupacion.estatus_general}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-ocupacion" onclick="llamarActivarBotonSeleccionar(this.value)" value="${ocupacion.id_ocupacion}">
                Seleccionar
              </button>
            
                </td>
            </tr>
                `;
              tableBody.appendChild(row);
            });
        } catch (error) {
          console.error('Error al obtener las ocupaciones:', error);
        }
          */
    /*
try {
     const juzgados = await this.#api.getJuzgadosPagina(this.#pagina);
     const lista = juzgados.juzgados;
     const table = this.#juzgados;
     const rowsTable = this.#juzgados.rows.length
     if (this.validateRows(rowsTable)) {
       lista.forEach(juzgado => {
         const row = document.createElement('tr');
         row.innerHTML = `
         <tr id="juzgado-${juzgado.id_juzgado}">
         <td class="px-6 py-4 whitespace-nowrap">${juzgado.id_juzgado}</td>
         <td class="px-6 py-4 whitespace-nowrap">${juzgado.nombre_juzgado}</td>
         <td class="px-6 py-4 whitespace-nowrap">${juzgado.estatus_general}</td>
         <td class="px-6 py-4 whitespace-nowrap">
         <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-juzgado" onclick="llamarActivarBotonSeleccionar(this.value)" value="${juzgado.id_juzgado}">
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
     console.error('Error al obtener los juzgados:', error);
     const modal = document.querySelector('modal-warning')

     modal.setOnCloseCallback(() => {});
     modal.message = 'Error al obtener los juzgados, intente de nuevo o verifique el status del servidor.'
     modal.title = 'Error de validación'
     modal.open = true

   }
    */
    try {
      const ocupaciones = await this.#api.getOcupacionesPagina(this.#pagina);
      const lista = ocupaciones.ocupaciones;
      const table = this.#ocupaciones;
      const rowsTable = this.#ocupaciones.rows.length
      if (this.validateRows(rowsTable)) {
        lista.forEach(ocupacion => {
          const row = document.createElement('tr');
          row.innerHTML = `
          <tr id="ocupacion-${ocupacion.id_ocupacion}">
          <td class="px-6 py-4 whitespace-nowrap">${ocupacion.id_ocupacion}</td>
          <td class="px-6 py-4 whitespace-nowrap">${ocupacion.descripcion_ocupacion}</td>
          <td class="px-6 py-4 whitespace-nowrap">${ocupacion.estatus_general}</td>
          <td class="px-6 py-4 whitespace-nowrap">
          <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-ocupacion" onclick="llamarActivarBotonSeleccionar(this.value)" value="${ocupacion.id_ocupacion}">
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
      console.error('Error al obtener las ocupaciones:', error);
      const modal = document.querySelector('modal-warning')

      modal.setOnCloseCallback(() => { });
      modal.message = 'Error al obtener las ocupaciones, intente de nuevo o verifique el status del servidor.'
      modal.title = 'Error de validación'
      modal.open = true

    }
    
  }

  //Metodo que activa el botón de seleccionar ocupación y que muestra los datos de la ocupación seleccionada
  activarBotonSeleccionar = async ocupacionId => {

    try {
      //Llamada al metodo que obtiene la ocupación por ID
      const ocupacionID = await this.#api.getOcupacionByID(ocupacionId);
      //Validación de si la ocupación con el ID proporcionado existe
      if (ocupacionID) {
        //Se agregan los valores de la ocupación seleccionada a los campos de ocupación y estatus de ocupación
        this.#idSeleccion = ocupacionID.id_ocupacion;
        this.#ocupacion.value = ocupacionID.descripcion_ocupacion;
        this.#estatusOcupacion.value = ocupacionID.estatus_general;
      } else {
        console.error('La ocupación con el ID proporcionado no existe.');
      }
    } catch (error) {
      console.error('Error al obtener la ocupación por ID:', error);
    }
  }
}

customElements.define('ocupacion-tab', OcupacionTab);
