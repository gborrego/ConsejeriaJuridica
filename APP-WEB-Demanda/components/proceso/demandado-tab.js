import { ValidationError } from '../../lib/errors.js'
import { validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model.js'
//import '../codigo-postal/codigo-postal.js'



export class DemandadoTab extends HTMLElement {

  //Variables privadas de la clase
  #api
  #nombre
  #apellidoPaterno
  #apellidoMaterno
  #edad
  #sexo
  #telefono

  #españolRadioYes
  #españolRadioNo

  #etnia
  #etnias

  #escolaridad
  #escolaridades

  #ocupacion
  #ocupaciones

  #calle
  #numeroExt
  #numeroInt
  #colonia
  #cp
  #municipio
  #estado
  #ciudad

  #turno

  #promovente
  #promventeDomicilio
  #tipoJuicio

  #busquedaCp
  #generos
  #turnoSeleccionado = null


  //Metodo encargado de definir los atributos que se observaran
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

  //Metodo que verifica si el componente esta completo	
  get isComplete() {
    return this.validateInputs()
  }

  //Metodo que obtiene los datos del formulario
  get data() {
    const demandado = {
      nombre: this.#nombre.value,
      apellido_paterno: this.#apellidoPaterno.value,
      apellido_materno: this.#apellidoMaterno.value,
      edad: this.#edad.value,
      telefono: this.#telefono.value,
      id_genero: this.#sexo.value,
      sexo: this.#sexo.options[this.#sexo.selectedIndex].text,
      domicilio: {
        calle_domicilio: this.#calle.value,
        numero_exterior_domicilio: this.#numeroExt.value,
        numero_interior_domicilio: this.#numeroInt.value,
        id_colonia: this.#colonia.value,
        cp: this.#cp.value,
        estado: this.#estado.value,
        municipio: this.#municipio.value,
        ciudad: this.#ciudad.value,
        colonia: this.#colonia.options[this.#colonia.selectedIndex].text,
      },
    }
    return {
      demandado
    }
  }

  set data(value) {
    this.setAttribute('data', value)
  }


  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/proceso/demandado-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    this.registroTab = document.querySelector('registro-full-tab')
    this.promoventeTab = document.querySelector('promovente-full-tab')


    this.formCP = this.shadowRoot.getElementById('buscar-cp')

    this.formCP.addEventListener('click', (event) => {
      event.preventDefault();
      if (
        !this.#cp.value ||
        this.#cp.value.length !== 5 ||
        isNaN(this.#cp.value)
      ) {
        this.#showModal('El código postal debe tener 5 dígitos', 'Advertencia')
        return
      }
      this.searchCP()
    })
    await this.campos()

  }
  //Constructor de la clase
  constructor() {
    super()
    this.id = 'demandado'
    this.style.display = 'none'
    this.init2()

  }

  //Metodo que inicializa las variables de la clase, se obtienen los datos de la API,etc
  async init() {
    //Inizializar la variable api
    this.#api = new APIModel()
    //Se obtienen los datos de la API
    await this.obtencionDatos()
    //Se inicializan los campos del formulario
    this.manageFormFields()
    //Se llenan los campos del formulario
    this.fillInputs()
    //Se maneja la entrada de texto eventos input
    this.manejadorEntradaTexto()
  }

  async obtencionDatos() {
    // Se obtienen los generos de la API , los generos que se encuentren activos
    try {
      const { generos } = await this.#api.getGeneros2()
      //Se almacenan los generos en la variable generos
      this.#generos = generos
    } catch (error) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      });
      modal.message = 'Error al cargar los datos de generos para asignacion del demandado, por favor intenta de nuevo habilitarlos o ingresar nuevos datos.'
      modal.title = 'Error'
      modal.open = true
    }
  }

  //Metodo que maneja los eventos inputs de los campos del formulario
  manejadorEntradaTexto() {

    //Asingacion de variables a los campos del formulario
    var nombreInput = this.#nombre;
    var apellidoPaternoInput = this.#apellidoPaterno;
    var apellidoMaternoInput = this.#apellidoMaterno;
    var edadInput = this.#edad;

    // Agregar un evento 'input' al campo de entrada para validar en tiempo real
    nombreInput.addEventListener('input', function () {
      var nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

      if (!nombrePattern.test(nombreInput.value)) {
        // Si el campo contiene caracteres no válidos, lanzar una excepción

        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El nombre solo permite letras, verifique su respuesta.'
        modal.title = 'Error de validación'
        modal.open = true

      } else if (nombreInput.value.length > 50) {
        // Si el campo tiene más de 50 caracteres, lanzar una excepción
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El nombre no puede tener más de 50 caracteres, por favor ingréselo correctamente.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });

    apellidoPaternoInput.addEventListener('input', function () {
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

      if (!apellidoPattern.test(apellidoPaternoInput.value)) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido paterno solo permite letras, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (apellidoPaternoInput.value.length > 50) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido paterno no puede tener más de 50 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

    apellidoMaternoInput.addEventListener('input', function () {
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

      if (!apellidoPattern.test(apellidoMaternoInput.value)) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido materno solo permite letras, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (apellidoMaternoInput.value.length > 50) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido materno no puede tener más de 50 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });


    edadInput.addEventListener('input', function () {
      var edadPattern = /^\d+$/;
      if (!edadPattern.test(edadInput.value)) {
        if (edadInput.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });

          modal.message = 'La edad no puede estar vacía, por favor ingresela.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });

          modal.message = 'La edad solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      } else if (edadInput.value > 200) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

  }

  //Metodo que inicializa los campos del formulario y variables privadas de la clase
  manageFormFields() {
    this.#nombre = this.shadowRoot.getElementById('nombre')
    this.#apellidoPaterno = this.shadowRoot.getElementById('apellido-paterno')
    this.#apellidoMaterno = this.shadowRoot.getElementById('apellido-materno')
    this.#edad = this.shadowRoot.getElementById('edad')
    this.#sexo = this.shadowRoot.getElementById('sexo')
    this.#telefono = this.shadowRoot.getElementById('telefono')

    this.#calle = this.shadowRoot.getElementById('calle')
    this.#numeroExt = this.shadowRoot.getElementById('numero-ext')
    this.#numeroInt = this.shadowRoot.getElementById('numero-int')
    this.#colonia = this.shadowRoot.getElementById('colonia')
    this.#cp = this.shadowRoot.getElementById('codigo-postal')
    this.#municipio = this.shadowRoot.getElementById('municipio')
    this.#estado = this.shadowRoot.getElementById('estado')
    this.#ciudad = this.shadowRoot.getElementById('ciudad')
  }

  //Metodo que llena los select del formulario
  fillInputs() {
    //Se vacia el select de generos
    this.#sexo.innerHTML = ''

    //Se asigna una opcion por defecto
    const option = document.createElement('option')
    option.value = '0'
    option.text = 'Seleccione un género'
    this.#sexo.appendChild(option)

    //Se recorren los generos y se agregan al select
    this.#generos.forEach(genero => {
      const option = document.createElement('option')
      option.value = genero.id_genero
      option.text = genero.descripcion_genero
      this.#sexo.appendChild(option)
    })


  }


  //Metodo que valida los campos del formulario  
  validateInputs() {
    try {

      //Se valida que se haya seleccionado un turno con respecto al componente registro-tab
      if (this.registroTab.isComplete === false) {
        this.#showModal('No se ha seleccionado un turno, por favor seleccione uno.', 'Error de validación')
        return false
      }

      //Se valida que se haya ingresado los datos del promovente con respecto al componente promovente-tab
      if (this.promoventeTab.isComplete === false) {
        this.#showModal('No se han ingresado los datos del promovente, por favor ingreselos.', 'Error de validación')
        return false
      }

      //Se obtienen los valores 
      const nombre = this.#nombre.value
      const apellidoPaterno = this.#apellidoPaterno.value
      const apellidoMaterno = this.#apellidoMaterno.value
      const edad = this.#edad.value
      const sexo = this.#sexo.value
      const telefono = this.#telefono.value
      const calle = this.#calle.value
      const numeroExt = this.#numeroExt.value
      const numeroInt = this.#numeroInt.value
      const colonia = this.#colonia.value
      var nombresApellidos = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      var edadPattern = /^\d+$/;


      //Se verifica que los campos no esten vacios y que cumplan con las validaciones, en caso contrario se lanza una excepcion
      //validacion que el nombre no este vacio, que no tenga mas de 50 caracteres y que solo permita letras
      if (nombre === '') {
        throw new ValidationError('El nombre no puede estar vacío, por favor ingréselo.')
      } else if (nombre.length > 50) {
        throw new ValidationError('El nombre no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      } else if (!nombresApellidos.test(nombre)) {
        throw new ValidationError('El nombre solo permite letras, verifique su respuesta.')
      }


      //validacion que el apellido paterno no este vacio, que no tenga mas de 50 caracteres y que solo permita letras
      if (apellidoPaterno === '') {
        throw new ValidationError('El apellido paterno no puede estar vacío, por favor ingréselo.')
      }
      else if (apellidoPaterno.length > 50) {
        throw new ValidationError('El apellido paterno no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      } else if (!nombresApellidos.test(apellidoPaterno)) {
        throw new ValidationError('El apellido paterno solo permite letras, verifique su respuesta.')
      }

      //validacion que el apellido materno no este vacio, que no tenga mas de 50 caracteres y que solo permita letras
      if (apellidoMaterno === '') {
        throw new ValidationError('El apellido materno no puede estar vacío, por favor ingréselo.')

      } else if (apellidoMaterno.length > 50) {
        throw new ValidationError('El apellido materno no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      }
      else if (!nombresApellidos.test(apellidoMaterno)) {
        throw new ValidationError('El apellido materno solo permite letras, verifique su respuesta.')
      }

      //validacion que la edad no este vacia, que solo permita numeros y que no sea mayor a 200
      if (edad === '') {
        throw new ValidationError('La edad no puede estar vacía, por favor ingresela.')
      }
      else if (!edadPattern.test(edad)) {
        throw new ValidationError('La edad solo permite números, verifique su respuesta.')
      } else if (edad > 200) {
        throw new ValidationError('La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.')
      }

      //validacion que el telefono no este vacio, que no tenga mas de 10 caracteres y que solo permita numeros
      if (telefono === '') {
        throw new ValidationError('El teléfono no puede estar vacío, por favor ingréselo.')
      }
      else if (telefono.length > 10) {
        throw new ValidationError('El teléfono no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
      }
      else if (!edadPattern.test(telefono)) {
        throw new ValidationError('El teléfono solo permite números, verifique su respuesta.')
      }

      //validacion que el sexo no este vacio
      if (sexo === '0') {
        throw new ValidationError('Por favor seleccione un género.')
      }

      //validacion que la calle no este vacia, que no tenga mas de 100 caracteres
      if (calle === '') {
        throw new ValidationError('La calle no puede estar vacía, por favor ingrésela.')
      }
      else if (calle.length > 100) {
        throw new ValidationError('La calle no puede tener más de 100 caracteres, por favor ingrésela correctamente.')
      }

      //validacion que el numero exterior no este vacio, que no tenga mas de 10 caracteres y que solo permita numeros
      if (numeroExt === '') {
        throw new ValidationError('El número exterior no puede estar vacío, por favor ingréselo.')
      }
      else if (numeroExt.length > 10) {
        throw new ValidationError('El número exterior no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
      }
      else if (!edadPattern.test(numeroExt)) {
        throw new ValidationError('El número exterior solo permite números, verifique su respuesta.')
      }

      //En caso de que el numero interior no este vacio, que no tenga mas de 10 caracteres y que solo permita numeros
      if (numeroInt !== '') {
        if (numeroInt.length > 10) {
          throw new ValidationError('El número interior no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
        }
        else if (!edadPattern.test(numeroInt)) {
          throw new ValidationError('El número interior solo permite números, verifique su respuesta.')
        }
      }

      //validacion que la colonia no este vacia
      if (colonia === '0') {
        throw new ValidationError('Por favor busque una colonia y selecciónela, por favor.')
      }

      //En caso de que se cumplan todas las validaciones se retorna true
      return true
    } catch (error) {
      //Manejo de excepciones
      if (error instanceof ValidationError) {
        this.#showModal(error.message, 'Error de validación')
      } else {
        console.error(error)
        this.#showModal(
          'Error al validar datos , persona, domicilio, por favor intenta de nuevo',
          'Error'
        )
      }
      return false
    }
  }

  //Metodo qencargado de buscar el codigo postal y llenar los campos de estado, municipio, ciudad y colonia
  async searchCP() {
    try {
      //Se obtienen los datos de la API
      const { colonias: data } = await this.#api.getDomicilioByCP(
        this.#cp.value
      )
      //En caso de que no se encuentre el codigo postal se lanza una excepcion
      if (!data || typeof data === 'string') {
        this.#showModal('No se encontró el código postal', 'Advertencia')
        return
      }
      //Se vacian los campos de estado, municipio, ciudad y colonia , y se llenan con los datos obtenidos de la API
      this.#estado.innerHTML = '';
      this.#estado.value = data.estado.nombre_estado
      this.#municipio.innerHTML = '';
      this.#municipio.value = data.municipio.nombre_municipio
      this.#ciudad.innerHTML = '';
      this.#ciudad.value = data.ciudad.nombre_ciudad
      this.#colonia.innerHTML = '';

      //Se agrega una opcion por defecto
      const option = document.createElement('option')
      option.value = '0'
      option.textContent = 'Seleccione una colonia'
      this.#colonia.appendChild(option)

      //Se recorren las colonias y se agregan al select
      data.colonias.forEach(colonia => {
        const option = document.createElement('option')
        option.value = colonia.id_colonia
        option.textContent = colonia.nombre_colonia
        this.#colonia.appendChild(option)
      })
    } catch (error) {
      console.error(error)
      this.#showModal('Error al buscar el código postal', 'Error')
    }
  }

  //Metodo que se encarga de conectar el componente con el DOM
  async campos() {
    //Se asigna la variable del boton siguiente
    this.btnNext = this.shadowRoot.getElementById('btn-demandado-next')

    //Se asigna el evento click al boton siguiente
    this.btnNext.addEventListener('click', () => {
      if (!this.validateInputs()) return
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'proceso' },
      })
      this.dispatchEvent(event)
    })

    //Manejo de eventos con respect al cambio de tab
    document.addEventListener('tab-change', event => {
      const tabId = event.detail.tabId
      if (tabId !== 'demandado') {
        return
      }
      // Estas condiciones que se ven aqui son con el fin de que cuando un usuario seleccione
      // un turno y luego seleccione otro turno, pues se valide ese caso y se reseteen los campos o se inicilicen con respecto
      // al nuevo turno seleccionado
      if (this.registroTab.isComplete === true) {

        if (this.#turnoSeleccionado === null) {
          this.#turnoSeleccionado = this.registroTab.turno
          this.init()
        }
        if (this.#turnoSeleccionado !== null && this.#turnoSeleccionado.id_turno !== this.registroTab.turno.id_turno) {
          this.#turnoSeleccionado = this.registroTab.turno
          this.resetCampos()
          this.init()
        }
      }
    })

  }

  //Metodo que se encarga de limpiar los campos del formulario
  resetCampos() {
    this.#nombre.value = ''
    this.#apellidoPaterno.value = ''
    this.#apellidoMaterno.value = ''
    this.#edad.value = ''
    this.#telefono.value = ''
    this.#sexo.value = '0'
    this.#calle.value = ''
    this.#numeroExt.value = ''
    this.#numeroInt.value = ''
    this.#cp.value = ''
    this.#estado.value = ''
    this.#municipio.value = ''
    this.#ciudad.value = ''
    this.#colonia.innerHTML = ''

    // Se agrega una opcion por defecto
    const option = document.createElement('option')
    option.value = '0'
    option.textContent = 'Seleccione una colonia'
    this.#colonia.appendChild(option)
  }

  //Metodo que muestra un modal con respecto a un mensaje y un titulo para errores, etc
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.setOnCloseCallback(() => { })

    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }


}

customElements.define('demandado-full-tab', DemandadoTab)
