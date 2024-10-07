const template = document.createElement('template')

 
export class ModalEstadosProcesales extends HTMLElement {

  // Atributos que se observarán
  static get observedAttributes() {
    return ['open', 'title', 'onClose']
  }
   
  //Metodo para obtener el modal
  get open() {
    return this.getAttribute('open')
  }

  //Metodo para abrir el modal
  set open(value) {
    this.setAttribute('open', value)
  }

  //Metodo para obtener el titulo
  get title() {
    return this.getAttribute('title')
  }

  //Metodo para establecer el titulo
  set title(value) {
    this.shadowRoot.getElementById('title-alerta').innerHTML = value
  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/modal-estados-procesales.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    await this.campos()

  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()
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


  //Metodo para establecer los eventos
  async campos() {
    this.btnClose = this.shadowRoot.getElementById('btn-close')
    this.modal = this.shadowRoot.getElementById('modal')
    this.btnAceptar = this.shadowRoot.getElementById('btn-aceptar')

    this.btnClose.addEventListener('click', this.onClose)

    this.btnAceptar.addEventListener('click', this.onClose)

    this.modal.addEventListener('click', e => {
      if (e.target === this.modal) {
        this.onClose()
      }
    })
  }

  //Metodo para cerrar el modal
  setOnCloseCallback(callback) {
    // Permite configurar la función de cierre desde fuera de la clase
    this._onCloseCallback = callback
  }

  //Metodo para observar los cambios
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open' && newValue === 'true') {
      const alerta = this.shadowRoot.getElementById('modal')
      alerta.style.display = 'flex'
    }
  }

}

customElements.define('modal-estados-procesales', ModalEstadosProcesales)
