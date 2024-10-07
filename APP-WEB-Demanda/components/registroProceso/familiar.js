import { APIModel } from '../../models/api.model'

 

export class FamiliarPromovente extends HTMLElement {

  //Atributos de la clase  
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

  //Metodo que se encarga de observar los cambios en los atributos
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
    const familiares = this.#familiares
    return {
      familiares: familiares
    }
  }
  #limite = 5
  #actual = 0


  //Metodo que asigna los datos del componente y en caso de se seleccione un nuevo turno se actualice la tabla a valores por default
  set data(value) {
    this.#familiares = value
    //Se muestran los familiares en la tabla
    this.mostrarFamiliares()
    this.setAttribute('data', value)
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('/components/registroProceso/familiar.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
       //Se inicializan los atributos de la clase
       this.#api = new APIModel()
       //Se inicializa el id del familiar en null
       this.#idFamiliar = null
       //Se asigna un array vacio a la variable familiares
       this.#familiares = []
       //Lllamda al metodo que se encarga de manejar los campos del formulario
       this.manageFormFields()
       //Llamada al metodo que se encarga de llenar los campos del formulario
       this.fillInputs()
  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()
 
  }

  //Metodo que se encarga de manejar los campos del formulario
  manageFormFields() {
    //Se asignan los campos del formulario a las variables de la clase
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
  }

  //Metodo que se encarga de manejar las entradas de texto osea agregar un evento de input a los campos de texto
  manejadorEntradaTexto(){
    //Asignacion de variables a los campos de texto
    var parentescoInput = this.#parentescoFamiliar
    var nacionalidadInput = this.#nacionalidadFamilar
    var nombreInput = this.#nombreFamiliar

    //Se agrega un evento de input a los campos de texto en este caso parentesco
    parentescoInput.addEventListener('input', function () {
      if (parentescoInput.value.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de parentesco no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    })

    //Se agrega un evento de input a los campos de texto en este caso nacionalidad
    nacionalidadInput.addEventListener('input', function () {
      if (nacionalidadInput.value.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de nacionalidad no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    })

    //Se agrega un evento de input a los campos de texto en este caso nombre
    nombreInput.addEventListener('input', function () {
     if (nombreInput.value.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de nombre no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    })

  }

  //Metodo que se encarga de llamar al metodo de agregar eventos a los botones
  fillInputs() {
    //Llamada al metodo que se encarga de agregar eventos a los botones
    this.agregarEventosBotones()
  }

  //Metodo que se encarga de agregar eventos a los botones
  agregarEventosBotones = () => {
     //Asignacion de las variables a los botones
    this.#botonAgregarFamiliar.addEventListener('click', this.agregarFamiliar)
    this.#botonEditarFamiliar.addEventListener('click', this.editarFamiliar)

     //Asignacion o busqueda de todas las raws de la tabla de familiares y el boton de seleccionar
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-familiar')

    //Se recorre cada boton de seleccionar y se le agrega un evento de click
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const familiarId = boton.value
        //Asignacion del id del familiar seleccionado con respecto al familiar seleccionado
        this.#idFamiliar = familiarId
        //Llamada al metodo que se encarga de activar el boton de seleccionar familiar
        this.activarBotonSeleccionarFamiliar(familiarId)
      })
    })

    //Esto se encarga de llamar al metodo que se encarga de maneejar el boton de seleccionar familiar
    const activarBotonSeleccionarFamiliar = (familiarId) => {
      this.activarBotonSeleccionarFamiliar(familiarId)
    }

    //Llamada al metodo que se encarga del boton de seleccionar familiar
    window.activarBotonSeleccionarFamiliar = activarBotonSeleccionarFamiliar
  }

  //Metodo que se encarga de mostrar los familiares en la tabla
  mostrarFamiliares = async () => {

    try {
      //Asingacion de constante a la variable familiares con respecto a los familiares del arreglo correspondiente
      const familiares = this.#familiares
      //Asignacion de la tabla de familiares a la variable tableBody
      const tableBody = this.#tableFamiliares
      //Se limpia la tabla de familiares
      tableBody.innerHTML = ''
      //Se recorre la lista de familiares y se agregan a la tabla
      const lista = familiares
      const funcion =
        lista.forEach((familiar, i) => {
          const row = document.createElement('tr')
          row.innerHTML = `
            <tr id="familiar-${i + 1}">
            <td class="px-6 py-4 whitespace-nowrap">${i + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.nombre}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.nacionalidad}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.parentesco}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.perteneceComunidadLGBT ? 'si' : 'no'}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.adultaMayor ? 'si' : 'no'}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.saludPrecaria ? 'si' : 'no'}</td>
            <td class="px-6 py-4 whitespace-nowrap">${familiar.pobrezaExtrema ? 'si' : 'no'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-familiar" onclick="activarBotonSeleccionarFamiliar(this.value)" value="${i + 1}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `
          tableBody.appendChild(row)
        })
    } catch (error) {
      console.error('Error al obtener los familiares:', error)
    }
  }

  //Metodo que se encarga de editar un familiar
  editarFamiliar = async () => {

    //ID del familiar variable que nos sirve para saber si se ha seleccionado previamente un familiar
    const idFamiliar = this.#idFamiliar

    //Verifica si se ha seleccionado previamente un familiar
    if (idFamiliar === null) {
      //En caso de no haber seleccionado un familiar se muestra un mensaje de error
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});

      modal.message = 'Debe seleccionar un familiar para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Asignacion de las variables a los campos de texto
      const nombre = this.#nombreFamiliar.value
      const nacionalidad = this.#nacionalidadFamilar.value
      const parentesco = this.#parentescoFamiliar.value
      const perteneceComunidadLGBT = this.#pertenceComunidadLGBTRadioYes.checked
      const adultaMayor = this.#adultaMayorRadioYes.checked
      const saludPrecaria = this.#saludPrecariaRadioYes.checked
      const pobrezaExtrema = this.#pobrezaExtremaRadioYes.checked

      //Se verifica que el nombre no este vacio y que no contenga mas de 100 caracteres
      if (nombre === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de nombre es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (nombre.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de nombre no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }

      //Se verifica que la nacionalidad no este vacia y que no contenga mas de 100 caracteres
      if (nacionalidad === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de nacionalidad es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (nacionalidad.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de nacionalidad no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }

      //Se verifica que el parentesco no este vacio y que no contenga mas de 100 caracteres
      if (parentesco === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de parentesco es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (parentesco.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de parentesco no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      } else {

        /**
         Verifica que los radios ya sea yex o no esten seleccionados 
         y que los campos de texto no esten vacios y que no contengan mas de 100 caracteres
         */
         if ((perteneceComunidadLGBT === true || perteneceComunidadLGBT === false) && (adultaMayor === true || adultaMayor === false) && (saludPrecaria === true || saludPrecaria === false) && (pobrezaExtrema === true || pobrezaExtrema === false ) &&  (parentesco !== '' && parentesco.length <= 100) && (nacionalidad !== '' && nacionalidad.length <= 100) && (nombre !== '' && nombre.length <= 100)){
           
          /*

          //Se asignan los datos del familiar a la variable familiarData
          const familiarData = {
            nombre: nombre,
            nacionalidad: nacionalidad,
            parentesco: parentesco,
            perteneceComunidadLGBT: perteneceComunidadLGBT,
            adultaMayor: adultaMayor,
            saludPrecaria: saludPrecaria,
            pobrezaExtrema: pobrezaExtrema
          }
           
          //Se asignan los datos del familiar a la lista de familiares
          this.#familiares[idFamiliar - 1] = familiarData
          //Se muestran los familiares en la tabla
          this.mostrarFamiliares()
          //Se limpian los campos del formulario y del id del familiar seleccionado
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
                  pobrezaExtrema: pobrezaExtrema
                }
                //Se asignan los datos del familiar a la lista de familiares
                this.#familiares[idFamiliar - 1] = familiarData
                //Se muestran los familiares en la tabla
                this.mostrarFamiliares()
                //Se limpian los campos del formulario y del id del familiar seleccionado
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
          } 
          );

          modal.message = 'Si esta seguro de editar el familiar presione aceptar, de lo contrario presione x para cancelar.'
          modal.title = '¿Confirmacion de editar familiar?'

          modal.open = true
          
        } else {
           //En caso de que no se eleccione un radio se muestra un mensaje de error
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'Debe seleccionar una opción en los campos de radio.'
          modal.title = 'Error de validación'
          modal.open = true
        }
      }
    }

  }
 
  //Metodo que se encarga de agregar un familiar
  agregarFamiliar = async () => {
    if(this.#actual<this.#limite){
     //ID del familiar variable que nos sirve para saber si se ha seleccionado previamente un familiar
    const idFamiliar = this.#idFamiliar

    //Verifica si se ha seleccionado previamente un familiar
    if (idFamiliar === null) {
      //Asignacion de las variables a los campos de texto
      const nombre = this.#nombreFamiliar.value
      const nacionalidad = this.#nacionalidadFamilar.value
      const parentesco = this.#parentescoFamiliar.value
      const perteneceComunidadLGBT = this.#pertenceComunidadLGBTRadioYes.checked
      const adultaMayor = this.#adultaMayorRadioYes.checked
      const saludPrecaria = this.#saludPrecariaRadioYes.checked
      const pobrezaExtrema = this.#pobrezaExtremaRadioYes.checked

      //Se verifica que el nombre no este vacio y que no contenga mas de 100 caracteres
      if (nombre === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de nombre es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (nombre.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de nombre no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }

      //Se verifica que la nacionalidad no este vacia y que no contenga mas de 100 caracteres
      if (nacionalidad === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de nacionalidad es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (nacionalidad.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de nacionalidad no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }


      //Se verifica que el parentesco no este vacio y que no contenga mas de 100 caracteres
      if (parentesco === '') {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de parentesco es obligatorio.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (parentesco.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});

        modal.message = 'El campo de parentesco no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      } else {

        /**
         * Verifica que los radios ya sea yex o no esten seleccionados
         * y que los campos de texto no esten vacios y que no contengan mas de 100 caracteres
         *  
         * */

        if ((perteneceComunidadLGBT === true || perteneceComunidadLGBT === false) && (adultaMayor === true || adultaMayor === false) && (saludPrecaria === true || saludPrecaria === false) && (pobrezaExtrema === true || pobrezaExtrema === false ) &&  (parentesco !== '' && parentesco.length <= 100) && (nacionalidad !== '' && nacionalidad.length <= 100) && (nombre !== '' && nombre.length <= 100)){
          //Se asignan los datos del familiar a la variable familiarData
          /*
          const familiarData = {
            nombre: nombre,
            nacionalidad: nacionalidad,
            parentesco: parentesco,
            perteneceComunidadLGBT: perteneceComunidadLGBT,
            adultaMayor: adultaMayor,
            saludPrecaria: saludPrecaria,
            pobrezaExtrema: pobrezaExtrema
          }
          //Se asignan los datos del familiar a la lista de familiares
          this.#familiares.push(familiarData)
          //Se muestran los familiares en la tabla
          this.mostrarFamiliares()
          this.#actual++  
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
                  pobrezaExtrema: pobrezaExtrema
                }
                //Se asignan los datos del familiar a la lista de familiares
                this.#familiares.push(familiarData)
                //Se muestran los familiares en la tabla
                this.mostrarFamiliares()
                this.#actual++  
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
              }
            }
          } 
          );

          modal.message = 'Si esta seguro de agregar el familiar presione aceptar, de lo contrario presione x para cancelar.'
          modal.title = '¿Confirmacion de agregar familiar?'

          modal.open = true
        } else {
          //En caso de que no se eleccione un radio se muestra un mensaje de error
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});

          modal.message = 'Debe seleccionar una opción en los campos de radio.'
          modal.title = 'Error de validación'
          modal.open = true

        }
      }
    }
    else {
      //En caso de que se haya seleccionado previamente un familiar se muestra un mensaje de error
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});

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
  }else{
    const modal = document.querySelector('modal-warning')
    modal.setOnCloseCallback(() => {});

    modal.message = 'Limite de 5 familares durante el registro de un proceso, sin embargo puede registrar nuevos en la seccion de continuacion de proceso'
    modal.title = 'Error de validación'
    modal.open = true
  }
  }

  //Metodo que se encarga de activar el boton de seleccionar familiar
  activarBotonSeleccionarFamiliar = async familiarId => {

    try {
      //Asignacion de la constante familiar con respecto al familiar seleccionado
      const familiar = this.#familiares[familiarId - 1]
      //Verifica si el familiar seleccionado existe
      if (familiar) {
        //Se muestra el familiar seleccionado en los campos del formulario
        this.#idFamiliar = familiarId
        this.#nombreFamiliar.value = familiar.nombre
        this.#nacionalidadFamilar.value = familiar.nacionalidad
        this.#parentescoFamiliar.value = familiar.parentesco
        if (familiar.perteneceComunidadLGBT) {
          this.#pertenceComunidadLGBTRadioYes.checked = true
        }else
        {
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


  connectedCallback() {

  }

   //Metodo que se encarga de mostrar un mensaje de error 
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
