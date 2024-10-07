import { APIModel } from '../../models/api.model'



export class Resolucion extends HTMLElement {

  //Variables privadas
  #api
  #idResolucion
  #resolucion
  #fechaResolucion
  #resoluciones
  #tableResoluciones
  #botonAgregarResolucion
  #botonEditarResolucion



  //Metodo que se encarga de observar los cambios en los atributos 
  //y obtener los valores de los mismos
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo que se encarga de obtener el valor del atributo id
  get id() {
    return this.getAttribute('id')
  }

  //Metodo que se encarga de asignar el valor del atributo id
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que se encarga de obtener el valor del atributo data
  get data() {
    const resoluciones = this.#resoluciones
    return { resoluciones: resoluciones }
  }

  //Metodo que se encarga de asignar el valor del atributo data
  set data(value) {
    this.#resoluciones = value
    this.mostrarResoluciones()
    this.setAttribute('data', value)
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('/components/registroProceso/resolucion.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Asignación de variables privadas en este caso se asigna la variable api
    this.#api = new APIModel()

    //Se inicializa el valor de idResolucion en null 
    this.#idResolucion = null
    // Se inicializa el valor de resoluciones en un arreglo vacio
    this.#resoluciones = []
    //Llamado a la función manageFormFields
    this.manageFormFields()
    //Llamado a la función fillInputs
    this.fillInputs()
  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()

  }
  //Metodo que se encarga de mandar al metodo responsable de llenar los eventos de los botones
  fillInputs() {
    //Llamado a la función agregarEventosBotones
    this.agregarEventosBotones()
  }

  //Metodo que se encarga de manejar los campos del formulario
  manageFormFields() {
    //Asignación de variables privadas
    this.#resolucion = this.shadowRoot.getElementById('condiciones')
    this.#fechaResolucion = this.shadowRoot.getElementById('fecha-resolucion')
    this.#tableResoluciones = this.shadowRoot.getElementById('table-resolucion')
    this.#botonAgregarResolucion = this.shadowRoot.getElementById('agregar-resolucion')
    this.#botonEditarResolucion = this.shadowRoot.getElementById('editar-resolucion')

    //Llamado a la función manejadorEntradaTexto
    this.manejadorEntradaTexto()


  }

  //Metodo que se encarga de manejar la entrada de texto en el campo de resolución
  manejadorEntradaTexto() {
    var resolucionInput = this.#resolucion

    resolucionInput.addEventListener('input', function () {
      if (resolucionInput.value.length > 200) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El campo de resolución no puede contener más de 200 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }

    })
  }

  //Metodo que se encarga de agregar los eventos a los botones
  agregarEventosBotones = () => {

    //Se agrega el evento click al boton agregar resolución
    this.#botonAgregarResolucion.addEventListener('click', this.agregarResolucion)
    this.#botonEditarResolucion.addEventListener('click', this.editarResolucion)

    //Se obtienen todos los botones con la clase seleccionar-resolucion creados en la tabla de resoluciones
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-resolucion')

    //Se recorre el arreglo de botones y se agrega el evento click a cada uno de ellos
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const resolucionId = boton.value
        this.#idResolucion = resolucionId
        //Se llama a la función activarBotonSeleccionarResolucion
        this.activarBotonSeleccionarResolucion(resolucionId)
      })
    })

    //Se crea una función global para poder ser llamada desde el html
    const activarBotonSeleccionarResolucion = (resolucionId) => {
      this.activarBotonSeleccionarResolucion(resolucionId)
    }

    window.activarBotonSeleccionarResolucion = activarBotonSeleccionarResolucion
  }
  #limite = 5
  #actual = 0
  //Metodo que se encarga de agregar una resolución
  agregarResolucion = async () => {
    if (this.#actual < this.#limite) {
      //Se obtiene el valor de idResolucion
      //Si el valor es null se procede a agregar una resolución
      const resolucionID = this.#idResolucion
      // En caso de que el valor sea diferente de null se muestra un mensaje de error
      if (resolucionID === null) {
        //Se obtienen los valores de los campos resolución y fecha de resolución
        const resolucion = this.#resolucion.value
        const fechaResolucion = this.#fechaResolucion.value

        //Se valida que el campo de resolución no este vacio
        if (resolucion === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });

          modal.message = 'El campo de resolución es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Se valida que el campo de resolución no contenga más de 200 caracteres
        if (resolucion.length > 200) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });

          modal.message = 'El campo de resolución no puede contener más de 200 caracteres.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Se valida que el campo de fecha de resolución no este vacio
        if (fechaResolucion === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });

          modal.message = 'El campo de fecha de resolución es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        } else {



          const fechaActual = new Date();
          fechaActual.setUTCHours(0, 0, 0, 0); // Establecer hora UTC

          // Obtener la fecha ingresada desde tu input HTML (asegúrate de obtener el valor correctamente)
          const fechaIngresada = new Date(fechaResolucion);
          fechaIngresada.setUTCHours(0, 0, 0, 0); // Establecer hora UTC
          //en caso de que el campo de resolucion sea diferente de vacio, y que la fecha de resolucion no sea vacia
          //se procede a agregar la resolución
          if (resolucion !== '' && fechaResolucion !== '') {
            //Se crea un objeto con los valores de resolución y fecha de resolución
            

                /*
            const resolucionData = {
              resolucion: resolucion,
              fecha_resolucion: fechaResolucion

            }
            //Se agrega el objeto al arreglo de resoluciones
            this.#resoluciones.push(resolucionData)
            //Se llama a la función mostrarResoluciones
            this.mostrarResoluciones()
            this.#actual++
            //Se inicializa el valor de idResolucion en null
            this.#resolucion.value = ''
            this.#fechaResolucion.value = ''
            */
            const modal = document.querySelector('modal-warning')
            modal.message = 'Si esta seguro de agregar la resolucion presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de agregar resolucion?'

            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false
                  const resolucionData = {
                    resolucion: resolucion,
                    fecha_resolucion: fechaResolucion

                  }
                  //Se agrega el objeto al arreglo de resoluciones
                  this.#resoluciones.push(resolucionData)
                  //Se llama a la función mostrarResoluciones
                  this.mostrarResoluciones()
                  this.#actual++
                  //Se inicializa el valor de idResolucion en null
                  this.#resolucion.value = ''
                  this.#fechaResolucion.value = ''
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
        //En caso de que se haya seleccionado una resolución previamente se muestra un mensaje de error
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'No se puede agregar una resolución si ha selecionado previamente una de la tabla, se eliminaran los campos.'
        modal.title = 'Error de validación'
        modal.open = true
        this.#idResolucion = null
        this.#resolucion.value = ''
        this.#fechaResolucion.value = ''
      }
    } else {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });

      modal.message = 'Limite de 5 resoluciones durante el registro de un proceso, sin embargo puede registrar nuevos en la seccion de continuacion de proceso'
      modal.title = 'Error de validación'
      modal.open = true
    }
  }

  //Metodo que se encarga de editar una resolución
  editarResolucion = async () => {
    //Asignacion de la variable resolucionID con el valor de idResolucion
    //que nos ayuda a determinar si se ha seleccionado una resolución previamente
    const resolucionID = this.#idResolucion
    //En caso de que el valor sea null se muestra un mensaje de error
    if (resolucionID === null) {
      //Se muestra un mensaje de error
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });

      modal.message = 'Debe seleccionar una resolución para poder editarla.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Asignación de las variables resolucion y fechaResolucion con los valores de los campos
      const resolucion = this.#resolucion.value
      const fechaResolucion = this.#fechaResolucion.value

      //Se valida que el campo de resolución no este vacio
      if (resolucion === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El campo de resolución es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      }

      //Se valida que el campo de resolución no contenga más de 200 caracteres
      if (resolucion.length > 200) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El campo de resolución no puede contener más de 200 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }

      //Se valida que el campo de fecha de resolución no este vacio
      if (fechaResolucion === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El campo de fecha de resolución es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else {



        const fechaActual = new Date();
        fechaActual.setUTCHours(0, 0, 0, 0); // Establecer hora UTC

        // Obtener la fecha ingresada desde tu input HTML (asegúrate de obtener el valor correctamente)
        const fechaIngresada = new Date(fechaResolucion);
        fechaIngresada.setUTCHours(0, 0, 0, 0); // Establecer hora UTC

        //En caso de que el campo de resolucion sea diferente de vacio, y que la fecha de resolucion no sea vacia
        //se procede a editar la resolución
        if (resolucion !== '' && fechaResolucion !== '') {
             /*
          //Se crea un objeto con los valores de resolución y fecha de resolución
          const resolucionData = {
            resolucion: resolucion,
            fecha_resolucion: fechaResolucion

          }

          //Actualización de la resolución en el arreglo de resoluciones
          this.#resoluciones[resolucionID - 1] = resolucionData
          //Se llama a la función mostrarResoluciones
          this.mostrarResoluciones()
          //Se inicializa el valor de idResolucion en null
          this.#idResolucion = null
          // Se limpian los campos de resolución y fecha de resolución
          this.#resolucion.value = ''
          this.#fechaResolucion.value = ''
          */ 
          const modal = document.querySelector('modal-warning')
          modal.message = 'Si esta seguro de editar la resolucion presione aceptar, de lo contrario presione x para cancelar.'
          modal.title = '¿Confirmacion de editar resolucion?'

          modal.setOnCloseCallback(() => {
            if (modal.open === 'false') {
              if (modal.respuesta === true) {
                modal.respuesta = false
                const resolucionData = {
                  resolucion: resolucion,
                  fecha_resolucion: fechaResolucion

                }

                //Actualización de la resolución en el arreglo de resoluciones
                this.#resoluciones[resolucionID - 1] = resolucionData
                //Se llama a la función mostrarResoluciones
                this.mostrarResoluciones()
                //Se inicializa el valor de idResolucion en null
                this.#idResolucion = null
                // Se limpian los campos de resolución y fecha de resolución
                this.#resolucion.value = ''
                this.#fechaResolucion.value = ''
              }
            }
          }
          );
          modal.open = true
        }
        // }
      }

    }
  }

  //Metodo que se encarga de activar el boton seleccionar resolución
  activarBotonSeleccionarResolucion = (resolucionId) => {

    try {
      //Se obtiene la resolución por el ID proporcionado
      const resolucion = this.#resoluciones[resolucionId - 1]
      //En caso de que la resolución exista se asignan los valores de resolución y fecha de resolución
      if (resolucion) {
        //Asignación de los valores de resolución y fecha de resolución
        this.#idResolucion = resolucionId
        this.#resolucion.value = resolucion.resolucion
        this.#fechaResolucion.value = resolucion.fecha_resolucion
      } else {
        console.error('La resolución con el ID proporcionado no existe.')
      }
    } catch (error) {
      console.error('Error al obtener la resolución por ID:', error)

    }
  }

  //Metodo que se encarga de mostrar las resoluciones en la tabla
  mostrarResoluciones = async () => {

    try {
      //Se obtiene el arreglo de resoluciones
      const resoluciones = this.#resoluciones
      //Se obtiene el cuerpo de la tabla de resoluciones
      const tableBody = this.#tableResoluciones
      //Se limpia el cuerpo de la tabla
      tableBody.innerHTML = ''
      //Se recorre el arreglo de resoluciones y se agregan al cuerpo de la tabla
      const lista = resoluciones
      const funcion =
        lista.forEach((resolucion, i) => {
          const row = document.createElement('tr')
          row.innerHTML = `
          <tr id="resolucion-${i + 1}">
          <td class="px-6 py-4 whitespace-nowrap">${i + 1}</td>
          <td class="px-6 py-4 whitespace-nowrap">${resolucion.resolucion}</td>
          <td class="px-6 py-4 whitespace-nowrap">${resolucion.fecha_resolucion}</td>
          <td class="px-6 py-4 whitespace-nowrap">
          <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-resolucion" onclick="activarBotonSeleccionarResolucion(this.value)" value="${i + 1}">
          Seleccionar
        </button>
      
          </td>
      </tr>
          `
          tableBody.appendChild(row)
        })

    } catch (error) {
      console.error('Error al obtener las resoluciones:', error)
    }
  }

  connectedCallback() {

  }

  //Metodo que se encarga de mostrar un modal con un mensaje de error
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.setOnCloseCallback(() => { })

    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }


}

customElements.define('resolucion-promovente', Resolucion)
