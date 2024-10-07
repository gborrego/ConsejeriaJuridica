export class Modal extends HTMLElement {
  // Variable auxiliar para almacenar la respuesta
  #variableAxuliar = false;

  // Metodo encargado de definir los atributos que se observaran
  static get observedAttributes() {
    return ['open', 'message', 'title', 'onClose'];
  }

  // Metodo que se obtiene el valor del atributo message
  get message() {
    return this.getAttribute('message');
  }

  // Metodo que establece el valor del atributo message
  set message(value) {
    this.shadowRoot.getElementById('mensaje-alerta').innerHTML = value;
  }

  // Metodo que se obtiene el valor del atributo open
  get open() {
    return this.getAttribute('open');
  }

  // Metodo que establece el valor del atributo open
  set open(value) {
    this.setAttribute('open', value);
  }

  // Metodo que se obtiene el valor del atributo respuesta
  get respuesta() {
    return this.#variableAxuliar;
  }

  // Metodo que establece el valor del atributo respuesta
  set respuesta(value) {
    this.#variableAxuliar = value;
  }

  // Metodo que se obtiene el valor del atributo title
  get title() {
    return this.getAttribute('title');
  }

  // Metodo que establece el valor del atributo title
  set title(value) {
    this.shadowRoot.getElementById('title-alerta').innerHTML = value;
  }

  // Método para inicializar el componente
  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    this.campos();
  }

  // Constructor de la clase
  constructor() {
    super();
    this.init();
  }

  // Método para obtener la plantilla
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/modal-warning.html')).text();
    template.innerHTML = html;
    return template;
  }

  // Callback que se ejecuta cuando el componente es agregado al DOM
  campos() {
    // Se establece la variable de cierre en null
    this._onCloseCallback = null;

    // Se establece la función de cierre
    this.onClose = () => {
      // Se obtiene el elemento alerta
      const alerta = this.shadowRoot.getElementById('alerta');
      alerta.style.display = 'none';
      // Se establece el valor del atributo open en false
      this.setAttribute('open', 'false');

      // Si hay una función de cierre configurada, llámala
      if (typeof this._onCloseCallback === 'function') {
        this._onCloseCallback();
      }
    };

    // Se obtienen los elementos del DOM que se van a utilizar en este caso los botones de cerrar y aceptar
    this.btnCloseAlerta = this.shadowRoot.getElementById('btn-close-alerta');
    this.idAlerta = this.shadowRoot.getElementById('alerta');
    this.btnAceptarAlerta = this.shadowRoot.getElementById('btn-aceptar-alerta');

    // Se añaden los eventos a los botones
    this.btnCloseAlerta.addEventListener('click', () => {
      this.respuesta = false;
      this.onClose();
    });

    // Se añade el evento para cerrar el modal al hacer click fuera de él
    this.btnAceptarAlerta.addEventListener('click', () => {
      this.respuesta = true;
      this.onClose();
    });

    // Se añade el evento para cerrar el modal al hacer click fuera de él
    this.idAlerta.addEventListener('click', e => {
      if (e.target === this.idAlerta) {
        this.respuesta = false;
        this.onClose();
      }
    });
  }

  // Metodo que permite configurar la función de cierre desde fuera de la clase
  setOnCloseCallback(callback) {
    // Permite configurar la función de cierre desde fuera de la clase
    this._onCloseCallback = callback;
  }

  // Metodo que se ejecuta cuando se elimina el componente del DOM
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open' && newValue === 'true') {
      const alerta = this.shadowRoot.getElementById('alerta');
      alerta.style.display = 'flex';
    }
  }
}

customElements.define('modal-warning', Modal);
