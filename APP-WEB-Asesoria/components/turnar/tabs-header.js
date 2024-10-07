 

class TurnarTabs extends HTMLElement {
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
       //Botones de los tabs
       this.btnAsesorado = this.shadowRoot.getElementById('btn-asesorado')
       this.btnDomicilio = this.shadowRoot.getElementById('btn-domicilio')
       this.btnTurno = this.shadowRoot.getElementById('btn-turno')
      await this.campos()
       //Se añaden los eventos de cl ick
       this.addClickEventListeners()
  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/turnar/tabs.html')).text();
    template.innerHTML = html;
    return template;
  }
  //Constructor de la clase
  constructor() {
    super()
    this.init2()
 
  }

  //MEtodo encargado de dar de alta el evento de cambio de tab
 async campos() {
    document.addEventListener('next', event => {
      const tabId = event.detail.tabId
      this.handleTabClick(tabId)
    })
  }

  //Metodo encargado de añadir los eventos de click a los botones
  addClickEventListeners() {
    //Se añaden los eventos de click a los botones
    this.btnAsesorado.addEventListener('click', () =>
      this.handleTabClick('asesorado')
    )
    this.btnDomicilio.addEventListener('click', () =>
      this.handleTabClick('domicilio')
    )
    this.btnTurno.addEventListener('click', () => this.handleTabClick('turno'))
  }

  //Metodo encargado de manejar el click en los tabs
  handleTabClick(tabId) {
    this.showTabSection(tabId)
    this.dispatchEventTabChangeEvent(tabId)
    this.updateAriaAttributes(tabId)
  }

  //Metodo encargado de mostrar la sección del tab seleccionado
  showTabSection(tabId) {
   // this.#activeTab = tabId
    const tabSections = document.querySelectorAll(
      'asesorado-tab, domicilio-tab, turno-tab'
    )
    //Se ocultan todas las secciones
    tabSections.forEach(section => {
      section.style.display = 'none'
    })

    let tabToDisplay
    //Se busca la sección a mostrar y se le cambia el display
    tabSections.forEach(section => {
      return section.id === tabId && (tabToDisplay = section)
    })
    tabToDisplay.style.display = 'block'
  }


  //Metodo encargado de despachar el evento de cambio de tab
  dispatchEventTabChangeEvent(tabId) {
    const event = new CustomEvent('tab-change', {
      bubbles: true,
      composed: true,
      detail: { tabId },
    })
    this.dispatchEvent(event)
  }

  //Metodo encargado de actualizar los atributos aria
  updateAriaAttributes(activeTab) {
    const tabs = ['btn-asesorado', 'btn-domicilio', 'btn-turno']
    tabs.forEach(tab => {
      const isSelected = tab === `btn-${activeTab}`
      this.shadowRoot
        .getElementById(tab)
        .setAttribute('aria-selected', isSelected)
    })
  }
}

 
customElements.define('turnar-tabs', TurnarTabs)
