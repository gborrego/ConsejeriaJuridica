import { APIModel } from '../../models/api.model'

 
export class Prueba extends HTMLElement {

  // Atributos de la clase variables privadas
  #api
  #idPrueba
  #prueba
  #pruebas
  #tablePruebas
  #botonAgregarPrueba
  #botonEditarPrueba


 
  //Metodo que se encarga de observar los cambios en los atributos de la clase
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
    const pruebas = this.#pruebas
    return { pruebas: pruebas }
  }

  //Metodo que se encarga de asignar el valor del atributo data
  //esto se hace con el fin de resetear todo lo relacionado con el componente
  set data(value) {
    this.#pruebas = value
    this.mostrarPruebas()
    this.setAttribute('data', value)
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('/components/registroProceso/prueba.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    
    //Inicialización de las variables privadas en este caso se inicializa el modelo de la API
    this.#api = new APIModel()
    //Inicializacion del idPrueba en null y pruebas en un arreglo vacio
    this.#idPrueba = null
    this.#pruebas = []

     //Llamada al metodo que se encarga de manejar los campos del formulario
    this.manageFormFields()
    //Llamada al metodo que se encarga de llenar los campos del formulario
    this.fillInputs()
  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()


  }

  //Metodo que se encarga de llenar o mandar a llamar el metodo que sen encarga de asignar los eventos a los botones
  fillInputs() {
    //Llamada al metodo que se encarga de asignar los eventos a los botones
    this.agregarEventosBotones()
  }

  //Metodo que se encarga de asignar los eventos a los botones
  agregarEventosBotones = () => {
     //Se obtienen los botones de agregar y editar pruebas y se les asigna el evento de click
    this.#botonAgregarPrueba.addEventListener('click', this.agregarPrueba)
    this.#botonEditarPrueba.addEventListener('click', this.editarPrueba)

    //Obtencion de los los botones de seleccionar prueba que se realizaron en la tabla
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-prueba')

    //Se recorre la lista de botones de seleccionar prueba y se les asigna el evento de click
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const pruebaId = boton.value
        this.#idPrueba = pruebaId
        //Se llama al metodo que se encarga de activar el boton de seleccionar prueba
        this.activarBotonSeleccionarPrueba(pruebaId)
      })
    })

    //Se crea una funcion que se encarga de activar el boton de seleccionar prueba
    const activarBotonSeleccionarPrueba = (pruebaId) => {
      this.activarBotonSeleccionarPrueba(pruebaId)
    }

    window.activarBotonSeleccionarPrueba = activarBotonSeleccionarPrueba

  }
  #limite = 5
  #actual = 0
  //Metodo que se encarga de agregar una prueba
  agregarPrueba = async () => {
     if(this.#actual<this.#limite){
 //Variable que nos ayuda a determinar si una prueba ha sido seleccionada
 //con el fin de verificar si se puede agregar una nueva prueba
    const idPrueba = this.#idPrueba

    //Si no se ha seleccionado una prueba se procede a agregar una nueva prueba
    if (idPrueba === null) {
       
      //ASignacion de la variable prueba con el valor del campo de prueba
      const prueba = this.#prueba.value
       
      //Se verifica si el campo de prueba esta vacio y se muestra un mensaje de error o si el campo de prueba tiene mas de 200 caracteres
      if (prueba === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de prueba es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      }
      else
      //Verificacion de que el campo de prueba no tenga mas de 200 caracteres
        if (prueba.length > 200) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'El campo de prueba no puede contener más de 200 caracteres.'
          modal.title = 'Error de validación'
          modal.open = true
        } else {
          //En caso de que el campo de prueba no este vacio y no tenga mas de 200 caracteres se procede a agregar la prueba
          if (prueba !== '' && prueba.length <= 200) {
             
                /*
            //Asignacion de la variable pruebaData con el valor del campo de prueba
            const pruebaData = {
              descripcion_prueba: prueba
            }
            //Se agrega la prueba al arreglo de pruebas
            this.#pruebas.push(pruebaData)
            //Se llama al metodo que se encarga de mostrar las pruebas
            this.mostrarPruebas()
            this.#actual++
            //Se reinician las variables idPrueba y prueba
            this.#prueba.value = ''
            */
            const modal = document.querySelector('modal-warning')
            modal.message = 'Si esta seguro de agregar la prueba presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de agregar prueba?'

            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false

                  //Asignacion de la variable pruebaData con el valor del campo de prueba
                  const pruebaData = {
                    descripcion_prueba: prueba
                  }
                  //Se agrega la prueba al arreglo de pruebas
                  this.#pruebas.push(pruebaData)
                  //Se llama al metodo que se encarga de mostrar las pruebas
                  this.mostrarPruebas()
                  this.#actual++
                  //Se reinician las variables idPrueba y prueba
                  this.#prueba.value = ''
                }
              }
            }
            );
            modal.open = true
          } else {
            //Mensaje de error en caso de que el campo de prueba este vacio
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {});

            modal.message = 'El campo de prueba es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
        }
    }
    else {
      //En caso de que si se haya seleccionado una prueba se muestra un mensaje de error
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});

      modal.message = 'No se puede agregar una prueba si ha selecionado previamente una de la tabla, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#idPrueba = null
      this.#prueba.value = ''
    }
  }else{
    const modal = document.querySelector('modal-warning')
    modal.setOnCloseCallback(() => {});

    modal.message = 'Limite de 5 pruebas durante el registro de un proceso, sin embargo puede registrar nuevos en la seccion de continuacion de proceso'
    modal.title = 'Error de validación'
    modal.open = true
  }
  }

  //Metodo que se encarga de editar una prueba
  editarPrueba = async () => {
    //Variable que nos ayuda a determinar si una prueba ha sido seleccionada
    //con el fin de verificar si se puede editar una prueba
    const idPrueba = this.#idPrueba

    //Si no se ha seleccionado una prueba se muestra un mensaje de error
    if (idPrueba === null) {
       //Muestra de mensaje de error en caso de que no se haya seleccionado una prueba
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});

      modal.message = 'Debe seleccionar una prueba para poder editarla.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //En caso de que si se haya seleccionado una prueba se procede a editar la prueba
      const prueba = this.#prueba.value

      //Se verifica si el campo de prueba esta vacio y se muestra un mensaje de error o si el campo de prueba tiene mas de 200 caracteres
      if (prueba === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de prueba es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else
//Verificacion de que el campo de prueba no tenga mas de 200 caracteres
        if (prueba.length > 200) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'El campo de prueba no puede contener más de 200 caracteres.'
          modal.title = 'Error de validación'
          modal.open = true
        } else {
          //En caso de que el campo de prueba no este vacio y no tenga mas de 200 caracteres se procede a editar la prueba
          if (prueba !== '' && prueba.length <= 200) {
            /*
            //Asignacion de la variable pruebaData con el valor del campo de prueba
            const pruebaData = {
              descripcion_prueba: prueba
            }
            //Se edita la prueba en el arreglo de pruebas
            this.#pruebas[idPrueba - 1] = pruebaData
            //Se llama al metodo que se encarga de mostrar las pruebas
            this.mostrarPruebas()
            //Se reinician las variables idPrueba y prueba
            this.#idPrueba = null
            this.#prueba.value = ''
            */
            const modal = document.querySelector('modal-warning')
            modal.message = 'Si esta seguro de editar la prueba presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de editar prueba?'

            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false

                  //Asignacion de la variable pruebaData con el valor del campo de prueba
                  const pruebaData = {
                    descripcion_prueba: prueba
                  }
                  //Se edita la prueba en el arreglo de pruebas
                  this.#pruebas[idPrueba - 1] = pruebaData
                  //Se llama al metodo que se encarga de mostrar las pruebas
                  this.mostrarPruebas()
                  //Se reinician las variables idPrueba y prueba
                  this.#idPrueba = null
                  this.#prueba.value = ''
                }
              }
            }
            );
            modal.open = true
            
          } else {
            //Mensaje de error en caso de que el campo de prueba este vacio
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {});

            modal.message = 'El campo de prueba es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
        }
    }
  }

  //Metodo que se encarga de mostrar las pruebas
  mostrarPruebas = async () => {


    try {
      //Se obtienen las pruebas
      const pruebas = this.#pruebas
      //Se obtiene el cuerpo de la tabla de pruebas
      const tableBody = this.#tablePruebas
      //Se limpia el cuerpo de la tabla de pruebas
      tableBody.innerHTML = ''
      //Se recorre la lista de pruebas y se agregan al cuerpo de la tabla
      const lista = pruebas
      const funcion =
        lista.forEach((prueba, i) => {
          const row = document.createElement('tr')
          row.innerHTML = `
            <tr id="prueba-${i + 1}">
            <td class="px-6 py-4 whitespace-nowrap">${i + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap">${prueba.descripcion_prueba}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-prueba" onclick="activarBotonSeleccionarPrueba(this.value)" value="${i + 1}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `
          tableBody.appendChild(row)
        })
    } catch (error) {
      console.error('Error al obtener las pruebas:', error)
    }
  }

  //Metodo que se encarga de activar el boton de seleccionar prueba
  activarBotonSeleccionarPrueba = async pruebaId => {

    try {

      //Se obtiene la prueba por ID
      const prueba = this.#pruebas[pruebaId - 1]
      //Se verifica si la prueba existe
      if (prueba) {
        //Se asigna el valor de la prueba al campo de prueba
        this.#idPrueba = pruebaId
        this.#prueba.value = prueba.descripcion_prueba
      } else {
        console.error('La prueba con el ID proporcionado no existe.')
      }
    } catch (error) {
      console.error('Error al obtener la prueba por ID:', error)
    }
  }

  //Metodo que se encarga de manejar los campos del formulario
  manageFormFields() {
    this.#prueba = this.shadowRoot.getElementById('prueba')
    this.#tablePruebas = this.shadowRoot.getElementById('table-prueba')

    this.#botonAgregarPrueba = this.shadowRoot.getElementById('agregar-prueba')
    this.#botonEditarPrueba = this.shadowRoot.getElementById('editar-prueba')
   //Llamada al metodo que se encarga de manejar la entrada de texto
   this.manejadorEntradaTexto()

  }

  //Metodo que se encarga de establecer un limite de caracteres en el campo de prueba 
  manejadorEntradaTexto(){
    var pruebaInput = this.#prueba
    pruebaInput.addEventListener('input', function () {
      if (pruebaInput.value.length > 200) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo prueba no puede tener más de 200 caracteres'
        modal.title = 'Error'
        modal.open = true
      }
    })

  }

  connectedCallback() {

  }

   //Metodo que se encarga de mostra un mensaje modal de advertencia
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.setOnCloseCallback(() => { })

    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }

}

customElements.define('prueba-promovente', Prueba)
