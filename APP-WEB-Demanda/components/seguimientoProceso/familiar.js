import { APIModel } from '../../models/api.model'

export class FamiliarPromovente extends HTMLElement {

  // Atributos privados
  #api
  #idFamiliar
  #nombreFamiliar
  #parentescoFamiliar
  #nacionalidadFamilar
  #pertenceComunidadLGBTRadioYes
  #pertenceComunidadLGBTRadioNo
  #adultaMayorRadioYes
  #adultaMayorRadioNo
  #saludPrecariaRadioYes
  #saludPrecariaRadioNo
  #pobrezaExtremaRadioYes
  #pobrezaExtremaRadioNo

  #familiares
  #tableFamiliares

  #botonAgregarFamiliar
  #botonEditarFamiliar


  //Metodo que se encarga de obtener los atributos del componente
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
    const familiares = this.#familiares
    return {
      familiares: familiares
    }
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('/components/seguimientoProceso/familiar.html')).text();
    template.innerHTML = html;
    return template;
  }



  //Metodo que establece el valor del atributo data
  set data(value) {
    this.#idPromovente = value
    this.cargaDatos()
    this.setAttribute('data', value)
  }


  #idPromovente
  async cargaDatos() {
    try {
      const { familiares } = await this.#api.getFamiliaresBusqueda(this.#idPromovente, false, this.#pagina)
      this.#familiares = familiares
      this.getNumeroPaginas()
      this.mostrarFamiliares()
    }
    catch (error) {
      this.#familiares = []
      const total = this.shadowRoot.getElementById('total-f')
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
    const prev = this.shadowRoot.getElementById('anterior-f')
    const next = this.shadowRoot.getElementById('siguiente-f')
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
      const { totalFamiliares } = await this.#api.getFamiliaresBusqueda(this.#idPromovente, true, 1)
      const total = this.shadowRoot.getElementById('total-f')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + totalFamiliares
      this.#numeroPaginas = (totalFamiliares) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de familiares, intente de nuevo mas tarde o verifique el status del servidor';
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
    const table = this.#tableFamiliares
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }


  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));

    //Inicialización de atributos privados
    this.#api = new APIModel()
    this.#idFamiliar = null
    this.#familiares = []
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

  //Metodo que se encarga de manejar los cambios en los atributos del componente
  manageFormFields() {
    this.#tableFamiliares = this.shadowRoot.getElementById('table-familiar')

    this.#parentescoFamiliar = this.shadowRoot.getElementById('parentesco')
    this.#nacionalidadFamilar = this.shadowRoot.getElementById('nacionalidad')
    this.#nombreFamiliar = this.shadowRoot.getElementById('familiar')

    this.#pertenceComunidadLGBTRadioYes = this.shadowRoot.getElementById('lgbt_si')
    this.#pertenceComunidadLGBTRadioNo = this.shadowRoot.getElementById('lgbt_no')
    this.#adultaMayorRadioYes = this.shadowRoot.getElementById('adulto_si')
    this.#adultaMayorRadioNo = this.shadowRoot.getElementById('adulto_no')
    this.#saludPrecariaRadioYes = this.shadowRoot.getElementById('salud_si')
    this.#saludPrecariaRadioNo = this.shadowRoot.getElementById('salud_no')
    this.#pobrezaExtremaRadioYes = this.shadowRoot.getElementById('pobreza_si')
    this.#pobrezaExtremaRadioNo = this.shadowRoot.getElementById('pobreza_no')
    this.#botonAgregarFamiliar = this.shadowRoot.getElementById('agregar-familiar')
    this.#botonEditarFamiliar = this.shadowRoot.getElementById('editar-familiar')
    //Llamada al metodo que se encarga de manejar la entrada de texto
    this.manejadorEntradaTexto()
  }

  //Metodo que se encarga de manejar los campos de texto con eventos de entrada
  manejadorEntradaTexto() {
    //Obtención de los campos de texto
    var parentescoInput = this.#parentescoFamiliar
    var nacionalidadInput = this.#nacionalidadFamilar
    var nombreInput = this.#nombreFamiliar
    //Evento que se encarga de verificar que el campo de parentesco no contenga más de 100 caracteres
    parentescoInput.addEventListener('input', function () {
      if (parentescoInput.value.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de parentesco no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    })


    //Evento que se encarga de verificar que el campo de nacionalidad no contenga más de 100 caracteres
    nacionalidadInput.addEventListener('input', function () {
      if (nacionalidadInput.value.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de nacionalidad no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    })


    //Evento que se encarga de verificar que el campo de nombre no contenga más de 100 caracteres
    nombreInput.addEventListener('input', function () {
      if (nombreInput.value.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de nombre no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    })
  }


  //Metodo que se encarga de mandar a llamar al metodo que agrega los eventos a los botones
  fillInputs() {
    //Llamada al metodo que se encarga de agregar los eventos a los botones
    this.agregarEventosBotones()
    this.buttonsEventListeners()
  }

  //Metodo que agrega los eventos  a los botones
  agregarEventosBotones = () => {
    //Se agrega el evento click al boton de agregar familiar
    this.#botonAgregarFamiliar.addEventListener('click', this.agregarFamiliar)
    //Se agrega el evento click al boton de editar familiar
    this.#botonEditarFamiliar.addEventListener('click', this.editarFamiliar)

    //Se obtienen todos los botones de seleccionar familiar, creados en el metodo de mostrarFamiliares 
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-familiar')

    //Se recorren todos los botones de seleccionar familiar y se les agrega el evento click
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const familiarId = boton.value
        this.#idFamiliar = familiarId
        //Se manda a llamar al metodo que activa el boton de seleccionar familiar
        this.activarBotonSeleccionarFamiliar(familiarId)
      })
    })


    //Se agrega la funcion activarBotonSeleccionarFamiliar al objeto window
    const activarBotonSeleccionarFamiliar = (familiarId) => {
      this.activarBotonSeleccionarFamiliar(familiarId)
    }

    //Se agrega la funcion activarBotonSeleccionarFamiliar al objeto window
    window.activarBotonSeleccionarFamiliar = activarBotonSeleccionarFamiliar
  }

  //Metodo que se encarga de mostrar los familiares en la tabla
  mostrarFamiliares = async () => {

    try {
      const familiares = this.#familiares
      const lista = familiares
      const table = this.#tableFamiliares
      const rowsTable = this.#tableFamiliares.rows.length

      if (this.validateRows(rowsTable)) {
        lista.forEach((familiar, i) => {
          const row = document.createElement('tr')
          row.innerHTML = `
            <tr id="familiar-${i + 1}">
            <td class="px-6 py-4 whitespace-nowrap">${familiar.id_familiar}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.nombre}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.nacionalidad}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.parentesco}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.perteneceComunidadLGBT ? 'si' : 'no'}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.adultaMayor ? 'si' : 'no'}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.saludPrecaria ? 'si' : 'no'}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.pobrezaExtrema ? 'si' : 'no'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-familiar" onclick="activarBotonSeleccionarFamiliar(this.value)" value="${familiar.id_familiar}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `
          table.appendChild(row)
        })
      }

    } catch (error) {
      console.error('Error al obtener los familiares:', error)
    }

  }

  //Metodo que se encarga de editar un familiar
  editarFamiliar = async () => {

    //Obtención del id del familiar selecionado variable que nos ayuda a determinar si se ha selecionado un id de familiar para asi
    //poder editar el familiar o mostrar un mensaje de error
    const idFamiliar = this.#idFamiliar

    //Validación de si se ha seleccionado un familiar
    if (idFamiliar === null) {
      //Mensaje de error si no se ha seleccionado un familiar
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { })

      modal.message = 'Debe seleccionar un familiar para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Obtención de los campos del formulario
      const nombre = this.#nombreFamiliar.value
      const nacionalidad = this.#nacionalidadFamilar.value
      const parentesco = this.#parentescoFamiliar.value
      const perteneceComunidadLGBT = this.#pertenceComunidadLGBTRadioYes.checked
      const adultaMayor = this.#adultaMayorRadioYes.checked
      const saludPrecaria = this.#saludPrecariaRadioYes.checked
      const pobrezaExtrema = this.#pobrezaExtremaRadioYes.checked

      //Verificacion de que si el campo de nombre esta vacio, o si el campo de nombre tiene más de 100 caracteres se muestre un mensaje de error
      if (nombre === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de nombre es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (nombre.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de nombre no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }

      //Verificacion de que si el campo de nacionalidad esta vacio, o si el campo de nacionalidad tiene más de 100 caracteres se muestre un mensaje de error
      if (nacionalidad === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de nacionalidad es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (nacionalidad.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de nacionalidad no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }


      //Verificacion de que si el campo de parentesco esta vacio, o si el campo de parentesco tiene más de 100 caracteres se muestre un mensaje de error
      if (parentesco === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de parentesco es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (parentesco.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de parentesco no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      } else {

        /**
         Verifica que los radios ya sea yex o no esten seleccionados 
         */

        //Verificacion de los campos de radio
        if ((perteneceComunidadLGBT === true || perteneceComunidadLGBT === false) && (adultaMayor === true || adultaMayor === false) && (saludPrecaria === true || saludPrecaria === false) && (pobrezaExtrema === true || pobrezaExtrema === false) && (parentesco !== '' && parentesco.length <= 100) && (nacionalidad !== '' && nacionalidad.length <= 100) && (nombre !== '' && nombre.length <= 100)) {

          const familiarObtenido = await this.#api.getFamiliarByID(idFamiliar)

          if (familiarObtenido.nombre === nombre && familiarObtenido.nacionalidad === nacionalidad && familiarObtenido.parentesco === parentesco && familiarObtenido.perteneceComunidadLGBT === perteneceComunidadLGBT && familiarObtenido.adultaMayor === adultaMayor && familiarObtenido.saludPrecaria === saludPrecaria && familiarObtenido.pobrezaExtrema === pobrezaExtrema) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'No se ha realizado ningun cambio en los campos, ya que los campos son iguales a los que ya estaban.'
            modal.setOnCloseCallback(() => { })
            modal.title = 'Error de validación'
            modal.open = true
          } else {



            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false

                  //Se asignan los datos del familiar a la variable familiarData
                  const familiarData = {
                    nombre: nombre,
                    nacionalidad: nacionalidad,
                    parentesco: parentesco,
                    perteneceComunidadLGBT: perteneceComunidadLGBT,
                    adultaMayor: adultaMayor,
                    saludPrecaria: saludPrecaria,
                    pobrezaExtrema: pobrezaExtrema,
                    id_familiar: idFamiliar,
                    id_promovente: this.#idPromovente

                  }
                  /*Se asignan los datos del familiar a la lista de familiares
                  this.#familiares.push(familiarData)
                  //Se muestran los familiares en la tabla
                  this.mostrarFamiliares()
                  //Se limpian los campos del formulario
                  this.#nombreFamiliar.value = ''
                  this.#nacionalidadFamilar.value = ''
                  this.#parentescoFamiliar.value = ''
                  this.#pertenceComunidadLGBTRadioYes.checked = false
                  this.#pertenceComunidadLGBTRadioNo.checked = false
                  this.#adultaMayorRadioYes.checked = false
                  this.#adultaMayorRadioNo.checked = false
                  this.#saludPrecariaRadioYes.checked = false
                  this.#saludPrecariaRadioNo.checked = false
                  this.#pobrezaExtremaRadioYes.checked = false
                  this.#pobrezaExtremaRadioNo.checked = false
  
                  this.#saludPrecariaRadioYes.checked = true
                  this.#pobrezaExtremaRadioYes.checked = true
                  this.#pertenceComunidadLGBTRadioYes.checked = true
                  this.#adultaMayorRadioYes.checked = true
                  */
                  this.#api.putFamiliar(idFamiliar, familiarData).then((response) => {
                    this.cargaDatos()
                    this.#idFamiliar = null
                    this.#nombreFamiliar.value = ''
                    this.#nacionalidadFamilar.value = ''
                    this.#parentescoFamiliar.value = ''
                    this.#pertenceComunidadLGBTRadioYes.checked = false
                    this.#pertenceComunidadLGBTRadioNo.checked = false
                    this.#adultaMayorRadioYes.checked = false
                    this.#adultaMayorRadioNo.checked = false
                    this.#saludPrecariaRadioYes.checked = false
                    this.#saludPrecariaRadioNo.checked = false
                    this.#pobrezaExtremaRadioYes.checked = false
                    this.#pobrezaExtremaRadioNo.checked = false

                    this.#saludPrecariaRadioYes.checked = true
                    this.#pobrezaExtremaRadioYes.checked = true
                    this.#pertenceComunidadLGBTRadioYes.checked = true
                    this.#adultaMayorRadioYes.checked = true

                  }).catch((error) => {
                    console.log(error)
                  })
                }
              }
            }
            );

            modal.message = 'Si esta seguro de agregar el familiar presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de agregar familiar?'

            modal.open = true

          }
        } else {
          //Mensaje de error si no se han seleccionado los campos de radio
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { })

          modal.message = 'Debe seleccionar una opción en los campos de radio.'
          modal.title = 'Error de validación'
          modal.open = true
        }
      }
    }

  }

  //Metodo que se encarga de agregar un familiar
  agregarFamiliar = async () => {
    //Variable que nos ayuda a determinar si se ha selecionado un id de familiar para asi
    //poder agregar el familiar o mostrar un mensaje de error
    const idFamiliar = this.#idFamiliar

    //Validación de si se ha seleccionado un familiar
    if (idFamiliar === null) {
      //Obtención de los campos del formulario
      const nombre = this.#nombreFamiliar.value
      const nacionalidad = this.#nacionalidadFamilar.value
      const parentesco = this.#parentescoFamiliar.value
      const perteneceComunidadLGBT = this.#pertenceComunidadLGBTRadioYes.checked
      const adultaMayor = this.#adultaMayorRadioYes.checked
      const saludPrecaria = this.#saludPrecariaRadioYes.checked
      const pobrezaExtrema = this.#pobrezaExtremaRadioYes.checked

      //Verificacion de que si el campo de nombre esta vacio, o si el campo de nombre tiene más de 100 caracteres se muestre un mensaje de error
      if (nombre === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de nombre es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (nombre.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de nombre no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }

      //Verificacion de que si el campo de nacionalidad esta vacio, o si el campo de nacionalidad tiene más de 100 caracteres se muestre un mensaje de error
      if (nacionalidad === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de nacionalidad es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (nacionalidad.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de nacionalidad no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }


      //Verificacion de que si el campo de parentesco esta vacio, o si el campo de parentesco tiene más de 100 caracteres se muestre un mensaje de error
      if (parentesco === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de parentesco es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (parentesco.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El campo de parentesco no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      } else {

        /**
         * Verifica que los radios ya sea yex o no esten seleccionados
         *  
         *  
         * */

        //Verificacion de los campos de radio 
        if ((perteneceComunidadLGBT === true || perteneceComunidadLGBT === false) && (adultaMayor === true || adultaMayor === false) && (saludPrecaria === true || saludPrecaria === false) && (pobrezaExtrema === true || pobrezaExtrema === false) && (parentesco !== '' && parentesco.length <= 100) && (nacionalidad !== '' && nacionalidad.length <= 100) && (nombre !== '' && nombre.length <= 100)) {
          /*
          //Obtención del id del familiar si tiene
         const familiarData = {
           nombre: nombre,
           nacionalidad: nacionalidad,
           parentesco: parentesco,
           perteneceComunidadLGBT: perteneceComunidadLGBT,
           adultaMayor: adultaMayor,
           saludPrecaria: saludPrecaria,
           pobrezaExtrema: pobrezaExtrema
         }
         //Agregación del familiar
         this.#familiares.push(familiarData)
         //Mostrar los familiares
          this.mostrarFamiliares()
         //Limpiar los campos del formulario
         this.#nombreFamiliar.value = ''
         this.#nacionalidadFamilar.value = ''
         this.#parentescoFamiliar.value = ''
         this.#pertenceComunidadLGBTRadioYes.checked = false
         this.#pertenceComunidadLGBTRadioNo.checked = false
         this.#adultaMayorRadioYes.checked = false
         this.#adultaMayorRadioNo.checked = false
         this.#saludPrecariaRadioYes.checked = false
         this.#saludPrecariaRadioNo.checked = false
         this.#pobrezaExtremaRadioYes.checked = false
         this.#pobrezaExtremaRadioNo.checked = false

         this.#saludPrecariaRadioYes.checked = true
         this.#pobrezaExtremaRadioYes.checked = true
         this.#pertenceComunidadLGBTRadioYes.checked = true
         this.#adultaMayorRadioYes.checked = true
         */

          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {
            if (modal.open === 'false') {
              if (modal.respuesta === true) {
                modal.respuesta = false

                //Se asignan los datos del familiar a la variable familiarData
                const familiarData = {
                  nombre: nombre,
                  nacionalidad: nacionalidad,
                  parentesco: parentesco,
                  perteneceComunidadLGBT: perteneceComunidadLGBT,
                  adultaMayor: adultaMayor,
                  saludPrecaria: saludPrecaria,
                  pobrezaExtrema: pobrezaExtrema, 
                  id_promovente: this.#idPromovente
                }
                /*Se asignan los datos del familiar a la lista de familiares
                this.#familiares.push(familiarData)
                //Se muestran los familiares en la tabla
                this.mostrarFamiliares()
                //Se limpian los campos del formulario
                this.#nombreFamiliar.value = ''
                this.#nacionalidadFamilar.value = ''
                this.#parentescoFamiliar.value = ''
                this.#pertenceComunidadLGBTRadioYes.checked = false
                this.#pertenceComunidadLGBTRadioNo.checked = false
                this.#adultaMayorRadioYes.checked = false
                this.#adultaMayorRadioNo.checked = false
                this.#saludPrecariaRadioYes.checked = false
                this.#saludPrecariaRadioNo.checked = false
                this.#pobrezaExtremaRadioYes.checked = false
                this.#pobrezaExtremaRadioNo.checked = false

                this.#saludPrecariaRadioYes.checked = true
                this.#pobrezaExtremaRadioYes.checked = true
                this.#pertenceComunidadLGBTRadioYes.checked = true
                this.#adultaMayorRadioYes.checked = true
                */
               console.log(familiarData)
                this.#api.postFamiliar(familiarData).then((response) => {
                  this.cargaDatos()
                  this.#nombreFamiliar.value = ''
                  this.#nacionalidadFamilar.value = ''
                  this.#parentescoFamiliar.value = ''
                  this.#pertenceComunidadLGBTRadioYes.checked = false
                  this.#pertenceComunidadLGBTRadioNo.checked = false
                  this.#adultaMayorRadioYes.checked = false
                  this.#adultaMayorRadioNo.checked = false
                  this.#saludPrecariaRadioYes.checked = false
                  this.#saludPrecariaRadioNo.checked = false
                  this.#pobrezaExtremaRadioYes.checked = false
                  this.#pobrezaExtremaRadioNo.checked = false

                  this.#saludPrecariaRadioYes.checked = true
                  this.#pobrezaExtremaRadioYes.checked = true
                  this.#pertenceComunidadLGBTRadioYes.checked = true
                  this.#adultaMayorRadioYes.checked = true

                }).catch((error) => {
                  console.log(error)
                })
              }
            }
          }
          );

          modal.message = 'Si esta seguro de agregar el familiar presione aceptar, de lo contrario presione x para cancelar.'
          modal.title = '¿Confirmacion de agregar familiar?'

          modal.open = true
        } else {
          //Mensaje de error si no se han seleccionado los campos de radio
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { })

          modal.message = 'Debe seleccionar una opción en los campos de radio.'
          modal.title = 'Error de validación'
          modal.open = true
        }
      }
    }
    else {
      //Mensaje de error si se ha seleccionado un familiar
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { })

      modal.message = 'No se puede agregar un familiar si ha seleccionado previamente uno de la tabla, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#idFamiliar = null
      this.#nombreFamiliar.value = ''
      this.#nacionalidadFamilar.value = ''
      this.#parentescoFamiliar.value = ''
      this.#pertenceComunidadLGBTRadioYes.checked = false
      this.#pertenceComunidadLGBTRadioNo.checked = false
      this.#adultaMayorRadioYes.checked = false
      this.#adultaMayorRadioNo.checked = false
      this.#saludPrecariaRadioYes.checked = false
      this.#saludPrecariaRadioNo.checked = false
      this.#pobrezaExtremaRadioYes.checked = false
      this.#pobrezaExtremaRadioNo.checked = false

      this.#saludPrecariaRadioYes.checked = true
      this.#pobrezaExtremaRadioYes.checked = true
      this.#pertenceComunidadLGBTRadioYes.checked = true
      this.#adultaMayorRadioYes.checked = true
    }
  }

  //Metodo que se encarga de activar el boton de seleccionar familiar
  activarBotonSeleccionarFamiliar = async familiarId => {

    try { 
       familiarId = parseInt(familiarId, 10)
      //Obtención del familiar por ID
      const familiar = await this.#api.getFamiliarByID(familiarId)
      //Verificación de si el familiar existe
      if (familiar) {
        //Asignación de los valores del familiar a los campos del formulario
        this.#idFamiliar = familiarId
        this.#nombreFamiliar.value = familiar.nombre
        this.#nacionalidadFamilar.value = familiar.nacionalidad
        this.#parentescoFamiliar.value = familiar.parentesco

        if (familiar.perteneceComunidadLGBT) {
          this.#pertenceComunidadLGBTRadioYes.checked = true
        } else {
          this.#pertenceComunidadLGBTRadioNo.checked = true
        }

        if (familiar.adultaMayor) {
          this.#adultaMayorRadioYes.checked = true
        } else {
          this.#adultaMayorRadioNo.checked = true
        }

        if (familiar.saludPrecaria) {
          this.#saludPrecariaRadioYes.checked = true
        } else {
          this.#saludPrecariaRadioNo.checked = true
        }

        if (familiar.pobrezaExtrema) {
          this.#pobrezaExtremaRadioYes.checked = true
        } else {
          this.#pobrezaExtremaRadioNo.checked = true
        }

      } else {
        console.error('El familiar con el ID proporcionado no existe.')
      }
    } catch (error) {
      console.error('Error al obtener el familiar por ID:', error)

    }
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

customElements.define('familiar-promovente', FamiliarPromovente)
