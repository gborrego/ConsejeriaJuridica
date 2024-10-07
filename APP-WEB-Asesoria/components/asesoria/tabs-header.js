
class AsesoriaTabs extends HTMLElement {
  // Datos privados de la clase AsesoriaTabs que nos ayudarán a controlar el estado de las pestañas
  #activeTab
  #tabs = ['asesorado', 'asesoria', 'detalles']
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    this.btnAsesorado = this.shadowRoot.getElementById('btn-asesorado')
    this.btnAsesoria = this.shadowRoot.getElementById('btn-asesoria')
    this.btnDetalles = this.shadowRoot.getElementById('btn-detalles')
    await this.campos();
    await this.addClickEventListeners()
  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/asesoria/tabs.html')).text();
    template.innerHTML = html;
    return template;
  }
  constructor() {
    super()
    // Se obtienen los elementos del DOM que representan las pestañas


    // Se inicializa la pestaña activa
    this.#activeTab = 'asesorado'
    this.init2()

  }

  //Metodo que se ejecuta cuando el componente es agregado al DOM, y se encarga de escuchar el evento 'next' que se dispara cuando se quiere cambiar de pestaña
  async campos() {
    document.addEventListener('next', event => {
      const tabId = event.detail.tabId
      this.handleTabClick(tabId)
    })
  }

  // Metodo que se encarga de agregar los eventos de click a los botones de las pestañas
  async addClickEventListeners() {
    //Se agregan evento de click al boton de asesorado y se llama al metodo handleTabClick con el parametro 'asesorado'
    this.btnAsesorado.addEventListener('click', () =>
      this.handleTabClick('asesorado')
    )
    //Se agregan evento de click al boton de asesoria y se llama al metodo handleTabClick con el parametro 'asesoria'
    this.btnAsesoria.addEventListener('click', () =>
      this.handleTabClick('asesoria')
    )
    //Se agregan evento de click al boton de detalles y se llama al metodo handleTabClick con el parametro 'detalles'
    this.btnDetalles.addEventListener('click', () =>
      this.handleTabClick('detalles')
    )
  }

  //Metodo que se encarga de manejar el evento de click en los botones de las pestañas
  handleTabClick(tabId) {
    try {
      // Se llama al metodo changeTab con el parametro tabId
      this.dispatchEventTabChangeEvent(tabId)
      // Se llama al metodo showTabSection con el parametro tabId
      this.showTabSection(tabId)
      // Se llama al metodo updateAriaAttributes con el parametro tabId
      this.updateAriaAttributes(tabId)
    } catch (error) { }
  }

  //Metodo que se encarga de mostrar la seccion de la pestaña que se le pase como parametro
  showTabSection(tabId) {
    // Se obtienen todas las secciones de las pestañas
    const tabSections = document.querySelectorAll(
      'asesorado-full-tab, asesoria-tab, detalles-tab'
    )
    // Se recorren todas las secciones y se les asigna el estilo display: none
    tabSections.forEach(section => {
      section.style.display = 'none'
    })
    // Se obtiene la seccion de la pestaña que se le pase como parametro
    let tabToDisplay
    tabSections.forEach(section => {
      return section.id === tabId && (tabToDisplay = section)
    })
    // Se le asigna el estilo display: block a la seccion de la pestaña que se le pase como parametro
    tabToDisplay.style.display = 'block'
    this.#activeTab = tabId
  }

  //Metodo que se encarga de verificar si se puede cambiar de pestaña
  verifyChange = tabId => {
    //Verifica si la pestaña a la que se quiere cambiar es la misma que la pestaña activa
    if (tabId === this.#activeTab) {
      return 'No se puede cambiar a la misma pestaña'
    }
    //Verifica si la pestaña a la que se quiere cambiar existe
    if (!this.#tabs.includes(tabId)) return 'La pestaña no existe'

    //Asigna a la constante asesoradoTab la seccion de la pestaña asesorado
    const asesoradoTab = document.querySelector('asesorado-full-tab')
    const asesoriaTab = document.querySelector('asesoria-tab')

    //Verifica si la pestaña a la que se quiere cambiar es la pestaña asesorado y si la seccion de la pestaña asesorado no esta completa

    if (
      tabId === this.#tabs[1] &&
      (!asesoradoTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }
    if (
      tabId === this.#tabs[2] &&
      (!asesoradoTab.isComplete || !asesoriaTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }


  }

  //Metodo que se encarga de despachar el evento de cambio de pestaña
  dispatchEventTabChangeEvent(tabId) {
    // Se llama al metodo verifyChange con el parametro tabId
    const msg = this.verifyChange(tabId)
    if (msg) throw new Error(msg)

    // Se obtiene el indice de la pestaña activa
    const indexCurrentTab = this.#tabs.indexOf(this.#activeTab)
    const indexTab = this.#tabs.indexOf(tabId)

    // Se crea un evento de cambio de pestaña
    const event = new CustomEvent('tab-change', {
      bubbles: true,
      composed: true,
      detail: { indexCurrentTab, indexTab, tabId },
    })
    // Se despacha el evento de cambio de pestaña
    this.dispatchEvent(event)
  }

  //Metodo que se encarga de actualizar los atributos aria de las pestañas
  updateAriaAttributes(activeTab) {
    const tabs = ['btn-asesorado', 'btn-asesoria', 'btn-detalles']
    tabs.forEach(tab => {
      const isSelected = tab === `btn-${activeTab}`
      this.shadowRoot
        .getElementById(tab)
        .setAttribute('aria-selected', isSelected)
    })
  }
}


customElements.define('asesoria-tabs', AsesoriaTabs)
