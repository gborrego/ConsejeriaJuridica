import { APIModel } from '../../models/api.model'


export class Prueba extends HTMLElement {

  //Variables privadas de la clase 
  #api

  #idPrueba
  #prueba
  #pruebas
  #tablePruebas

  #botonAgregarPrueba
  #botonEditarPrueba


  //Metodo que se ejecuta cuando se quiere obtener el valor de un atributo 
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo que obtiene el valor del atributo de ID
  get id() {
    return this.getAttribute('id')
  }

  //Metodo que establece el valor del atributo de ID
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que retorna el valor del atributo de DATA
  get data() {
    const pruebas = this.#pruebas
    return { pruebas: pruebas }
  }



  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('/components/seguimientoProceso/prueba.html')).text();
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
      const { pruebas } = await this.#api.getPruebasBusqueda(this.#idProcesoJudicial, false, this.#pagina)
      this.#pruebas = pruebas
      this.getNumeroPaginas()
      this.mostrarPruebas()
    }
    catch (error) {
      this.#pruebas = []
      const total = this.shadowRoot.getElementById('total-p')
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
    const prev = this.shadowRoot.getElementById('anterior-p')
    const next = this.shadowRoot.getElementById('siguiente-p')
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
      const { totalPruebas } = await this.#api.getPruebasBusqueda(this.#idProcesoJudicial, true, 1)
      const total = this.shadowRoot.getElementById('total-p')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + totalPruebas
      this.#numeroPaginas = (totalPruebas) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de pruebas, intente de nuevo mas tarde o verifique el status del servidor';
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
    const table = this.#tablePruebas
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }


  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));

    //Inicialización de las variables privadas
    this.#api = new APIModel()
    this.#idPrueba = null
    this.#pruebas = []
    //Llamado al metodo que se encarga de manejar los campos del formulario
    this.manageFormFields()
    //LLamado al metodo que se encarga de llenar los campos del formulario
    this.fillInputs()
  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()


  }

  //Metodo que se encarga de llamar al metodo que se encarga de llenar los eventos de los botones
  fillInputs() {
    this.agregarEventosBotones()
    this.buttonsEventListeners()

  }


  //Metodo que se encarga de llenar los eventos de los botones
  agregarEventosBotones = () => {

    //Se añaade el evento de click al boton de agregar prueba
    this.#botonAgregarPrueba.addEventListener('click', this.agregarPrueba)
    //Se añaade el evento de click al boton de editar prueba
    this.#botonEditarPrueba.addEventListener('click', this.editarPrueba)
    //Obtenemos todos los botones de seleccionar prueba creados en el metodo de mostrarPruebas
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-prueba')

    //Se recorre cada boton de seleccionar prueba y se le añade un evento de click
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const pruebaId = boton.value
        this.#idPrueba = pruebaId
        //Se llama al metodo que activa el boton de seleccionar prueba
        this.activarBotonSeleccionarPrueba(pruebaId)
      })
    })

    //Metodo que se encarga de activar el boton de seleccionar prueba
    const activarBotonSeleccionarPrueba = (pruebaId) => {
      //Llamado al metodo que se encarga de activar el boton de seleccionar prueba
      this.activarBotonSeleccionarPrueba(pruebaId)
    }

    //Se añade la funcion al objeto window para que pueda ser llamada desde el html
    window.activarBotonSeleccionarPrueba = activarBotonSeleccionarPrueba
  }

  //Metodo que se encarga de agregar una prueba
  agregarPrueba = async () => {
    //Variable que nos ayuda a determinar se se ha selecionado una prueba de la tabla, y asi poder agregar una nueva o no
    const idPrueba = this.#idPrueba

    //Validamos si se ha seleccionado una prueba de la tabla
    if (idPrueba === null) {
      //Obtenemos el valor del campo de prueba
      const prueba = this.#prueba.value

      //Validamos si el campo de prueba esta vacio
      if (prueba === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de prueba es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else
        //Validamos si el campo de prueba tiene mas de 200 caracteres

        if (prueba.length > 200) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { })

          modal.message = 'El campo de prueba no puede contener más de 200 caracteres.'
          modal.title = 'Error de validación'
          modal.open = true
        } else {
          //Validamos si el campo de prueba no esta vacio y tiene menos de 200 caracteres
          if (prueba !== '' && prueba.length <= 200) {

            const modal = document.querySelector('modal-warning')
            modal.message = 'Si esta seguro de agregar la prueba presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de agregar prueba?'

            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false
                  //Creamos un objeto con la descripcion de la prueba
                  const pruebaData = {
                    descripcion_prueba: prueba,
                    id_proceso_judicial: this.#idProcesoJudicial
                  }
                  /*
                  //Añadimos la prueba al arreglo de pruebas
                  this.#pruebas.push(pruebaData)
                  //Llamamos al metodo que se encarga de mostrar las pruebas
                  this.mostrarPruebas()
                  //Limpiamos los campos del formulario
                  this.#prueba.value = ''
                  */
                  this.#api.postPrueba(pruebaData).then(() => {
                    this.cargaDatos()
                    this.#prueba.value = ''
                  }
                  ).catch(error => {
                    console.error('Error al agregar la prueba:', error)
                    const modal = document.querySelector('modal-warning')
                    modal.setOnCloseCallback(() => { });
                    modal.message = 'Error al agregar la prueba, intente de nuevo mas tarde o verifique el status del servidor.'
                    modal.title = 'Error'
                    modal.open = true
                  })

                }
              }
            }
            );
            modal.open = true

          } else {
            //Mostramos un mensaje de error si el campo de prueba esta vacio
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => { })

            modal.message = 'El campo de prueba es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
        }
    }
    else {
      //Mostramos un mensaje de error si se ha seleccionado una prueba de la tabla
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { })

      modal.message = 'No se puede agregar una prueba si ha selecionado previamente una de la tabla, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#idPrueba = null
      this.#prueba.value = ''
    }
  }

  //Metodo que se encarga de editar una prueba
  editarPrueba = async () => {
    //Obtenemos el id de la prueba seleccionada y asi poder editarla o no
    const idPrueba = this.#idPrueba
    //Validamos si se ha seleccionado una prueba de la tabla
    if (idPrueba === null) {
      //Mostramos un mensaje de error si no se ha seleccionado una prueba de la tabla
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { })

      modal.message = 'Debe seleccionar una prueba para poder editarla.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Obtenemos el valor del campo de prueba
      const prueba = this.#prueba.value

      //Validamos si el campo de prueba esta vacio
      if (prueba === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de prueba es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else
        //Validamos si el campo de prueba tiene mas de 200 caracteres
        if (prueba.length > 200) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { })

          modal.message = 'El campo de prueba no puede contener más de 200 caracteres.'
          modal.title = 'Error de validación'
          modal.open = true
        } else {

          //Validamos si el campo de prueba no esta vacio y tiene menos de 200 caracteres
          if (prueba !== '' && prueba.length <= 200) {


            const pruebaObtenida = await this.#api.getPruebaByID(idPrueba)

            if (pruebaObtenida.descripcion_prueba === prueba) {
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => { })

              modal.message = 'La prueba no ha sido modificada, ya que es igual a la anterior.'
              modal.title = 'Error de validación'
              modal.open = true
            }
            else {
              const modal = document.querySelector('modal-warning')
              modal.message = 'Si esta seguro de editar la prueba presione aceptar, de lo contrario presione x para cancelar.'
              modal.title = '¿Confirmacion de editar prueba?'

              modal.setOnCloseCallback(() => {
                if (modal.open === 'false') {
                  if (modal.respuesta === true) {
                    modal.respuesta = false

                    const pruebaData = {
                      id_prueba: idPrueba,
                      descripcion_prueba: prueba,
                      id_proceso_judicial: this.#idProcesoJudicial
                    }
              
                    this.#api.putPrueba(idPrueba, pruebaData).then(() => {
                      this.cargaDatos()
                      this.#idPrueba = null
                      this.#prueba.value = ''
                    }
                    ).catch(error => {
                      console.error('Error al editar la prueba:', error)
                      const modal = document.querySelector('modal-warning')
                      modal.setOnCloseCallback(() => { });
                      modal.message = 'Error al editar la prueba, intente de nuevo mas tarde o verifique el status del servidor.'
                      modal.title = 'Error'
                      modal.open = true
                    }
                    )

                  }
                }
              }
              );
              modal.open = true
            }
          } else {
            //Mostramos un mensaje de error si el campo de prueba esta vacio
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => { })

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

      const pruebas = this.#pruebas
      const lista = pruebas

      const table = this.#tablePruebas
      const rowsTable = this.#tablePruebas.rows.length

      if (this.validateRows(rowsTable)) {
        lista.forEach((prueba, i) => {
          const row = document.createElement('tr')
          row.innerHTML = `
            <tr id="prueba-${prueba.id_prueba}">
            <td class="px-6 py-4 whitespace-nowrap">${prueba.id_prueba}</td>
            <td class="px-6 py-4 whitespace-nowrap">${prueba.descripcion_prueba}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-prueba" onclick="activarBotonSeleccionarPrueba(this.value)" value="${prueba.id_prueba}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `
          table.appendChild(row)
        })
      }

    } catch (error) {
      console.error('Error al obtener las pruebas:', error)
    }

  }

  //Metodo que se encarga de activar el boton de seleccionar prueba y asi poder mostrar los datos de la prueba seleccionada
  activarBotonSeleccionarPrueba = async pruebaId => {

    try {
       pruebaId = parseInt(pruebaId,10)
      //Obtenemos la prueba seleccionada
      const prueba = await this.#api.getPruebaByID(pruebaId)
      //Validamos si la prueba seleccionada existe
      if (prueba) {
        //Mostramos los datos de la prueba seleccionada
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
    //Obtenemos los campos del formulario
    this.#prueba = this.shadowRoot.getElementById('prueba')
    this.#tablePruebas = this.shadowRoot.getElementById('table-prueba')
    this.#botonAgregarPrueba = this.shadowRoot.getElementById('agregar-prueba')
    this.#botonEditarPrueba = this.shadowRoot.getElementById('editar-prueba')
    //Llamado al metodo que se encarga de manejar la entrada de texto     
    this.manejadorEntradaTexto()
  }

  //Metodo que se encarga de manejar la entrada de texto en el campo de prueba
  manejadorEntradaTexto() {
    var pruebaInput = this.#prueba
    pruebaInput.addEventListener('input', function () {
      if (pruebaInput.value.length > 200) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.setOnCloseCallback(() => { });
        modal.message = 'El campo prueba no puede tener más de 200 caracteres'
        modal.title = 'Error'
        modal.open = true
      }
    })
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

customElements.define('prueba-promovente', Prueba)
