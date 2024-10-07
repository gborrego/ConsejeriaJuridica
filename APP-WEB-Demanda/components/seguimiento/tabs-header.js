 
class ProcesoTabs extends HTMLElement {
  //Variables privadas
  #activeTab
  #tabs = ['registro', 'promovente', 'demandado', 'proceso', 'detalles']
  #procesoActual

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/seguimiento/tabs.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
      //Obtencion de los botones en este caso el de las pestañas

      this.btnRegistro = this.shadowRoot.getElementById('btn-registro')
      this.btnPromovente = this.shadowRoot.getElementById('btn-promovente')
      this.btnDemandado = this.shadowRoot.getElementById('btn-demandado')
      this.btnProceso = this.shadowRoot.getElementById('btn-proceso')
      this.btnDetalles = this.shadowRoot.getElementById('btn-detalles')
    
      //Establece la pestaña activa
      this.#activeTab = 'registro'
  
      this.addClickEventListeners()
  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()
  
  }
   
  //Metodo que se ejecuta cuando el componente es agregado al DOM
  connectedCallback() {
    //Manejador de cambio de pestaña
    document.addEventListener('next', event => {
      const tabId = event.detail.tabId
      //Llama al metodo que maneja el cambio de pestaña
      this.handleTabClick(tabId)
    })
  }

  //Se agrega un evento de click a cada boton de pestaña
  addClickEventListeners() {
    //Se añade un evento de click a cada boton de pestaña en este caso el de registro
    this.btnRegistro.addEventListener('click', () =>
      this.handleTabClick('registro')
    )

    //Se añade un evento de click a cada boton de pestaña en este caso el de promovente
    this.btnPromovente.addEventListener('click', () =>
      this.handleTabClick('promovente')
    )

    //Se añade un evento de click a cada boton de pestaña en este caso el de demandado
    this.btnDemandado.addEventListener('click', () =>
      this.handleTabClick('demandado')
    )

    //Se añade un evento de click a cada boton de pestaña en este caso el de proceso
    this.btnProceso.addEventListener('click', () =>
      this.handleTabClick('proceso')
    )

    //Se añade un evento de click a cada boton de pestaña en este caso el de detalles
    this.btnDetalles.addEventListener('click', () =>
      this.handleTabClick('detalles')
    )
  }

  //Metodo que maneja el cambio de pestaña
  handleTabClick(tabId) {
    try {
      //Llama al metodo que verifica si se puede cambiar de pestaña
      this.dispatchEventTabChangeEvent(tabId)
      //Llama al metodo que muestra la pestaña
      this.showTabSection(tabId)
      //Llama al metodo que actualiza los atributos ARIA
      this.updateAriaAttributes(tabId)
    } catch (error) { }
  }

  //Metodo que muestra la pestaña
  showTabSection(tabId) {
    //Obtiene todas las secciones de pestañas
    const tabSections = document.querySelectorAll(
      'registro-full-tab,promovente-full-tab,demandado-full-tab,proceso-full-tab,detalles-full-tab'
    )

    //Oculta todas las secciones
    tabSections.forEach(section => {
      section.style.display = 'none'
    })

    //Muestra la seccion de la pestaña seleccionada
    let tabToDisplay
    tabSections.forEach(section => {
      return section.id === tabId && (tabToDisplay = section)
    })
    tabToDisplay.style.display = 'block'
    this.#activeTab = tabId
  }
  
  //Metodo que verifica si se puede cambiar de pestaña
  verifyChange = tabId => {
    //Si la pestaña seleccionada es la misma que la activa
    if (tabId === this.#activeTab) {
      return 'No se puede cambiar a la misma pestaña'
    }

    //Si la pestaña seleccionada no existe
    if (!this.#tabs.includes(tabId)) return 'La pestaña no existe'

    //Obtencion de los componentes 
    const registroTab = document.querySelector('registro-full-tab')
    const promoventeTab = document.querySelector('promovente-full-tab')
    const demandadoTab = document.querySelector('demandado-full-tab')
    const procesoTab = document.querySelector('proceso-full-tab')
    const detallesTab = document.querySelector('detalles-full-tab')

    //Si la pestaña seleccionada es la de promovente y no se han completado los datos
    if (
      tabId === this.#tabs[1] &&
      (!registroTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }

    //Si la pestaña seleccionada es la de demandado y no se han completado los datos
    if (
      tabId === this.#tabs[2] &&
      (!registroTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }

    //Si la pestaña seleccionada es la de proceso y no se han completado los datos
    if (
      tabId === this.#tabs[3] &&
      (!registroTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }

    //Si la pestaña seleccionada es la de detalles y no se han completado los datos
    if (tabId === this.#tabs[3] || tabId === this.#tabs[2] || tabId === this.#tabs[1] || tabId === this.#tabs[0]) {
      this.btnDetalles.classList.add('hidden')
    }

    else if (tabId === this.#tabs[4]) {
      this.btnDetalles.classList.remove('hidden')
    }



    //Si la pestaña seleccionada es la de detalles y no se han completado los datos
    if (
      tabId === this.#tabs[4] &&
      (!registroTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }
  }

  //Metodo que dispara el evento de cambio de pestaña
  dispatchEventTabChangeEvent(tabId) {
    //Obtiene el mensaje
    const msg = this.verifyChange(tabId)
    //Si hay un mensaje de error
    if (msg) throw new Error(msg)

      //Dispara el evento de cambio de pestaña
    const indexCurrentTab = this.#tabs.indexOf(this.#activeTab)
    const indexTab = this.#tabs.indexOf(tabId)

    //Crea un evento personalizado
    const event = new CustomEvent('tab-change', {
      bubbles: true,
      composed: true,
      detail: { indexCurrentTab, indexTab, tabId },
    })

    //Dispara el evento
    this.dispatchEvent(event)
  }

  //Metodo que actualiza los atributos ARIA
  updateAriaAttributes(activeTab) {
    const tabs = ['btn-registro', 'btn-promovente', 'btn-demandado', 'btn-proceso', 'btn-detalles']
    tabs.forEach(tab => {
      const isSelected = tab === `btn-${activeTab}`
      this.shadowRoot
        .getElementById(tab)
        .setAttribute('aria-selected', isSelected)
    })
  }
}
 
customElements.define('proceso-tabs', ProcesoTabs)
