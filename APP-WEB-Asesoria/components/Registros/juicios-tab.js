//const template = document.createElement('template');
//import { ControllerUtils } from '......./lib/controllerUtils';
import { APIModel } from '../../models/api.model.js'
import { ValidationError } from '../../lib/errors.js'



class JuiciosTab extends HTMLElement {

  // Variables privadas
  #tipoJuicio
  #estatusJuicio
  #juicios
  #api
  #idSeleccion

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
      this.mostrarTiposDeJuicio()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina < this.#numeroPaginas) {
      //Incremento de la pagina
      this.#pagina++
      //Llamada al metodo de consultar asesorias
      this.mostrarTiposDeJuicio()
    }
  }

  getNumeroPaginas = async () => {
    try {
      const { totalTiposDeJuicio } = await this.#api.getTiposJuicioTotal()
      const total = this.shadowRoot.getElementById('total')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + totalTiposDeJuicio
      this.#numeroPaginas = (totalTiposDeJuicio) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => {});

      modal.message = 'Error al obtener el total de tipos de juicios, intente de nuevo mas tarde o verifique el status del servidor';
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
    const table = this.#juicios
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }


  //Metodo que se encarga de crear la row de la tabla de asesorias con respecto a cada asesoria
  crearRow = tipo => {
    const row = document.createElement('tr');
    row.id = `tipo-juicio-${tipo.id_tipo_juicio}`;
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">${tipo.id_tipo_juicio}</td>
      <td class="px-6 py-4 whitespace-nowrap">${tipo.tipo_juicio}</td>
      <td class="px-6 py-4 whitespace-nowrap">${tipo.estatus_general}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-tipo-juicio" onclick="llamarActivarBotonSeleccionar(this.value)" value="${tipo.id_tipo_juicio}">
          Seleccionar
        </button>
      </td>
    `;
    return row;
  };


  // Constructor
  constructor() {
    super();
    //LLamado a la funcion init
    this.init();
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/Registros/juicios-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  //Funcion encarga de inicializar las variables, datos,etc
  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    // Inicialización de variables API 
    this.#api = new APIModel();
    //Inicializacion de idSeleccion
    this.#idSeleccion = null;
    //Llamado a la funcion manageFormFields
    this.manageFormFields();
    //Llamado a la funcion fillInputs
    this.fillInputs();
  }

  //Manejo de los campos del formulario
  manageFormFields() {
    //Asingnacion de los campos del formulario
    this.#tipoJuicio = this.shadowRoot.getElementById('tipo-juicio');
    this.#estatusJuicio = this.shadowRoot.getElementById('estatus-tipo-juicio');
    this.#juicios = this.shadowRoot.getElementById('table-tipo-juicio');
  }

  //Manejo de eventos de entrada del tipo de juicio
  manejadorEventoEntrada() {
    //Validacion de entrada del tipo de juicio
    var tipoJuicioInput = this.#tipoJuicio;

    //Evento de entrada del tipo de juicio
    tipoJuicioInput.addEventListener('input', function () {
      if (tipoJuicioInput.value !== '') {
        if (tipoJuicioInput.value.length > 100) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'El campo de tipo de juicio no puede contener más de 100 caracteres.'
          modal.title = 'Error de validación'
          modal.open = true
        }
      }

    });


  }

  //Metodo el cual llama a los metodos de agregar eventos a los botones y mostrar los tipos de juicio
  fillInputs() {
    //Llamado a la funcion agregar eventos a los botones
    this.agregarEventosBotones();
    //Llamado a la funcion mostrar los tipos de juicio
    this.getNumeroPaginas()
    this.mostrarTiposDeJuicio();
    this.buttonsEventListeners()
  }

  //Metodo el cual agrega eventos a los botones
  agregarEventosBotones = () => {
    //Variable que almacena el boton de agregar tipo de juicio
    const agregarTipoJuicioBtn = this.shadowRoot.getElementById('agregar-tipo-juicio');

    //Evento de click del boton de agregar tipo de juicio
    agregarTipoJuicioBtn.addEventListener('click', this.agregarTipoJuicio);

    //Variable que almacena el boton de editar tipo de juicio
    const editarTipoJuicioBtn = this.shadowRoot.getElementById('editar-tipo-juicio');

    //Evento de click del boton de editar tipo de juicio
    editarTipoJuicioBtn.addEventListener('click', this.editarTipoJuicio);

    //Llamado a la funcion de manejo de eventos esto es con respecto al metodo de mostrarTiposDeJuicio de la clase JuiciosTab
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-tipo-juicio');

    //Evento de click de los botones de seleccionar tipo de juicio
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const tipoJuicioId = boton.dataset.id;
        console.log(tipoJuicioId);
        this.#idSeleccion = tipoJuicioId;
        //Llamado a la funcion de activar boton seleccionar
        this.activarBotonSeleccionar(tipoJuicioId);
      });
    });

    //Llamado a la funcion de manejo de eventos
    const llamarActivarBotonSeleccionar = (tipoJuicioId) => {
      //Llamado a la funcion de activar boton seleccionar
      this.activarBotonSeleccionar(tipoJuicioId);
    };

    //Asignacion de la funcion llamarActivarBotonSeleccionar a la variable global
    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;
  }

  //Metodo el cual agrega un nuevo tipo de juicio
  agregarTipoJuicio = async () => {
    //Variable que almacena el id del tipo de juicio que nos ayuda a determinar si se ha seleccionado un tipo de juicio
    const tipoJuicioID = this.#idSeleccion;

    //Validacion de si se ha seleccionado un tipo de juicio
    if (tipoJuicioID === null) {



      //Variable que almacena el tipo de juicio
      const tipoJuicioInput = this.#tipoJuicio.value;
      //Variable que almacena el estatus del tipo de juicio
      const estatusJuicioInput = this.#estatusJuicio.value;

      try {
        //Validación del tipo de juicio si esta vacio o no, si esta vacio se muestra un mensaje de error
        if (tipoJuicioInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'El campo de tipo de juicio es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Validación del estatus del tipo de juicio si esta vacio o no, si esta vacio se muestra un mensaje de error
        if (estatusJuicioInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'El campo de estatus de juicio es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //En caso de que el tipo de juicio y el estatus del juicio no esten vacios se procede a validar si el tipo de juicio no contiene mas de 100 caracteres
        if (tipoJuicioInput !== '' && estatusJuicioInput !== '0') {
          // Validación de la longitud del tipo de juicio si es mayor a 100 caracteres se muestra un mensaje de error
          if (tipoJuicioInput.length > 100) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {});

            modal.message = 'El campo de tipo de juicio no puede contener más de 100 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else {

            //Variable que almacena el nuevo tipo de juicio
            const nuevoTipoJuicio = {
              tipo_juicio: tipoJuicioInput,
              estatus_general: estatusJuicioInput.toUpperCase()
            };
            try {
              const modal = document.querySelector('modal-warning')
              modal.message = 'Si esta seguro de agregar el tipo de juicio presione aceptar, de lo contrario presione x para cancelar.'
              modal.title = '¿Confirmacion de agregar tipo de juicio?'
              modal.setOnCloseCallback(() => {
                if (modal.open === 'false') {
                  if (modal.respuesta === true) {
                    modal.respuesta = false
                    this.#api.postTiposJuicio(nuevoTipoJuicio).then(response => {
                 
                      if (response) {
                        this.#tipoJuicio.value = '';
                        this.#estatusJuicio.value = '0';
                        this.IdSeleccion = null;
                        this.#pagina = 1
                        this.getNumeroPaginas()
                        this.mostrarTiposDeJuicio();
                      }
                    }).catch(error => {
                      console.error('Error al agregar un nuevo tipo de juicio:', error);
                      const modal = document.querySelector('modal-warning')

                      modal.message = 'Error al agregar un nuevo tipo de juicio, por favor intente de nuevo o verifique el status del servidor.'
                      modal.title = 'Error al agregar tipo de juicio'
                      modal.open = true
                    });
                  }
                }
              });
              modal.open = true

            } catch (error) {
              console.error('Error al agregar un nuevo tipo de juicio:', error);
              const modal = document.querySelector('modal-warning')

              modal.message = 'Error al agregar un nuevo tipo de juicio, por favor intente de nuevo o verifique el status del servidor.'
              modal.title = 'Error al agregar tipo de juicio'
              modal.open = true
            }
          }
        }




      } catch (error) {
        console.error('Error al agregar un nuevo tipo de juicio:', error);
      }
    } else {
      //Mensaje de error en caso de que se haya seleccionado un tipo de juicio
      const modal = document.querySelector('modal-warning')
      modal.message = 'No se puede agregar un nuevo tipo de juicio si ya se ha seleccionado uno, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#tipoJuicio.value = '';
      this.#estatusJuicio.value = '0';
      this.#idSeleccion = null;
      this.mostrarTiposDeJuicio();


    }


  }

  //Metodo el cual edita un tipo de juicio
  editarTipoJuicio = async () => {
    //Variable que almacena el id del tipo de juicio que nos ayuda a determinar si se ha seleccionado un tipo de juicio
    const tipoJuicioID = this.#idSeleccion;
    if (this.#idSeleccion === null) {
      // Mensaje de error en caso de que no se haya seleccionado un tipo de juicio
      const modal = document.querySelector('modal-warning')
      modal.message = 'Debe seleccionar un tipo de juicio para poder editarlo.'
      modal.title = 'Error de validación'
      modal.setOnCloseCallback(() => {});
      modal.open = true
    }
    else {
      //Variable que almacena el tipo de juicio
      const tipoJuicioInput = this.#tipoJuicio.value;
      //Variable que almacena el estatus del tipo de juicio
      const estatusJuicioInput = this.#estatusJuicio.value;

      try {

        //Validación del tipo de juicio si esta vacio o no, si esta vacio se muestra un mensaje de error
        if (tipoJuicioInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});
          modal.message = 'El campo de tipo de juicio es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Validación del estatus del tipo de juicio si esta vacio o no, si esta vacio se muestra un mensaje de error
        if (estatusJuicioInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});
          modal.message = 'El campo de estatus de juicio es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //En caso de que el tipo de juicio y el estatus del juicio no esten vacios se procede a validar si el tipo de juicio no contiene mas de 100 caracteres
        if (tipoJuicioInput !== '' && estatusJuicioInput !== '0') {
          // Validación de la longitud del tipo de juicio si es mayor a 100 caracteres se muestra un mensaje de error
          if (tipoJuicioInput.length > 100) {
            // Mensaje de error en caso de que el tipo de juicio contenga mas de 100 caracteres
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {});
            modal.message = 'El campo de tipo de juicio no puede contener más de 100 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else {
            //Variable que almacena el tipo de juicio
            const tipoDeJuicio = {
              id_tipo_juicio: tipoJuicioID,
              tipo_juicio: tipoJuicioInput,
              estatus_general: estatusJuicioInput.toUpperCase()
            };


            const tipoJuicioObtenido = await this.#api.getTiposJuicioByID(tipoJuicioID);
            //Validacion de si se han realizado cambios en el tipo de juicio
            if (tipoJuicioObtenido.tipoDeJuicio.tipo_juicio === tipoDeJuicio.tipo_juicio && tipoJuicioObtenido.tipoDeJuicio.estatus_general === tipoDeJuicio.estatus_general) {
              //Mensaje de error en caso de que no se hayan realizado cambios en el tipo de juicio
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => {});

              modal.message = 'No se han realizado cambios en el tipo de juicio, ya que los datos son iguales a los actuales, se eliminaran los campos.'
              modal.title = 'Error de validación'
              modal.open = true
              this.#tipoJuicio.value = '';
              this.#estatusJuicio.value = '0';
              this.#idSeleccion = null;

            } else {
              try {
                const modal = document.querySelector('modal-warning')
                modal.message = 'Si esta seguro de editar el tipo de juicio presione aceptar, de lo contrario presione x para cancelar.'
                modal.title = '¿Confirmacion de editar tipo de juicio?'
                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    if (modal.respuesta === true) {
                      modal.respuesta = false
                      this.#api.putTiposJuicio(tipoJuicioID, tipoDeJuicio).then(response => {
                        if (response) {
                          this.#tipoJuicio.value = '';
                          this.#estatusJuicio.value = '0';
                          this.#idSeleccion = null;
                          this.#pagina = 1
                          this.getNumeroPaginas()
                          this.mostrarTiposDeJuicio();
                        }
                      }).catch(error => {
                        console.error('Error al editar el tipo de juicio:', error.message);
                        const modal = document.querySelector('modal-warning')
                        modal.setOnCloseCallback(() => {});

                        modal.message = 'Error al editar el tipo de juicio, por favor intente de nuevo o verifique el status del servidor.'
                        modal.title = 'Error al editar tipo de juicio'
                        modal.open = true
                      });
                    }
                  }
                });
                modal.open = true


              } catch (error) {
                console.error('Error al editar el tipo de juicio:', error);
                const modal = document.querySelector('modal-warning')
                modal.setOnCloseCallback(() => {});

                modal.message = 'Error al editar el tipo de juicio, por favor intente de nuevo o verifique el status del servidor.'
                modal.title = 'Error al editar tipo de juicio'
                modal.open = true
              }

            }
          }
        }





      } catch (error) {
        console.error('Error al editar el tipo de juicio:', error);
      }
    }
  }
  //Metodo el cual muestra los tipos de juicio
  mostrarTiposDeJuicio = async () => {
    try {
      const tiposJuicio = await this.#api.getTiposJuicioPagina(this.#pagina)
      const lista = tiposJuicio.tiposDeJuicio;
      const table = this.#juicios;
      const rowsTable = this.#juicios.rows.length
      if (this.validateRows(rowsTable)) {
        lista.forEach(tipo => {
          const row = this.crearRow(tipo);
          table.appendChild(row);
        })
      }

    } catch (error) {
      console.error('Error al obtener los tipos de juicio:', error);
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});

      modal.message = 'Error al obtener los tipos de juicio, por favor intente de nuevo o verifique el status del servidor.'
      modal.title = 'Error al obtener tipos de juicio'
      modal.open = true

    }
  }

  //Metodo el cual activa el boton seleccionar y que muestra los datos del tipo de juicio seleccionado
  activarBotonSeleccionar = async tipoJuicioId => {
    try {
      //Variable que almacena el tipo de juicio por id
      const tipoJuicioID = await this.#api.getTiposJuicioByID(tipoJuicioId);
      if (tipoJuicioID) {
        //Asignacion de los valores del tipo de juicio seleccionado
        this.#idSeleccion = tipoJuicioID.tipoDeJuicio.id_tipo_juicio;
        this.#tipoJuicio.value = tipoJuicioID.tipoDeJuicio.tipo_juicio;
        this.#estatusJuicio.value = tipoJuicioID.tipoDeJuicio.estatus_general;
      } else {
        console.error('El tipo de juicio con el ID proporcionado no existe.');
      }
    } catch (error) {
      console.error('Error al obtener el tipo de juicio por ID:', error);
    }
  }


}

customElements.define('juicio-tab', JuiciosTab);
