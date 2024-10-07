 
export class DataDemandado extends HTMLElement {
  //Constructor de la clase
  constructor(demandado) {
    super()
    this.demandado = demandado
    this.init2(demandado)
  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/data-demandado.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2(demandado) {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    this.fillData(demandado)
  }
  connectedCallback() {
  }
 
  //Metodo para llenar los datos del demandado
  fillData = async (demandado) => {
     
    //demandado
    this.shadowRoot.getElementById('nombre-demandado').textContent = demandado.nombre
    this.shadowRoot.getElementById('apellido-paterno-demandado').textContent = demandado.apellido_paterno
    this.shadowRoot.getElementById('apellido-materno-demandado').textContent = demandado.apellido_materno
    this.shadowRoot.getElementById('telefono').textContent = demandado.telefono
    this.shadowRoot.getElementById('edad').textContent = demandado.edad
    this.shadowRoot.getElementById('calle-domicilio').textContent = demandado.domicilio.calle_domicilio
    this.shadowRoot.getElementById('numero-domicilio').textContent = demandado.domicilio.numero_exterior_domicilio 
}
}

customElements.define('data-demandado', DataDemandado)