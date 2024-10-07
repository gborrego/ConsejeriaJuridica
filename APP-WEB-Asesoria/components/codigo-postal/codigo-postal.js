import { APIModel } from '../../models/api.model.js'


export class CodigoPostal extends HTMLElement {

  //Variables privadas
  #API
  #calle
  #numeroExt
  #numeroInt
  #cp
  #municipio
  #estado
  #ciudad
  #colonia

  //Método para observar los atributos
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo para obtener los atributos
  get id() {
    return this.getAttribute('id')
  }

  //Metodo para asignar los atributos
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo para obtener los datos del domicilio en formato JSON
  get data() {
    return {
      calle: this.#calle.value,
      numeroExt: this.#numeroExt.value,
      numeroInt: this.#numeroInt.value,
      cp: this.#cp.value,
      estado: this.#estado.value,
      municipio: this.#municipio.value,
      ciudad: this.#ciudad.value,
      colonia: this.#colonia.value,
    }
  }

  //Metodo para asignar los datos del domicilio en formato JSON
  set data(value) {
    this.setAttribute('data', value)
  }


  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('/components/codigo-postal/codigo-postal.html')).text();
    template.innerHTML = html;
    return template;
  }

  //Constructor de la clase
  constructor() {
    super()
    this.init()

  }

  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Se inicializa la variable API
    this.#API = new APIModel()
    await this.campos()
    //Llamada a la función manageFormFields para manejar los campos del formulario
    this.manageFormFields()
    //Llamada a la función manejadorEntradaInputs para manejar la entrada de los inputs
    this.manejadorEntradaInputs()
  }
  //Función para manejar los campos del formulario
  manageFormFields() {
    //Se inicializan las variables que representan los campos del formulario
    this.#calle = this.shadowRoot.getElementById('calle')
    this.#numeroExt = this.shadowRoot.getElementById('numero-ext')
    this.#numeroInt = this.shadowRoot.getElementById('numero-int')
    this.#cp = this.shadowRoot.getElementById('codigo-postal')
    this.#municipio = this.shadowRoot.getElementById('municipio')
    this.#estado = this.shadowRoot.getElementById('estado')
    this.#ciudad = this.shadowRoot.getElementById('ciudad')
    this.#colonia = this.shadowRoot.getElementById('colonia')
  }

  //Función manejadorEntradaInputs para manejar la entrada de los inputs
  manejadorEntradaInputs() {
    var calleInput = this.#calle;
    //Se crea la expresión regular para validar que solo se ingresen letras
    calleInput.addEventListener('input', function () {
      if (calleInput.value !== '') {
        if (calleInput.value.length > 75) {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });
          modal.message = 'La calle no puede tener más de 75 caracteres, por favor ingresela correctamente.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      }
    });

    //Expresione regulare para validar que solo se ingresen números en los campos de número exterior e interior y variables de los inputs
    var numeroExteriorInput = this.#numeroExt;
    var numeroInteriorInput = this.#numeroExt;
    var enterosPattern = /^\d+$/;

    //Se crea la expresión regular para validar que solo se ingresen números
    numeroExteriorInput.addEventListener('input', function () {
      if (numeroExteriorInput.value !== '') {
        if (numeroExteriorInput.value === 'e' || !enterosPattern.test(numeroExteriorInput.value)) {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });
          modal.message = 'El número exterior solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else if (numeroExteriorInput.value.length > 10) {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });
          modal.message = 'El número exterior no debe tener más de 10 dígitos, por favor ingreselo correctamente.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      }
    });

    //Se crea la expresión regular para validar que solo se ingresen números
    numeroInteriorInput.addEventListener('input', function () {

      if (numeroInteriorInput.value !== '') {
        if (numeroInteriorInput.value === 'e' && !enterosPattern.test(numeroInteriorInput.value)) {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });
          modal.message = 'El número interior solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else
          if (numeroInteriorInput.length > 10) {
            const modal = document.querySelector('modal-warning');
            modal.setOnCloseCallback(() => { });
            modal.message = 'El número interior no puede tener más de 10 caracteres, por favor ingreselo correctamente.';
            modal.title = 'Error de validación';
            modal.open = true;
          }
      }
    });
  }

  //ConecctedCallback para conectar el componente y manejar el evento submit del formulario
  async campos() {
    //Se inicializan las variables que representan los campos del formulario
    this.formCP = this.shadowRoot.getElementById('form-cp')

    //Se maneja el evento submit del formulario
    this.formCP.addEventListener('submit', e => {
      e.preventDefault()
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
  }

  //Función para buscar el código postal y llenar los campos de estado, municipio, ciudad y colonia
  async searchCP() {
    try {
      const { colonias: data } = await this.#API.getDomicilioByCP(
        this.#cp.value
      )

      this.#estado.innerHTML = '';
      this.#estado.value = data.estado.nombre_estado
      this.#municipio.innerHTML = '';
      this.#municipio.value = data.municipio.nombre_municipio
      this.#ciudad.innerHTML = '';
      this.#ciudad.value = data.ciudad.nombre_ciudad
      this.#colonia.innerHTML = '';
      data.colonias.forEach(colonia => {
        const option = document.createElement('option')
        option.value = colonia.id_colonia
        option.textContent = colonia.nombre_colonia
        this.#colonia.appendChild(option)
      })
    } catch (error) {
      this.#showModal('Error al buscar el código postal o no hubo coincidencias', 'Error')
    }
  }

  //Función para mostrar el modal de advertencia
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }

}

customElements.define('cp-comp', CodigoPostal)
