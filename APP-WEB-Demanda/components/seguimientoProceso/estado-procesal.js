import { APIModel } from '../../models/api.model'



export class EstadoProcesal extends HTMLElement {
  //Variables privadas de la clase
  #api
  #idEstadoProcesal
  #estadoProcesal
  #fechaEstadoProcesal
  #estadosProcesales
  #tableEstadosProcesales

  #botonAgregarEstadoProcesal
  #botonEditarEstadoProcesal
  #registroTab


  //Metodo que obtiene  los atributos que se le pasan al componente
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo que obtiene el valor del atributo id
  get id() {
    return this.getAttribute('id')
  }

  //Metodo que establece el valor del atributo id
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que obtiene el valor del atributo data
  get data() {
    const estadosProcesales = this.#estadosProcesales
    return { estadosProcesales: estadosProcesales }
  }

 
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('/components/seguimientoProceso/estado-procesal.html')).text();
    template.innerHTML = html;
    return template;
  }

  
  //Metodo que establece el valor del atributo data
  set data(value) {
    this.#idProcesoJudicial = value
    this.cargaDatos()
    this.setAttribute('data', value)
  }


  #idProcesoJudicial
  async cargaDatos() {
    try {
      const { estadosProcesales } = await this.#api.getEstadosBusqueda(this.#idProcesoJudicial, false, this.#pagina)
      this.#estadosProcesales = estadosProcesales
      this.getNumeroPaginas()
      this.mostrarEstadosProcesales()
    }
    catch (error) {
      this.#estadosProcesales = []
      const total = this.shadowRoot.getElementById('total-e')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + 0
      console.error('Error al establecer el valor del atributo data:', error)
    }
  }

  #pagina = 1
  #numeroPaginas
  //Este metodo se encarga de gestionar la paginacion de las asesorias
  buttonsEventListeners = () => {
    //Asignación de las variables correspondientes a los botones
    const prev = this.shadowRoot.getElementById('anterior-e')
    const next = this.shadowRoot.getElementById('siguiente-e')
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
      this.cargaDatos()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina < this.#numeroPaginas) {
      //Incremento de la pagina
      this.#pagina++
      //Llamada al metodo de consultar asesorias
      this.cargaDatos()
    }
  }

  getNumeroPaginas = async () => {
    try {
      const { totalEstadosProcesales } = await this.#api.getEstadosBusqueda(this.#idProcesoJudicial, true, 1)
      const total = this.shadowRoot.getElementById('total-e')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + totalEstadosProcesales
      this.#numeroPaginas = (totalEstadosProcesales) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de estados procesales, intente de nuevo mas tarde o verifique el status del servidor';
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
    const table = this.#tableEstadosProcesales
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }



  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Inicializacion de las variables privadas 
    this.#api = new APIModel()
    this.#idEstadoProcesal = null
    this.#estadosProcesales = []
    //Llamada al metodo que maneja los campos del formulario
    this.manageFormFields()
    //Llamada al metodo que llena los campos del formulario
    this.fillInputs()
  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()


  }

  //Metodo encargado de manejar los campos del formulario
  manageFormFields() {
    //Obtencion de los campos del formulario
    this.#estadoProcesal = this.shadowRoot.getElementById('estado')
    this.#fechaEstadoProcesal = this.shadowRoot.getElementById('fecha-estado')
    this.#tableEstadosProcesales = this.shadowRoot.getElementById('table-estado')
    this.#botonAgregarEstadoProcesal = this.shadowRoot.getElementById('agregar-estado')
    this.#botonEditarEstadoProcesal = this.shadowRoot.getElementById('editar-estado')
  }

  //Llamada al metodo que maneja los eventos de los campos del formulario , en este caso eventos del tipo input
  manejadorEntradaTexto() {
    var estadoProcesalInput = this.#estadoProcesal
    estadoProcesalInput.addEventListener('input', function () {
      if (estadoProcesalInput.value.length > 200) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'El campo estado procesal no puede tener más de 200 caracteres'
        modal.title = 'Error'
        modal.open = true
      }
    })

  }

  //Metodo que manda a llamar al metodo que llena los eventos de los botones
  fillInputs() {
    //Llamada al metodo que llena los eventos de los botones
    this.agregarEventosBotones()
     this.buttonsEventListeners()
  }

  //Metodo que agrega los eventos a los botones
  agregarEventosBotones = () => {

    //Evento que se ejecuta cuando se da click en el boton de agregar estado procesal
    this.#botonAgregarEstadoProcesal.addEventListener('click', this.agregarEstadoProcesal)
    //Evento que se ejecuta cuando se da click en el boton de editar estado procesal
    this.#botonEditarEstadoProcesal.addEventListener('click', this.editarEstadoProcesal)

    //Se obtienen todos los botones de seleccionar estado procesal crados en el metodo mostrarEstadosProcesales
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-estado')

    //Se recorre cada boton de seleccionar estado procesal y se le agrega un evento de click
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const estadoProcesalId = boton.dataset.id
        this.#idEstadoProcesal = estadoProcesalId
        //Llamada al metodo que activa el boton de seleccionar estado procesal
        this.llamarActivarBotonSeleccionarEstado(estadoProcesalId)
      })
    })

    //Se agregan eventos de input a los campos del formulario
    const llamarActivarBotonSeleccionarEstado = (estadoProcesalId) => {
      this.llamarActivarBotonSeleccionarEstado(estadoProcesalId)
    }

    window.llamarActivarBotonSeleccionarEstado = llamarActivarBotonSeleccionarEstado

  }

  //Metodo que se ejecuta cuando se agrega un estado procesal
  agregarEstadoProcesal = async () => {

    //Se obtiene el id del estado procesal, esto con el fin de verificar si se ha seleccionado 
    //previamente un estado procesal de la tabla con el fin de añaadir uno nuevo o no
    const estadoProcesalID = this.#idEstadoProcesal
    //Si no se ha seleccionado un estado procesal de la tabla se procede a agregar uno nuevo
    if (estadoProcesalID === null) {
      //Se obtienen los valores de los campos del formulario
      const estadoProcesal = this.#estadoProcesal.value
      const fechaEstadoProcesal = this.#fechaEstadoProcesal.value

      //Se verifica si el campo de estado procesal esta vacio, o si tiene mas de 200 caracteres
      if (estadoProcesal === '') {
        this.#showModal('El campo estado procesal no puede estar vacío', 'Error')
      } else if (estadoProcesal.length > 200) {
        this.#showModal('El campo estado procesal no puede tener más de 200 caracteres', 'Error')
      }


      const fechaActual = new Date();
      fechaActual.setUTCHours(0, 0, 0, 0); // Establecer hora UTC

      // Obtener la fecha ingresada desde tu input HTML (asegúrate de obtener el valor correctamente)
      const fechaIngresada = new Date(fechaEstadoProcesal);
      fechaIngresada.setUTCHours(0, 0, 0, 0); // Establecer hora UTC

      //Se verifica si el campo de fecha de estado procesal esta vacio
      if (fechaEstadoProcesal === '') {
        this.#showModal('La fecha de estado procesal no puede estar vacia', 'Error')
      }
      else {

        //Verififcar json en este caso que el estado procesal no sea vacio y que la fecha no sea vacia, y que el estado procesal no tenga mas de 100 caracteres
        if (estadoProcesal !== '' && fechaEstadoProcesal !== '' && estadoProcesal.length <= 100) {



          const modal = document.querySelector('modal-warning')
          modal.message = 'Si esta seguro de agregar el estado procesal presione aceptar, de lo contrario presione x para cancelar.'
          modal.title = '¿Confirmacion de agregar estado procesal?'

          modal.setOnCloseCallback(() => {
            if (modal.open === 'false') {
              if (modal.respuesta === true) {
                modal.respuesta = false
                //Se crea un objeto con los datos del estado procesal
                const estadoProcesalData = {
                  id_proceso_judicial: this.#idProcesoJudicial,
                  descripcion_estado_procesal: estadoProcesal,
                  fecha_estado_procesal: fechaEstadoProcesal
                }
                this.#api.postEstadoProcesal(estadoProcesalData).then((response) => {
                  this.cargaDatos()
                  //Se limpian los campos del formulario
                  this.#estadoProcesal.value = ''
                  this.#fechaEstadoProcesal.value = ''
                }).catch((error) => {
                  console.error('Error al agregar el estado procesal:', error)
                })

                //Se agrega el estado procesal al arreglo de estados procesales
                //  this.#estadosProcesales.push(estadoProcesalData)
                //Se llama a la funcion que muestra los estados procesales
                //  this.mostrarEstadosProcesales()

              }
            }
          }
          );
          modal.open = true
        }
        //  }
      }
    }
    else {
      //Caso contrario se muestra un mensaje de error
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });

      modal.message = 'No se puede agregar un estado procesal si ha selecionado previamente uno de la tabla, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#idEstadoProcesal = null
      this.#estadoProcesal.value = ''
      this.#fechaEstadoProcesal.value = ''
    }


  }

  //Metodo que se ejecuta cuando se edita un estado procesal
  editarEstadoProcesal = async () => {
    //Se obtiene el id del estado procesal, esto con el fin de verificar si se ha seleccionado
    const estadoProcesalID = this.#idEstadoProcesal
    //Si no se ha seleccionado un estado procesal de la tabla se muestra un mensaje de error
    if (estadoProcesalID === null) {
      //Mostrar mensaje de error
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { })

      modal.message = 'Debe seleccionar un estado procesal para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Obtener los valores de los campos del formulario
      const estadoProcesal = this.#estadoProcesal.value
      const fechaEstadoProcesal = this.#fechaEstadoProcesal.value

      //Verificar si el campo de estado procesal esta vacio o si tiene mas de 100 caracteres
      if (estadoProcesal === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de estado procesal es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else

        //Verificar si el campo de estado procesal tiene mas de 100 caracteres
        if (estadoProcesal.length > 100) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { })

          modal.message = 'El campo de estado procesal no puede contener más de 100 caracteres.'
          modal.title = 'Error de validación'
          modal.open = true
        }

      //Verificar si el campo de fecha de estado procesal esta vacio
      if (fechaEstadoProcesal === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de fecha de estado procesal es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else {


        const fechaActual = new Date();
        fechaActual.setUTCHours(0, 0, 0, 0); // Establecer hora UTC

        // Obtener la fecha ingresada desde tu input HTML (asegúrate de obtener el valor correctamente)
        const fechaIngresada = new Date(fechaEstadoProcesal);
        fechaIngresada.setUTCHours(0, 0, 0, 0); // Establecer hora UTC



        /**
          De alguna manera con respecto al id del estado procesal seleccionado se debe de modificar el arreglo de estados procesales  
         */
        //Verificar json en este caso que el estado procesal no sea vacio y que la fecha no sea vacia, y que el estado procesal no tenga mas de 100 caracteres
        if (estadoProcesal !== '' && fechaEstadoProcesal !== '' && estadoProcesal.length <= 100) {

          const estadoPRocesalObtenido = await this.#api.getEstadoProcesalByID(estadoProcesalID)

          if (estadoPRocesalObtenido.descripcion_estado_procesal === estadoProcesal && estadoPRocesalObtenido.fecha_estado_procesal === fechaEstadoProcesal) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'No se han realizados cambios en el estado procesal, ya que los datos son iguales a los anteriores.'
            modal.setOnCloseCallback(() => { });
            modal.title = 'Error de validación'
            modal.open = true

          } else {

            const modal = document.querySelector('modal-warning')
            modal.message = 'Si esta seguro de editar el estado procesal presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de editar estado procesal?'

            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false
              
                  const estadoProcesalData = {
                    id_estado_procesal: estadoProcesalID,
                    descripcion_estado_procesal: estadoProcesal,
                    fecha_estado_procesal: fechaEstadoProcesal,
                    id_proceso_judicial: this.#idProcesoJudicial
                  }
                  this.#api.putEstadoProcesal(estadoProcesalID,estadoProcesalData).then((response) => {
                    this.cargaDatos()
                    this.#idEstadoProcesal = null
                    //Se limpian los campos del formulario
                    this.#estadoProcesal.value = ''
                    this.#fechaEstadoProcesal.value = ''
                  }
                  ).catch((error) => {
                    console.error('Error al editar el estado procesal:', error)
                  })
               
                }
              }
            }
            );
            modal.open = true
          }
        }
        //  }
      }
    }
  }

  //Metodo que muestra los estados procesales
  mostrarEstadosProcesales = async () => {

    try {
      const estadosProcesales = this.#estadosProcesales

      const lista = estadosProcesales
      const table = this.#tableEstadosProcesales
      const rowsTable = this.#tableEstadosProcesales.rows.length
      if (this.validateRows(rowsTable)) {
        lista.forEach((estadoProcesal, i) => {
          const row = document.createElement('tr')
          row.innerHTML = `
            <tr id="estado-${estadoProcesal.id_estado_procesal}">
            <td class="px-6 py-4 whitespace-nowrap">${estadoProcesal.id_estado_procesal}</td>
            <td class="px-6 py-4 whitespace-nowrap">${estadoProcesal.descripcion_estado_procesal}</td>
            <td class="px-6 py-4 whitespace-nowrap">${estadoProcesal.fecha_estado_procesal}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-estado" onclick="llamarActivarBotonSeleccionarEstado(this.value)" value="${estadoProcesal.id_estado_procesal}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `
          table.appendChild(row)
        })
      }

    } catch (error) {
      console.error('Error al obtener los estados procesales:', error)
    }


  }

  //Metodo que se ejecuta cuando se selecciona un estado procesal y que activa el boton de seleccionar estado procesal, para
  //asi poder mostrar los datos del estado procesal seleccionado
  llamarActivarBotonSeleccionarEstado = async estadoProcesalId => {

    try {
      estadoProcesalId = parseInt(estadoProcesalId, 10)
      //Obtencion del estado procesal por id
      const estadoProcesal = await this.#api.getEstadoProcesalByID(estadoProcesalId)
      //Se valida si el estado procesal existe
      if (estadoProcesal) {
        //Se asignan los valores del estado procesal a los campos del formulario
        this.#idEstadoProcesal = estadoProcesalId
        this.#estadoProcesal.value = estadoProcesal.descripcion_estado_procesal
        this.#fechaEstadoProcesal.value = estadoProcesal.fecha_estado_procesal
      } else {
        console.error('El estado procesal con el ID proporcionado no existe.')
      }
    } catch (error) {
      console.error('Error al obtener el estado procesal por ID:', error)
    }
  }


  //Metodo que muestra mensajes de error
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning') 
    modal.setOnCloseCallback(() => { })
    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }


}

customElements.define('estado-procesal', EstadoProcesal)
