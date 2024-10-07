import { ValidationError } from '../../lib/errors.js'
import { validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model.js'
import '../codigo-postal/codigo-postal.js'

 

// Se crea la clase AsesoradoTab que extiende de HTMLElement
export class AsesoradoTab extends HTMLElement {
  // Se crean las variables privadas

  //Variable que almacena la instancia de la clase APIModel
  #api

  //Select, input y radio buttons del formulario
  // Variable que almacena el input de nombre
  #nombre
  // Variable que almacena el input de apellido paterno
  #apellidoPaterno
  // Variable que almacena el input de apellido materno
  #apellidoMaterno
  // Variable que almacena el input de edad
  #edad
  // Variable que almacena el select de sexo
  #sexo
  // Variable que almacena el input de telefono
  #telefono
  //Radio button que almacena el estatus de trabajo
  #estatusTrabajo

  //Esta variable almacena el radio de ingreso
  #ingreso
  //Variable que almacena el input de numero de hijos
  #numeroHijos
  //Variable que almacenara el select de motivo
  #motivo
  //Variable que almacena el select de estado civil
  #estadoCivil

  //Arreglos y datos
  //Variable donde se guardan los motivos con estatus activo
  #motivos
  //Variable donde se guardan los generos con estatus activo
  #generos
  //Variable  que almacena los estados civiles con estatus activo
  #estadosCiviles
  //Variable que almacena los datos del domicilio
  #domicilio

  // Se crea el método estático observedAttributes que retorna un array con los atributos que se desean observar
  static get observedAttributes() {
    return ['id', 'data']
  }

  // Metodo que obtiene el valor del atributo id
  get id() {
    return this.getAttribute('id')
  }

  // Metodo que asigna un valor al atributo id
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que asigna un valor al atributo data
  set data(value) {
    this.setAttribute('data', value)
  }

  //Metodo que verifica si el formulario esta completo
  get isComplete() {
    return this.validateInputs()
  }


  //Metodo que obtiene los valores de todo el formulario
  get data() {
    // Creacion de JSON con los datos 
    const asesorado = {
      estatus_trabajo: this.#estatusTrabajo === 'yes',
      numero_hijos: Number(this.#numeroHijos.value),
      ingreso_mensual: this.#estatusTrabajo === 'yes' ? (Number(this.#ingreso)) : null,
      motivo: this.#estatusTrabajo === 'no' ?
        {
          id_motivo: Number(this.#motivo.value),
        } : null,
      estado_civil: {
        id_estado_civil: Number(this.#estadoCivil.value),
        estado_civil:
          this.#estadoCivil.options[this.#estadoCivil.selectedIndex].text,
      },
    }
    //Creacion de JSON con los datos de la persona
    const persona = {
      nombre: this.#nombre.value,
      apellido_paterno: this.#apellidoPaterno.value,
      apellido_materno: this.#apellidoMaterno.value,
      edad: Number(this.#edad.value),
      telefono: this.#telefono.value,
      domicilio: {
        calle_domicilio: this.#domicilio.data.calle,
        numero_exterior_domicilio: this.#domicilio.data.numeroExt,
        numero_interior_domicilio: this.#domicilio.data.numeroInt,
        id_colonia: this.#domicilio.data.colonia,
      },
      genero: {
        id_genero: Number(this.#sexo.value),
        descripcion_genero: this.#sexo.options[this.#sexo.selectedIndex].text,
      },
    }

    return {
      asesorado,
      persona,
    }
  }
 

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/asesoria/asesorado-tab.html')).text();
    template.innerHTML = html;
    return template;
  }

  //Constructor de la clase
  constructor() {
    super()
    //Este id es con respecto al manejo de las tabs y los eventos relacionaos al archivo de tabs-header.js
    this.id = 'asesorado'
    // Llamado al metodo init
    this.init()
  }

  //Metodo que se encarga de inicializar el componente
  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    // Se crea una instancia de la clase APIModel
    this.#api = new APIModel()
    await this.campos()
    // Metodo que se encarga de establecer las variables con respecto a los campos del formulario
    this.manageFormFields()
    //v Metodo que rellena los campos select del formulario
    await this.busquedaDatosSelects()
    //Metodo que se encarga de rellenar los campos select del formulario
    this.fillInputs()
    //Metodo que se encarga de validar los campos del formulario en tiempo real con respecto a metodos input
    this.validacionesEntrada()
  }

  //Metodo que se encarga de buscar los datos de los selects
  async busquedaDatosSelects() {
    // Se obtienen los datos del select de generos, getGeneros2 es un metodo de la clase APIModel el cual obtiene los generos con estatus de activo
    try {
      const { generos } = await this.#api.getGeneros2()
      // Se asignan los generos a la variable generos
      this.#generos = generos
    }
    catch (error) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      });
      modal.message = 'Error al cargar los datos de generos, por favor intenta de nuevo habilitarlos o ingresar nuevos datos.'
      modal.title = 'Error'
      modal.open = true
    }
    try {
      // Se obtienen los datos del select de motivos, getMotivos2 es un metodo de la clase APIModel el cual obtiene los motivos con estatus de activo
      const { motivos } = await this.#api.getMotivos2()
      // Se asignan los motivos a la variable motivos
      this.#motivos = motivos
    } catch (error) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      });
      modal.message = 'Error al cargar los datos de motivos, por favor intenta de nuevo habilitarlos o ingresar nuevos datos.'
      modal.title = 'Error'
      modal.open = true
    }
    try {
      // Se obtienen los datos del select de estados civiles, getEstadosCiviles2 es un metodo de la clase APIModel el cual obtiene los estados civiles con estatus de activo
      const { estadosCiviles } = await this.#api.getEstadosCiviles2()
      // Se asignan los estados civiles a la variable estadosCiviles
      this.#estadosCiviles = estadosCiviles
    }
    catch (error) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      });
      modal.message = 'Error al cargar los datos de estados civiles, por favor intenta de nuevo habilitarlos o ingresar nuevos datos.'
      modal.title = 'Error'
      modal.open = true
    }
  }

  //Metodo que se encarga de asignar los campos del formulario a las variables privadas
  manageFormFields() {
    // Inicializacion de variables privadas con respecto a elementos del formulario
    this.#nombre = this.shadowRoot.getElementById('nombre')
    this.#apellidoPaterno = this.shadowRoot.getElementById('apellido-paterno')
    this.#apellidoMaterno = this.shadowRoot.getElementById('apellido-materno')
    this.#edad = this.shadowRoot.getElementById('edad')
    this.#sexo = this.shadowRoot.getElementById('sexo')
    this.#telefono = this.shadowRoot.getElementById('telefono')
    this.#motivo = this.shadowRoot.getElementById('motivo')
    this.#estadoCivil = this.shadowRoot.getElementById('estado-civil')
    this.#numeroHijos = this.shadowRoot.getElementById('numero-hijos')
    this.#domicilio = this.shadowRoot.querySelector('cp-comp')
  }
  // Metodo que se encarga de rellenar los campos select del formulario
  fillInputs() {
    // Se recorren los generos y se añaden al select de generos

    this.#generos.forEach(genero => {
      const option = document.createElement('option')
      option.value = genero.id_genero
      option.text = genero.descripcion_genero
      this.#sexo.appendChild(option)
    })

    // Se recorren los motivos y se añaden al select de motivos
    this.#motivos.forEach(motivo => {
      const option = document.createElement('option')
      option.value = motivo.id_motivo
      option.text = motivo.descripcion_motivo
      this.#motivo.appendChild(option)
    })

    // Se recorren los estados civiles y se añaden al select de estados civiles
    this.#estadosCiviles.forEach(estadoCivil => {
      const option = document.createElement('option')
      option.value = estadoCivil.id_estado_civil
      option.text = estadoCivil.estado_civil
      this.#estadoCivil.appendChild(option)
    })

  }

  /**
   * Método que se encarga de validar los campos de entrada del formulario
   */
  validacionesEntrada() {
    // Obtener una referencia al campo de entrada
    var nombreInput = this.#nombre;
    var apellidoPaternoInput = this.#apellidoPaterno;
    var apellidoMaternoInput = this.#apellidoMaterno;
    // Agregar un evento 'input' al campo de entrada para validar en tiempo real
    nombreInput.addEventListener('input', function () {
      if (nombreInput.value !== '') {
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

      }

    });

    apellidoPaternoInput.addEventListener('input', function () {
      if (apellidoPaternoInput.value !== '') {
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
      }
    });

    apellidoMaternoInput.addEventListener('input', function () {
      if (apellidoMaternoInput.value !== '') {
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
      }
    });

    var edadInput = this.#edad;

    edadInput.addEventListener('input', function () {
      if (edadInput.value !== '') {
        var edadPattern = /^\d+$/;
        if (edadInput.value === "e" || !edadPattern.test(edadInput.value)) {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });
          modal.message = 'La edad solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else if (edadInput.value > 200) {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });
          modal.message = 'La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      }
    });

    var numeroHijosInput = this.#numeroHijos;

    numeroHijosInput.addEventListener('input', function () {
      var enterosPattern = /^\d+$/;
      if (numeroHijosInput.value === "e" || !enterosPattern.test(numeroHijosInput.value)) {

        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });
        modal.message = 'El número de hijos solo permite números, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      }

      else if (numeroHijosInput.value > 200) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });
        modal.message = 'El número de hijos no puede ser mayor a 200, por favor ingreselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }

    });

    var telefonoInput = this.#telefono;

    telefonoInput.addEventListener('input', function () {
      if (telefonoInput.value !== '') {

        var enterosPattern = /^\d+$/;

        if (telefonoInput.value === "e" || !enterosPattern.test(telefonoInput.value)) {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });
          modal.message = 'El teléfono solo debe de tener dígitos, por favor ingreselo correctamente.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
        else if (telefonoInput.value.length > 10) {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });
          modal.message = 'El teléfono no debe tener 10 dígitos, por favor ingreselo correctamente.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      }

    });
  }

  //Metodo que se encarga de validar los campos del formulario
  validateInputs() {
    // Se asignan los valores de los campos del formulario a las variables privadas
    this.#estatusTrabajo = this.shadowRoot.querySelector(
      'input[name="rb-trabajo"]:checked'
    )?.value
    // Se asigna el valor del campo ingreso a la variable privada ingreso
    this.#ingreso = this.shadowRoot.querySelector(
      'input[name="rb-ingreso"]:checked'
    )?.value

    // Se crea un try catch para manejar los errores
    try {
      // Expresión regular para validar que solo se ingresen letras y espacios en blanco
      var nombrePattern2 = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      // Expresión regular para validar que solo se ingresen letras
      var nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      // Expresión regular para validar que solo se ingresen números enteros
      var enterosPattern = /^\d+$/;

      // Se valida que el campo nombre no este vacio     
      if (this.#nombre.value === '') {
        throw new ValidationError('El nombre no puede estar vacío, por favor ingreselo.')
      }
      // Se valida que el campo nombre solo contenga letras
      else if (!nombrePattern2.test(this.#nombre.value)) {
        throw new ValidationError('El nombre solo permite letras, verifique su respuesta.')
      }
      // Se valida que el campo nombre no tenga mas de 50 caracteres
      else if (this.#nombre.value.length > 50) {
        throw new ValidationError('El nombre no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
      }


      //Se valida que el campo apellido paterno no este vacio, solo contenga letras y no tenga mas de 50 caracteres
      if (this.#apellidoPaterno.value === '') {
        throw new ValidationError('El apellido paterno no puede estar vacío, por favor ingreselo.')
      }
      else if (!nombrePattern2.test(this.#apellidoPaterno.value)) {
        throw new ValidationError('El apellido paterno solo permite letras, verifique su respuesta.')
      } else if (this.#apellidoPaterno.value.length > 50) {
        throw new ValidationError('El apellido paterno no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
      }

      //Se valida que el campo apellido materno no este vacio, solo contenga letras y no tenga mas de 50 caracteres
      if (this.#apellidoMaterno.value === '') {
        throw new ValidationError('El apellido materno no puede estar vacío, por favor ingreselo.')
      }
      else if (!nombrePattern2.test(this.#apellidoMaterno.value)) {
        throw new ValidationError('El apellido materno solo permite letras, verifique su respuesta.')
      } else if (this.#apellidoMaterno.value.length > 50) {
        throw new ValidationError('El apellido materno no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
      }


      //Se valida que el campo edad si no este vacio, solo contenga numeros y no sea mayor a 200
      if (this.#edad.value === '') {
        throw new ValidationError('La edad no puede estar vacía, por favor ingresela.')
      }
      else if (this.#edad.value === "e" || !enterosPattern.test(this.#edad.value)) {
        throw new ValidationError('La edad solo permite números, verifique su respuesta.')
      }
      else if (this.#edad.value > 200) {
        throw new ValidationError('La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.')
      }

      //Se valida que el campo sexo no este vacio
      if (this.#sexo.value === '') {
        throw new ValidationError('El sexo es obligatorio, por favor seleccione uno.')
      }

      //Se valida que el campo telefono solo contenga numeros, no tenga mas de 10 caracteres cuando no este vacio
      if (this.#telefono.value !== '') {
        if (this.#telefono.value === 'e' || !enterosPattern.test(this.#telefono.value)) {
          throw new ValidationError('El teléfono solo debe de  dígitos, por favor ingreselo correctamente.')
        }
        else if (this.#telefono.value.length > 10) {
          throw new ValidationError('El teléfono no debe tener 10 dígitos, por favor ingreselo correctamente.')
        } else if (this.#telefono.value.length < 10) {
          throw new ValidationError('El teléfono no debe ser menor a 10 dígitos, por favor ingreselo correctamente.')
        }
      }


      //Se valida que el campo estatusTrabajo no este vacio, si es yes se valida que el campo ingreso no este vacio, si es no se valida que el campo motivo no este vacio
      if (this.#estatusTrabajo === '' || this.#estatusTrabajo === undefined) {
        throw new ValidationError('Seleccione una opción para el ingreso o el motivo de no trabajar.')
      } else if (this.#estatusTrabajo === 'yes' && this.#ingreso === undefined) {
        throw new ValidationError('Seleccione una opción para el ingreso promedio.')
      } else if (this.#estatusTrabajo === 'no' && this.#motivo.value === '') {
        throw new ValidationError('Seleccione una opción para el motivo de no trabajar.')
      }

      //Se valida que el campo estadoCivil no este vacio
      if (this.#estadoCivil.value === '0') {
        throw new ValidationError('El estado civil es obligatorio, por favor seleccione uno.')
      }

      // Se valida que el campo numeroHijos no este vacio, solo contenga numeros y no sea mayor a 200
      if (this.#numeroHijos.value === '') {
        throw new ValidationError('El número de hijos no puede estar vacío, por favor ingreselo.')
      }
      else if (this.#numeroHijos.value === 'e' || !enterosPattern.test(this.#numeroHijos.value)) {
        throw new ValidationError('El número de hijos solo permite números, verifique su respuesta.')
      }
      else if (this.#numeroHijos.value > 200) {
        throw new ValidationError('El número de hijos no puede ser mayor a 200, por favor ingreselo correctamente.')
      }

      //Se valida que el campo calle no este vacio, no tenga mas de 75 caracteres
      if (this.#domicilio.data.calle === '') {
        throw new ValidationError('La calle no puede estar vacía, por favor ingresela.')
      } else if (this.#domicilio.data.calle.length > 75) {
        throw new ValidationError('La calle no puede tener más de 75 caracteres, por favor ingresela correctamente.')
      }

      //Se valida que el campo numeroExt no este vacio, solo contenga numeros, no tenga mas de 10 caracteres
      if (this.#domicilio.data.numeroExt === '') {
        throw new ValidationError('El número exterior no puede estar vacío, por favor ingreselo.')
      } else if (this.#domicilio.data.numeroExt === 'e' && !enterosPattern.test(this.#domicilio.data.numeroExt)) {
        throw new ValidationError('El número exterior solo permite números, verifique su respuesta.')
      } else if (this.#domicilio.data.numeroExt.length > 10) {
        throw new ValidationError('El número exterior no debe tener más de 10 dígitos, por favor ingreselo correctamente.')
      }

      //Se valida que el campo numeroInt solo contenga numeros, no tenga mas de 10 caracteres
      if (this.#domicilio.data.numeroInt !== '') {
        if (this.#domicilio.data.numeroInt === 'e' && !enterosPattern.test(this.#domicilio.data.numeroInt)) {
          throw new ValidationError('El número interior solo permite números, verifique su respuesta.')
        } else
          if (this.#domicilio.data.numeroInt.length > 10) {
            throw new ValidationError('El número interior no puede tener más de 10 caracteres, por favor ingreselo correctamente.')
          }
      }
    


      /*
      if (this.#domicilio.data.colonia === '') {
        throw new ValidationError('La colonia es obligatoria, por favor busque una con el codigo postal.')
      }
      */

      return true
    } catch (error) {
      if (error instanceof ValidationError) {
        this.#showModal(error.message, 'Error de validación')
      } else {
        console.error(error)
        this.#showModal(
          'Error al registrar el turno, por favor intenta de nuevo',
          'Error'
        )
      }

      return false
    }
  }

  //Metodo que se encarga de manejar los eventos de los elementos del formulario
  async campos() {
    this.btnNext = this.shadowRoot.getElementById('btn-asesorado-next')
    const radioButtons = this.shadowRoot.querySelectorAll(
      'input[name="rb-trabajo"]'
    )

    const ingresoContainer = this.shadowRoot.getElementById('ingreso-container')
    const motivoContainer = this.shadowRoot.getElementById('motivo-container')

    // Se añade un evento change a los radioButtons para mostrar u ocultar los campos de ingreso o motivo
    radioButtons.forEach(radioButton => {
      radioButton.addEventListener('change', event => {
        if (event.target.value === 'yes') {
          ingresoContainer.classList.remove('hidden')
          ingresoContainer.classList.add('flex')
          motivoContainer.classList.add('hidden')
        } else {
          ingresoContainer.classList.add('hidden')
          ingresoContainer.classList.remove('flex')
          motivoContainer.classList.remove('hidden')
          motivoContainer.classList.add('flex')
        }
      })
    })

    // Metodo que se encarga de añadir un evento click al boton de siguiente, y asi poder pasar al siguiente tab
    this.btnNext.addEventListener('click', () => {
      if (!this.validateInputs()) return
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'asesoria' },
      })
      this.dispatchEvent(event)
    })
  }

  //Metodo que muestra un modal de error
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }


}

customElements.define('asesorado-full-tab', AsesoradoTab)
