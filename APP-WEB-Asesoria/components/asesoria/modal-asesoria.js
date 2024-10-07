

export class ModalAsesoria extends HTMLElement {
   
  // MEtodo que se encarga de obtener los atributos que se le pasan al componente
  static get observedAttributes() {
    return ['open', 'title', 'onClose']
  }

  //Metodo que se encarga de obtener el valor del atributo open
  get open() {
    return this.getAttribute('open')
  }

  //Metodo que se encarga de asignar el valor del atributo open
  set open(value) {
    this.setAttribute('open', value)
  }

  //Metodo que se encarga de obtener el valor del atributo title
  get title() {
    return this.getAttribute('title')
  }

  //Metodo que se encarga de asignar el valor del atributo title
  set title(value) {
    this.shadowRoot.getElementById('title-alerta').innerHTML = value
  }
  
  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    await this.campos()
  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/modal-asesoria.html')).text();
    template.innerHTML = html;
    return template;
  }

  //Constructor de la clase ModalAsesoria
  constructor() {
    super()
    this.init()
    //Metodo que se encarga de cerrar el modal
    this.onClose = () => {
      const modal = this.shadowRoot.getElementById('modal')
      modal.style.display = 'none'
      this.setAttribute('open', 'false')
      const onCloseEvent = new CustomEvent('onClose')
      this.dispatchEvent(onCloseEvent)

      // También puedes llamar a la función de cierre proporcionada desde fuera de la clase, si está configurada
      if (typeof this._onCloseCallback === 'function') {
        this._onCloseCallback()
      }
    }
  }

  //Metodo que se encarga de inicializar el componente
  async campos() { 
     
    //Se obtienen los elementos del DOM que representan el boton de cerrar, el modal y el boton de aceptar
    this.btnClose = this.shadowRoot.getElementById('btn-close')
    this.modal = this.shadowRoot.getElementById('modal')
    this.btnAceptar = this.shadowRoot.getElementById('btn-aceptar')

    //Se agregan los eventos de click al boton de cerrar, al modal y al boton de aceptar
    this.btnClose.addEventListener('click', this.onClose)

    this.btnAceptar.addEventListener('click', this.onClose)

    //Se agrega el evento de click al modal
    this.modal.addEventListener('click', e => {
      if (e.target === this.modal) {
        this.onClose()
      }
    })
  }
 
  //Metodo que se encarga de configurar la funcion de cierre desde fuera de la clase
  setOnCloseCallback(callback) {
    // Permite configurar la función de cierre desde fuera de la clase
    this._onCloseCallback = callback
  }
  
  //Metodo que se encarga de manejar los cambios en los atributos del componente
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open' && newValue === 'true') {
      const alerta = this.shadowRoot.getElementById('modal')
      alerta.style.display = 'flex'
    }
  }

}

customElements.define('modal-asesoria', ModalAsesoria)
