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

  #limite = 5
  #actual = 0

  //Metodo que obtiene los atributos que se le pasan al componente en este caso id y data
  static get observedAttributes() {
    return ['id', 'data']
  }
  //Metodo que obtiene el id del componente
  get id() {
    return this.getAttribute('id')
  }

  //Metodo que setea el id del componente
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que obtiene los datos del componente
  get data() {
    const estadosProcesales = this.#estadosProcesales
    return { estadosProcesales: estadosProcesales }
  }

  //Metodo que setea los datos del componente esto es con el fin de que se pueda setear los datos desde fuera caso
  //en el que selecciona un nuevo turno
  set data(value) {
    this.#estadosProcesales = value
    this.mostrarEstadosProcesales()
    this.setAttribute('data', value)
  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('/components/registroProceso/estado-procesal.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));

    //Se inicializa la variable de la API
    this.#api = new APIModel()
    //Se inicializan las variables privadas de la clase
    //En este caso el idEstadoProcesal es el id del estado procesal seleccionado y los estadosProcesales es un arreglo
    this.#idEstadoProcesal = null
    this.#estadosProcesales = []
    //Llamado a la funcion que maneja los campos del formulario
    this.manageFormFields()
    //Llamado a la funcion que llena los campos del formulario
    this.fillInputs()
  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()


  }

  //Metodo que inicializa los campos del formulario
  manageFormFields() {
    //Se asignan las variables a los campos del formulario y a los botones
    this.#estadoProcesal = this.shadowRoot.getElementById('estado')
    this.#fechaEstadoProcesal = this.shadowRoot.getElementById('fecha-estado')
    this.#tableEstadosProcesales = this.shadowRoot.getElementById('table-estado')
    this.#botonAgregarEstadoProcesal = this.shadowRoot.getElementById('agregar-estado')
    this.#botonEditarEstadoProcesal = this.shadowRoot.getElementById('editar-estado')

    //Evento que valida que el campo de estado procesal no tenga más de 200 caracteres
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


  //Metodo que manda a llamar al metodo de agregar eventos a los botones
  fillInputs() {
    //Llamado al metodo que agrega los eventos a los botones
    this.agregarEventosBotones()
  }

  //Metodo que agrega los eventos a los botones
  agregarEventosBotones = () => {
    //Asignacion de las variables a los botones
    this.#botonAgregarEstadoProcesal.addEventListener('click', this.agregarEstadoProcesal)
    this.#botonEditarEstadoProcesal.addEventListener('click', this.editarEstadoProcesal)

    //Se obtienen todos los botones de seleccionar estado
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-estado')

    //Se recorre cada boton y se le asigna un evento
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const estadoProcesalId = boton.dataset.id
        this.#idEstadoProcesal = estadoProcesalId
        //Se llama a la funcion que activa el boton de seleccionar estado
        this.llamarActivarBotonSeleccionarEstado(estadoProcesalId)
      })
    })



    //Se crea una funcion que se le asigna a una variable global para poder ser llamada desde fuera del componente
    const llamarActivarBotonSeleccionarEstado = (estadoProcesalId) => {
      this.llamarActivarBotonSeleccionarEstado(estadoProcesalId)
    }

    window.llamarActivarBotonSeleccionarEstado = llamarActivarBotonSeleccionarEstado

  }

  //Metodo que agrega un estado procesal
  agregarEstadoProcesal = async () => {
    if (this.#actual < this.#limite) {
      //De igual manera que en codigos anteriores el idEstadoProcesal es el id del estado procesal seleccionado
      const estadoProcesalID = this.#idEstadoProcesal
      //Se valida que no se haya seleccionado un estado procesal previamente
      if (estadoProcesalID === null) {
        //Se obtienen los valores de los campos del formulario
        const estadoProcesal = this.#estadoProcesal.value
        const fechaEstadoProcesal = this.#fechaEstadoProcesal.value

        //Se valida que el campo de estado procesal no este vacio y que no tenga más de 200 caracteres
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

        //Se valida que el campo de fecha de estado procesal no este vacio 
        if (fechaEstadoProcesal === '') {
          this.#showModal('La fecha de estado procesal no puede estar vacia', 'Error')
        }
        else {
          //Se valida que el estado procesal no este vacio, que la fecha de estado procesal no este vacia y que el estado procesal no tenga más de 100 caracteres
          if (estadoProcesal !== '' && fechaEstadoProcesal !== '' && estadoProcesal.length <= 100) {
        
           /*
            //Se crea un objeto con los datos del estado procesal
            const estadoProcesalData = {
              descripcion_estado_procesal: estadoProcesal,
              fecha_estado_procesal: fechaEstadoProcesal
            }
            this.#actual++
            //Se agrega el estado procesal al arreglo de estados procesales
            this.#estadosProcesales.push(estadoProcesalData)
            //Se llama a la funcion que muestra los estados procesales
            this.mostrarEstadosProcesales()
            //Se limpian los campos del formulario
            this.#estadoProcesal.value = ''
            this.#fechaEstadoProcesal.value = ''
            */
             const modal = document.querySelector('modal-warning')
              modal.message = 'Si esta seguro de agregar el estado procesal presione aceptar, de lo contrario presione x para cancelar.'
              modal.title = '¿Confirmacion de agregar estado procesal?'
              modal.setOnCloseCallback(() => {
                if (modal.open === 'false') {
                  if (modal.respuesta === true) {
                    modal.respuesta = false
                    //Se crea un objeto con los datos del estado procesal
                    const estadoProcesalData = {
                      descripcion_estado_procesal: estadoProcesal,
                      fecha_estado_procesal: fechaEstadoProcesal
                    }
                    this.#actual++
                    //Se agrega el estado procesal al arreglo de estados procesales
                    this.#estadosProcesales.push(estadoProcesalData)
                    //Se llama a la funcion que muestra los estados procesales
                    this.mostrarEstadosProcesales()
                    //Se limpian los campos del formulario
                    this.#estadoProcesal.value = ''
                    this.#fechaEstadoProcesal.value = ''
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
        //Caso cuando un estado procesal ya ha sido seleccionado se muestra un mensaje de error
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'No se puede agregar un estado procesal si ha selecionado previamente uno de la tabla, se eliminaran los campos.'
        modal.title = 'Error de validación'
        modal.open = true
        this.#idEstadoProcesal = null
        this.#estadoProcesal.value = ''
        this.#fechaEstadoProcesal.value = ''
      }
    } else {
      //Caso cuando se ha llegado al limite de estados procesales
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });
      modal.message = 'Limite de 5 estados procesales durante el registro de un proceso, sin embargo puede registrar nuevos en la seccion de continuacion de proceso'
      modal.title = 'Error de validación'
      modal.open = true
    }


  }

  //Metodo que se encarga de editar un estado procesal
  editarEstadoProcesal = async () => {
    //Se obtiene el id del estado procesal seleccionado previamente con el fin de saber si se ha seleccionado alguno para poder editarlo o 
    //caso contrario mostrar un mensaje de error al usuario
    const estadoProcesalID = this.#idEstadoProcesal
    if (estadoProcesalID === null) {
      //Se muestra un mensaje de error al usuario ya que no ha seleccionado un estado procesal
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });

      modal.message = 'Debe seleccionar un estado procesal para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Se obtienen los valores de los campos del formulario
      const estadoProcesal = this.#estadoProcesal.value
      const fechaEstadoProcesal = this.#fechaEstadoProcesal.value

      //Se valida que el campo de estado procesal no este vacio y que no tenga más de 100 caracteres
      if (estadoProcesal === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El campo de estado procesal es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else

        if (estadoProcesal.length > 100) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });

          modal.message = 'El campo de estado procesal no puede contener más de 100 caracteres.'
          modal.title = 'Error de validación'
          modal.open = true
        }

      //Se valida que el campo de fecha de estado procesal no este vacio
      if (fechaEstadoProcesal === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El campo de fecha de estado procesal es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else {


        const fechaActual = new Date();
        fechaActual.setUTCHours(0, 0, 0, 0); // Establecer hora UTC

        // Obtener la fecha ingresada desde tu input HTML (asegúrate de obtener el valor correctamente)
        const fechaIngresada = new Date(fechaEstadoProcesal);
        fechaIngresada.setUTCHours(0, 0, 0, 0); // Establecer hora UTC

        //Se valida que el estado procesal no este vacio, que la fecha de estado procesal no este vacia y que el estado procesal no tenga más de 100 caracteres
        if (estadoProcesal !== '' && fechaEstadoProcesal !== '' && estadoProcesal.length <= 100) {
          //Se crea un objeto con los datos del estado procesal
          /*
          const estadoProcesalData = {
            descripcion_estado_procesal: estadoProcesal,
            fecha_estado_procesal: fechaEstadoProcesal

          }
          //Se actualiza el estado procesal en el arreglo de estados procesales 
          this.#estadosProcesales[estadoProcesalID - 1] = estadoProcesalData
          //Se llama a la funcion que muestra los estados procesales
          this.mostrarEstadosProcesales()
          //Se limpian los campos del formulario y del idSeleccionado
          this.#idEstadoProcesal = null
          this.#estadoProcesal.value = ''
          this.#fechaEstadoProcesal.value = ''
          */
          const modal = document.querySelector('modal-warning')
          modal.message = 'Si esta seguro de editar el estado procesal presione aceptar, de lo contrario presione x para cancelar.'
          modal.title = '¿Confirmacion de editar estado procesal?'

          modal.setOnCloseCallback(() => {
            if (modal.open === 'false') {
              if (modal.respuesta === true) {
                modal.respuesta = false
                //Se crea un objeto con los datos del estado procesal
                const estadoProcesalData = {
                  descripcion_estado_procesal: estadoProcesal,
                  fecha_estado_procesal: fechaEstadoProcesal

                }
                //Se actualiza el estado procesal en el arreglo de estados procesales 
                this.#estadosProcesales[estadoProcesalID - 1] = estadoProcesalData
                //Se llama a la funcion que muestra los estados procesales
                this.mostrarEstadosProcesales()
                //Se limpian los campos del formulario y del idSeleccionado
                this.#idEstadoProcesal = null
                this.#estadoProcesal.value = ''
                this.#fechaEstadoProcesal.value = ''
              }
            }
          }
          );
          modal.open = true
        }
        //  }
      }
    }
  }

  //Metodo que muestra los estados procesales en la tabla
  mostrarEstadosProcesales = async () => {

    try {
      //Se obtienen los estados procesales
      const estadosProcesales = this.#estadosProcesales
      //Se obtiene el cuerpo de la tabla
      const tableBody = this.#tableEstadosProcesales
      //Se limpia el cuerpo de la tabla
      tableBody.innerHTML = ''
      //Se recorre la lista de estados procesales
      const lista = estadosProcesales
      const funcion =
        lista.forEach((estadoProcesal, i) => {
          const row = document.createElement('tr')
          row.innerHTML = `
            <tr id="estado-${i + 1}">
            <td class="px-6 py-4 whitespace-nowrap">${i + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap">${estadoProcesal.descripcion_estado_procesal}</td>
            <td class="px-6 py-4 whitespace-nowrap">${estadoProcesal.fecha_estado_procesal}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-estado" onclick="llamarActivarBotonSeleccionarEstado(this.value)" value="${i + 1}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `
          tableBody.appendChild(row)
        })
    } catch (error) {
      console.error('Error al obtener los estados procesales:', error)
    }


  }

  //Metodo que se encarga de activar el boton de seleccionar estado y que llena los campos del formulario
  llamarActivarBotonSeleccionarEstado = async estadoProcesalId => {
    try {
      //Se obtiene el estado procesal por el id seleccionado
      const estadoProcesal = this.#estadosProcesales[estadoProcesalId - 1]
      //Se valida que el estado procesal exista
      if (estadoProcesal) {
        //Se llena los campos del formulario con los datos del estado procesal seleccionado
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

  //Metodo que se encarga de mostrar el modal de error al usuario
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
