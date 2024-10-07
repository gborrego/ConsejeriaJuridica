import { APIModel } from '../../models/api.model'



export class ObservacionPromovente extends HTMLElement {

  //Variables privadas
  #api
  #idObservacion
  #observacion
  #observaciones
  #tableObservaciones
  #botonAgregarObservacion
  #botonEditarObservacion

  //Metodos privado que se encarga de obtener los atributos del componente
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
    const observaciones = this.#observaciones
    return {
      observaciones: observaciones
    }
  }



  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('/components/seguimientoProceso/observacion.html')).text();
    template.innerHTML = html;
    return template;
  }


  //Metodo que establece el valor del atributo data
  set data(value) {
    this.#idProcesoJudicial = value
    this.cargaDatos()
  //   this.buttonsEventListeners()
    this.setAttribute('data', value)
  }


  #idProcesoJudicial
  async cargaDatos() {
    try {
      const { observaciones } = await this.#api.getObservacionesBusqueda(this.#idProcesoJudicial, false, this.#pagina)
      this.#observaciones = observaciones
      this.getNumeroPaginas()
      this.mostrarObservaciones()
    }
    catch (error) {
      this.#observaciones = []
      const total = this.shadowRoot.getElementById('total-o')
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
    const prev = this.shadowRoot.getElementById('anterior-o')
    const next = this.shadowRoot.getElementById('siguiente-o')
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
      const { totalObservaciones } = await this.#api.getObservacionesBusqueda(this.#idProcesoJudicial, true, 1)
      const total = this.shadowRoot.getElementById('total-o')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + totalObservaciones
      this.#numeroPaginas = (totalObservaciones) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de observaciones, intente de nuevo mas tarde o verifique el status del servidor';
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
    const table = this.#tableObservaciones
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }

  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Inicialización de variables
    this.#api = new APIModel()
    this.#idObservacion = null
    this.#observaciones = []
    //Llamada al metodo encargado de gestionar los campos del formulario
    this.manageFormFields()
    //Llamada al metodo encargado de llenar los campos del formulario
    this.fillInputs()
  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()
  }

  //Metodo que se encarga de obtener los valores de los atributos del componente
  manageFormFields() {
    this.#observacion = this.shadowRoot.getElementById('observacion')
    this.#tableObservaciones = this.shadowRoot.getElementById('table-observacion')
    this.#botonAgregarObservacion = this.shadowRoot.getElementById('agregar-observacion')
    this.#botonEditarObservacion = this.shadowRoot.getElementById('editar-observacion')

    //Llamada al metodo que se encarga de asignar evento de  validar la longitud del campo de observacion
    this.manejadorEntradaTexto()
  }


  //Metodo que se encarga de asignar evento de  validar la longitud del campo de observacion
  manejadorEntradaTexto() {

    var observacionInput = this.#observacion
    //Evento que se encarga de validar la longitud del campo de observacion
    observacionInput.addEventListener('input', function () {
      if (observacionInput.value.length > 200) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'El campo de observación no puede contener más de 200 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    })

  }

  //Metodo que se encagra de llamar al metodo que se encarga de llenar los eventos de los botones
  fillInputs() {
    this.agregarEventosBotones()
    this.buttonsEventListeners()
  }

  //Metodo que se encarga de llenar los eventos de los botones
  agregarEventosBotones = () => {
    //Se asigna el evento de click al boton de agregar observacion
    this.#botonAgregarObservacion.addEventListener('click', this.agregarObservacion)
    //Se asigna el evento de click al boton de editar observacion
    this.#botonEditarObservacion.addEventListener('click', this.editarObservacion)
    //Se obtienen todos los botones de seleccionar observacion
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-observacion')
    //Se asigna el evento de click a cada uno de los botones de seleccionar observacion
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const observacionId = boton.value
        this.#idObservacion = observacionId
        //Se llama a la funcion que se encarga de activar el boton de seleccionar observacion
        this.activarBotonSeleccionarObservacion(observacionId)
      })
    })

    //Se asigna la funcion de activar el boton de seleccionar observacion a una variable global
    const activarBotonSeleccionarObservacion = (observacionId) => {
      //Se llama a la funcion que se encarga de activar el boton de seleccionar observacion
      this.activarBotonSeleccionarObservacion(observacionId)
    }

    //Se asigna la funcion de activar el boton de seleccionar observacion a una variable global
    window.activarBotonSeleccionarObservacion = activarBotonSeleccionarObservacion
  }

  //Metodo que se encarga de mostrar las observaciones en la tabla
  mostrarObservaciones = async () => {

    try {
      const observaciones = this.#observaciones
      const lista = observaciones
      const table = this.#tableObservaciones
      const rowsTable = this.#tableObservaciones.rows.length
      if (this.validateRows(rowsTable)) {
        lista.forEach((observacion, i) => {
          const row = document.createElement('tr')
          row.innerHTML = `
            <tr id="observacion-${observacion.id_observacion}">
            <td class="px-6 py-4 whitespace-nowrap">${observacion.id_observacion}</td>
            <td class="px-6 py-4 whitespace-nowrap">${observacion.observacion}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-observacion" onclick="activarBotonSeleccionarObservacion(this.value)" value="${observacion.id_observacion}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `
          table.appendChild(row)
        })
      }

    } catch (error) {
      console.error('Error al obtener las observaciones:', error)
    }

  }

  //Metodo que se encarga de editar una observacion
  editarObservacion = async () => {
    //Variable que nos ayuda a determinar si se ha seleccionado una observacion con el fin de editarla
    //caso contrario se mostrara un mensaje de error
    const observacionId = this.#idObservacion
    //Validacion si se ha seleccionado una observacion
    if (observacionId == null) {
      //Mensaje de error
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { })

      modal.message = 'Seleccione una observación para editar.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Se obtiene el valor del campo de observacion
      const observacion = this.#observacion.value
      //Validacion si el campo de observacion esta vacio
      if (observacion === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de observación es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else
        //Validacion si el campo de observacion excede los 200 caracteres
        if (observacion.length > 200) {
          //Mensaje de error
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { })

          modal.message = 'El campo de observación no puede contener más de 200 caracteres.'
          modal.title = 'Error de validación'
          modal.open = true
        } else {
          //Validacion si el campo de observacion no esta vacio y no excede los 200 caracteres
          if (observacion !== '' && observacion.length <= 200) {

            const observacionObtenida = await this.#api.getObservacionByID(observacionId)

            if (observacionObtenida.observacion === observacion) {
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => { });
              modal.message = 'La observación no ha sido modificada, es la misma que la actual.'
              modal.title = 'Error de validación'
              modal.open = true
            } else {

              const modal = document.querySelector('modal-warning')
              modal.message = 'Si esta seguro de editar la observación presione aceptar, de lo contrario presione x para cancelar.'
              modal.title = '¿Confirmacion de editar observación?'

              modal.setOnCloseCallback(() => {
                if (modal.open === 'false') {
                  if (modal.respuesta === true) {
                    modal.respuesta = false
                    //Se crea un objeto con los datos de la observacion
                    const observacionData = {
                      observacion: observacion,
                      id_observacion: observacionId,
                      id_proceso_judicial: this.#idProcesoJudicial
                    }
                    /* Se actualiza la observacion
                    this.#observaciones[observacionId - 1] = observacionData
                    //Se muestra la observacion en la tabla
                    this.mostrarObservaciones()
                    //Se limpian los campos
                    this.#idObservacion = null
                    //Se limpia el campo de observacion
                    this.#observacion.value = ''  */
                    this.#api.putObservacion(observacionId,observacionData).then((response) => {
                      this.cargaDatos()
                      this.#idObservacion = null
                      this.#idObservacion = null
                      this.#observacion.value = ''
                    }).catch((error) => {
                      console.error('Error al editar la observacion:', error)
                    } 
                    );
                  }
                }
              }
              );
              modal.open = true
            }
          } else {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => { })

            modal.message = 'El campo de observación es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
        }
    }

  }

  //Metodo que se encarga de agregar una observacion
  agregarObservacion = async () => {

    //Variable que nos ayuda a determinar si se ha seleccionado una observacion con el fin de agregarla

    const idObservacion = this.#idObservacion
    //Validacion si se ha seleccionado una observacion
    if (idObservacion === null) {
      //Se obtiene el valor del campo de observacion
      const observacion = this.#observacion.value

      //Validacion si el campo de observacion esta vacio 
      if (observacion === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de observación es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      }

      //Validacion si el campo de observacion excede los 200 caracteres
      if (observacion.length > 200) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de observación no puede contener más de 200 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      } else {
        //Validacion si el campo de observacion no esta vacio y no excede los 200 caracteres
        if (observacion !== '' && observacion.length <= 200) {

          /*
          const observacionData = {
            observacion: observacion
          }
          //Se agrega la observacion
          this.#observaciones.push(observacionData)
          //Se muestra la observacion en la tabla
          this.mostrarObservaciones()
          //Se limpian los campos
          this.#observacion.value = ''
          */
          const modal = document.querySelector('modal-warning')
          modal.message = 'Si esta seguro de agregar la observación presione aceptar, de lo contrario presione x para cancelar.'
          modal.title = '¿Confirmacion de agregar observación?'

          modal.setOnCloseCallback(() => {
            if (modal.open === 'false') {
              if (modal.respuesta === true) {
                modal.respuesta = false
                //Se crea un objeto con los datos de la observacion
                const observacionData = {
                  observacion: observacion,
                  id_proceso_judicial: this.#idProcesoJudicial
                }
                /*
                //Se agrega la observacion
                this.#observaciones.push(observacionData)
                //Se muestra la observacion en la tabla
                this.mostrarObservaciones()
                //Se limpian los campos
                this.#observacion.value = ''
                */
                this.#api.postObservacion(observacionData).then((response) => {
                   this.cargaDatos()
                  this.#observacion.value = ''
                }).catch((error) => {
                  console.error('Error al agregar la observacion:', error)
                }
                );
              }
            }
          }
          );
          modal.open = true
        } else {
          //Caso contrario se muestra un mensaje de error
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { })

          modal.message = 'El campo de observación es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }
      }
    }
    else {
      //Mensaje de error
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { })

      modal.message = 'No se puede agregar una observación si ha selecionado previamente una de la tabla, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#idObservacion = null
      this.#observacion.value = ''

    }
  }

  //Metodo que se encarga de activar el boton de seleccionar observacion, con el fin de agregar a sus respectivos campos
  activarBotonSeleccionarObservacion = async observacionId => {
    try {
     observacionId = parseInt(observacionId, 10)
      //Se obtiene la observacion por ID
      const observacion =  await this.#api.getObservacionByID(observacionId)
      //Validacion si la observacion existe
      if (observacion) {
        //Se asigna el valor de la observacion al campo de observacion
        this.#idObservacion = observacionId

        this.#observacion.value = observacion.observacion
      } else {
        console.error('La observacion con el ID proporcionado no existe.')
      }
    } catch (error) {
      console.error('Error al obtener la observacion por ID:', error)
    }
  }


  //Se muestra mensaje de error
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.setOnCloseCallback(() => { })

    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }

}

customElements.define('observacion-promovente', ObservacionPromovente)
