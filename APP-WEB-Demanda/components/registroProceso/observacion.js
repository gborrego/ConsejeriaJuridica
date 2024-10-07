import { APIModel } from '../../models/api.model'



export class ObservacionPromovente extends HTMLElement {
  //Variables de la clase
  #api
  #idObservacion
  #observacion
  #observaciones
  #tableObservaciones
  #botonAgregarObservacion
  #botonEditarObservacion

  //Metodos que obtiene los atributos del componente 
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo que obtiene el id del componente
  get id() {
    return this.getAttribute('id')
  }

  //Metodo que asigna el id del componente
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que obtiene los datos del componente
  get data() {
    const observaciones = this.#observaciones
    return {
      observaciones: observaciones
    }
  }

  //Metodo que asigna los datos del componente
  //que de igual manera nos ayuda a resetar el componente con el valor de data
  set data(value) {
    this.#observaciones = value
    this.mostrarObservaciones()
    this.setAttribute('data', value)
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('/components/registroProceso/observacion.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));

    //Inicialización de variables
    this.#api = new APIModel()
    //Se establece el valor del idObvervacion en null 
    this.#idObservacion = null
    //Se establece el valor de observaciones en un arreglo vacio
    this.#observaciones = []
    //Llamado de los metodos en este caso el de manageFormFields y fillInputs
    this.manageFormFields()
    //Llamado de los metodos en este caso el de fillInputs
    this.fillInputs()
  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()

  }

  //Metodo que se encarga de asignar los valores a los campos del formulario
  manageFormFields() {
    //Asignacion de los campos del formulario a las variables
    this.#observacion = this.shadowRoot.getElementById('observacion')
    this.#tableObservaciones = this.shadowRoot.getElementById('table-observacion')
    this.#botonAgregarObservacion = this.shadowRoot.getElementById('agregar-observacion')
    this.#botonEditarObservacion = this.shadowRoot.getElementById('editar-observacion')
    //Llamado del metodo manejadorEntradaTexto
    this.manejadorEntradaTexto()
  }

  //Metodo que se encarga de validar la longitud del campo de observacion 
  manejadorEntradaTexto() {
    var observacionInput = this.#observacion
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

  //Metodo que se encarga de llamar al metodo que se encarga de agregar eventos a los botones
  fillInputs() {
    //Llamado del metodo agregarEventosBotones 
    this.agregarEventosBotones()
  }
  //Metodo que se encarga de agregar eventos a los botones
  agregarEventosBotones = () => {
    //Asignacion de los eventos a los botones
    this.#botonAgregarObservacion.addEventListener('click', this.agregarObservacion)
    this.#botonEditarObservacion.addEventListener('click', this.editarObservacion)

    //Consulta de todos los botones relaciones con la observacion creados en el metodo de mostrar observaciones
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-observacion')

    //Iteracion de los botones para asignarles un evento
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const observacionId = boton.value
        this.#idObservacion = observacionId
        // Llamado de la funcion activarBotonSeleccionarObservacion
        this.activarBotonSeleccionarObservacion(observacionId)
      })
    })

    //Funcion que se encarga de activar el boton de seleccionar observacion
    const activarBotonSeleccionarObservacion = (observacionId) => {
      this.activarBotonSeleccionarObservacion(observacionId)
    }


    window.activarBotonSeleccionarObservacion = activarBotonSeleccionarObservacion
  }

  //Metodo que se encarga de mostrar las observaciones en la tabla
  mostrarObservaciones = async () => {

    try {
      //Asignacion de las observaciones a la variable observaciones
      const observaciones = this.#observaciones
      //Asignacion de la tabla de observaciones a la variable tableBody
      const tableBody = this.#tableObservaciones
      //Limpieza de la tabla
      tableBody.innerHTML = ''
      //Iteracion de las observaciones para mostrarlas en la tabla
      const lista = observaciones
      const funcion =
        lista.forEach((observacion, i) => {
          const row = document.createElement('tr')
          row.innerHTML = `
            <tr id="observacion-${i + 1}">
            <td class="px-6 py-4 whitespace-nowrap">${i + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap">${observacion.observacion}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-observacion" onclick="activarBotonSeleccionarObservacion(this.value)" value="${i + 1}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `
          tableBody.appendChild(row)
        })
    } catch (error) {
      console.error('Error al obtener las observaciones:', error)
    }
  }

  //Metodo que se encarga de editar una observacion
  editarObservacion = async () => {

    //Asignacion del id de la observacion a la variable observacionId 
    //con el fin de validar si se ha seleccionado una observacion y asi poder editarla o caso contrario mostrar un mensaje de error
    const observacionId = this.#idObservacion

    //Validacion de si se ha seleccionado una observacion
    if (observacionId == null) {
      //Mensaje de error si no se ha seleccionado una observacion
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });

      modal.message = 'Seleccione una observación para editar.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Asignacion de la observacion a la variable observacion
      const observacion = this.#observacion.value

      //Se valida si el campo de observacion esta vacio o si tiene mas de 200 caracteres
      if (observacion === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El campo de observación es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      }
      else
        if (observacion.length > 200) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });

          modal.message = 'El campo de observación no puede contener más de 200 caracteres.'
          modal.title = 'Error de validación'
          modal.open = true
        } else {
          //En caso de que el campo de observacion no este vacio y tenga menos de 200 caracteres se procede a editar la observacion
          if (observacion !== '' && observacion.length <= 200) {
           /*
            //Se asigna la observacion a la variable observacionData
            const observacionData = {
              observacion: observacion
            }
            //Se asigna la observacion a la posicion del arreglo de observaciones
            this.#observaciones[observacionId - 1] = observacionData
            //Se muestra la observacion en la tabla
            this.mostrarObservaciones()
            //Se limpian los campos de observacion
            this.#idObservacion = null
            this.#observacion.value = ''
            */
            const modal = document.querySelector('modal-warning')
            modal.message = 'Si esta seguro de editar la observacion presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de editar observacion?'

            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false
                  //Se asigna la observacion a la variable observacionData
                  const observacionData = {
                    observacion: observacion
                  }
                  //Se asigna la observacion a la posicion del arreglo de observaciones
                  this.#observaciones[observacionId - 1] = observacionData
                  //Se muestra la observacion en la tabla
                  this.mostrarObservaciones()
                  //Se limpian los campos de observacion
                  this.#idObservacion = null
                  this.#observacion.value = ''
                }
              }
            }
            );
            modal.open = true
          } else {
            //Mensaje de error si no se ha seleccionado una observacion
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => { });

            modal.message = 'El campo de observación es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
        }
    }

  }
  #limite = 5
  #actual = 0


  //Metodo que se encarga de agregar una observacion
  agregarObservacion = async () => {
    if (this.#actual < this.#limite) {
      //Asignacion del id de la observacion a la variable idObservacion
      //con el fin de validar si se ha seleccionado una observacion y asi poder agregar una nueva observacion o caso contrario mostrar un mensaje de error
      const idObservacion = this.#idObservacion

      //Validacion de si se ha seleccionado una observacion
      if (idObservacion === null) {
        //En caso de que no se haya seleccionado una observacion se procede a agregar una nueva observacion

        const observacion = this.#observacion.value

        //Se valida si el campo de observacion esta vacio o si tiene mas de 200 caracteres
        if (observacion === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });

          modal.message = 'El campo de observación es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }
        else
          if (observacion.length > 200) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => { });

            modal.message = 'El campo de observación no puede contener más de 200 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else {

            //En caso de que el campo de observacion no este vacio y tenga menos de 200 caracteres se procede a agregar la observacion
            if (observacion !== '' && observacion.length <= 200) {
        
           /*
              //Se asigna la observacion a la variable observacionData
              const observacionData = {
                observacion: observacion
              }
              //Se agrega la observacion al arreglo de observaciones
              this.#observaciones.push(observacionData)
              //Se muestra la observacion en la tabla
              this.mostrarObservaciones()
              this.#actual++
              //Se limpian los campos de observacion
              this.#observacion.value = ''
              */

              const modal = document.querySelector('modal-warning')
              modal.message = 'Si esta seguro de agregar la observacion presione aceptar, de lo contrario presione x para cancelar.'
              modal.title = '¿Confirmacion de agregar observacion?'

              modal.setOnCloseCallback(() => {
                if (modal.open === 'false') {
                  if (modal.respuesta === true) {
                    modal.respuesta = false

                    //Se asigna la observacion a la variable observacionData
                    const observacionData = {
                      observacion: observacion
                    }
                    //Se agrega la observacion al arreglo de observaciones
                    this.#observaciones.push(observacionData)
                    //Se muestra la observacion en la tabla
                    this.mostrarObservaciones()
                    this.#actual++
                    //Se limpian los campos de observacion
                    this.#observacion.value = ''
                  }
                }
              }
              );
              modal.open = true
            } else {
              //Mensaje de error si no se ha seleccionado una observacion
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => { });

              modal.message = 'El campo de observación es obligatorio.'
              modal.title = 'Error de validación'
              modal.open = true
            }
          }
      }
      else {
        //Mensaje de error si se ha seleccionado una observacion 
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'No se puede agregar una observación si ha selecionado previamente una de la tabla, se eliminaran los campos.'
        modal.title = 'Error de validación'
        modal.open = true
        this.#idObservacion = null
        this.#observacion.value = ''

      }
    } else {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });

      modal.message = 'Limite de 5 observaciones durante el registro de un proceso, sin embargo puede registrar nuevos en la seccion de continuacion de proceso'
      modal.title = 'Error de validación'
      modal.open = true
    }
  }

  //Metodo que se encarga de activar el boton de seleccionar observacion
  activarBotonSeleccionarObservacion = async observacionId => {
    try {
      // se obtiene la observacion por ID
      const observacion = this.#observaciones[observacionId - 1]
      //Validacion de si la observacion existe
      if (observacion) {
        // se asigna la observacion a los campos del formulario
        this.#idObservacion = observacionId
        this.#observacion.value = observacion.observacion
      } else {
        console.error('La observacion con el ID proporcionado no existe.')
      }
    } catch (error) {
      console.error('Error al obtener la observacion por ID:', error)
    }
  }
  connectedCallback() {

  }

  //Metodo que se encarga de mostrar un modal de advertencia
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
