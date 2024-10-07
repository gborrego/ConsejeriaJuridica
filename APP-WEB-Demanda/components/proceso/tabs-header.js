
class ProcesoTabs extends HTMLElement {
  //Variables privadas de la clase
  #activeTab
  #tabs = ['registro', 'promovente', 'demandado', 'proceso', 'detalles']

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/proceso/tabs.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Aqui se obtienen los botones correspondientes a las pestañas
    this.btnRegistro = this.shadowRoot.getElementById('btn-registro')
    this.btnPromovente = this.shadowRoot.getElementById('btn-promovente')
    this.btnDemandado = this.shadowRoot.getElementById('btn-demandado')
    this.btnProceso = this.shadowRoot.getElementById('btn-proceso')
    this.btnDetalles = this.shadowRoot.getElementById('btn-detalles')

    //Se inicializa la pestaña activa
    this.#activeTab = 'registro'

    //Se añaden los eventos de click a los botones
    this.addClickEventListeners()
  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()


  }
  //Funcion que se ejecuta cuando el componente es añadido al DOM
  connectedCallback() {
    //Evento que se dispara cuando se cambia de pestaña
    document.addEventListener('next', event => {
      const tabId = event.detail.tabId
      //Manejador de evento que cambia de pestaña
      this.handleTabClick(tabId)
    })
  }

  //Funcion que añade los eventos de click a los botones
  addClickEventListeners() {
    //Evento que se dispara cuando se hace click en el boton de registro
    this.btnRegistro.addEventListener('click', () =>
      //Manejador de evento que cambia de pestaña
      this.handleTabClick('registro')
    )

    //Evento que se dispara cuando se hace click en el boton de promovente
    this.btnPromovente.addEventListener('click', () =>
      //Manejador de evento que cambia de pestaña
      this.handleTabClick('promovente')
    )
    //Evento que se dispara cuando se hace click en el boton de demandado
    this.btnDemandado.addEventListener('click', () =>
      //Manejador de evento que cambia de pestaña
      this.handleTabClick('demandado')
    )
    //Evento que se dispara cuando se hace click en el boton de proceso
    this.btnProceso.addEventListener('click', () =>
      //Manejador de evento que cambia de pestaña
      this.handleTabClick('proceso')
    )
    //Evento que se dispara cuando se hace click en el boton de detalles
    this.btnDetalles.addEventListener('click', () =>
      //Manejador de evento que cambia de pestaña
      this.handleTabClick('detalles')
    )
  }

  //Funcion que se ejecuta cuando se hace click en una pestaña
  handleTabClick(tabId) {
    try {
      //Se dispara el evento de cambio de pestaña
      this.dispatchEventTabChangeEvent(tabId)
      //Se muestra la pestaña correspondiente
      this.showTabSection(tabId)
      //Se actualizan los atributos ARIA
      this.updateAriaAttributes(tabId)
    } catch (error) { }
  }

  //Funcion que muestra la pestaña correspondiente
  showTabSection(tabId) {
    //Se obtienen todas las secciones de pestañas
    const tabSections = document.querySelectorAll(
      'registro-full-tab,promovente-full-tab,demandado-full-tab,proceso-full-tab,detalles-full-tab'
    )

    //Se ocultan todas las secciones
    tabSections.forEach(section => {
      section.style.display = 'none'
    })

    //Se muestra la seccion correspondiente a la pestaña seleccionada
    let tabToDisplay
    tabSections.forEach(section => {
      return section.id === tabId && (tabToDisplay = section)
    })
    //Se muestra la seccion correspondiente
    tabToDisplay.style.display = 'block'
    //Se actualiza la pestaña activa
    this.#activeTab = tabId
  }

  //Funcion que verifica si se puede cambiar de pestaña
  verifyChange = tabId => {
    //Si la pestaña a la que se quiere cambiar es la misma que la activa
    if (tabId === this.#activeTab) {
      return 'No se puede cambiar a la misma pestaña'
    }
    //Si la pestaña a la que se quiere cambiar no existe
    if (!this.#tabs.includes(tabId)) return 'La pestaña no existe'

    //Se obtienen las secciones de las pestañas o componentes
    const registroTab = document.querySelector('registro-full-tab')
    const promoventeTab = document.querySelector('promovente-full-tab')
    const demandadoTab = document.querySelector('demandado-full-tab')
    const procesoTab = document.querySelector('proceso-full-tab')

    //Si la pestaña a la que se quiere cambiar es la de promovente y no se han completado los datos
    if (
      tabId === this.#tabs[1] &&
      (!registroTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }

    // Si la pestaña a la que se quiere cambiar es la de demandado y no se han completado los datos
    if (
      tabId === this.#tabs[2] &&
      (!promoventeTab.isComplete || !registroTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }

    // Si la pestaña a la que se quiere cambiar es la de proceso y no se han completado los datos
    if (
      tabId === this.#tabs[3] &&
      (!promoventeTab.isComplete || !demandadoTab.isComplete || !registroTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }

    // Si la pestaña a la que se quiere cambiar es la de detalles y no se han completado los datos
    if (tabId === this.#tabs[3] || tabId === this.#tabs[2] || tabId === this.#tabs[1] || tabId === this.#tabs[0]) {
      this.btnDetalles.classList.add('hidden')
    }

    else if (tabId === this.#tabs[4]) {
      this.btnDetalles.classList.remove('hidden')
    }


    // Si la pestaña a la que se quiere cambiar es la de detalles y no se han completado los datos
    if (
      tabId === this.#tabs[4] &&
      (!procesoTab.isComplete || !promoventeTab.isComplete || !demandadoTab.isComplete || !registroTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }
  }

  //Funcion que dispara el evento de cambio de pestaña
  dispatchEventTabChangeEvent(tabId) {
    //Se verifica si se puede cambiar de pestaña
    const msg = this.verifyChange(tabId)
    //Si no se puede cambiar de pestaña se lanza un error
    if (msg) throw new Error(msg)

    //Se asignan las variables correspondientes a las pestañas
    const indexCurrentTab = this.#tabs.indexOf(this.#activeTab)
    //Se asigna el indice de la pestaña a la que se quiere cambiar
    const indexTab = this.#tabs.indexOf(tabId)

    //Se dispara el evento de cambio de pestaña
    const event = new CustomEvent('tab-change', {
      bubbles: true,
      composed: true,
      detail: { indexCurrentTab, indexTab, tabId },
    })
    //Se dispara el evento
    this.dispatchEvent(event)
  }

  //Funcion que actualiza los atributos ARIA
  updateAriaAttributes(activeTab) {
    //Se obtienen las pestañas
    const tabs = ['btn-registro', 'btn-promovente', 'btn-demandado', 'btn-proceso', 'btn-detalles']
    //Se actualizan los atributos ARIA
    tabs.forEach(tab => {
      //Se obtiene el boton de la pestaña
      const isSelected = tab === `btn-${activeTab}`
      //Se actualizan los atributos ARIA
      this.shadowRoot
        .getElementById(tab)
        .setAttribute('aria-selected', isSelected)
    })
  }
}


customElements.define('proceso-tabs', ProcesoTabs)
