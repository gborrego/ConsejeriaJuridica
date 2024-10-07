 
export class DataAsesoria extends HTMLElement {

  //Contructor de la clase
  constructor(asesoria) {
     super()
     this.asesoria = asesoria
    this.init2(asesoria)

  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/data-asesoria.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2(asesoria) {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    this.fillData(this.asesoria)

  }
 
  connectedCallback() {
  }

  //Metodo para llenar los datos de la asesoria
  fillData = async (asesoria) => {
    const datosAsesoria = asesoria.asesoria.datos_asesoria
    const recibidos = asesoria.asesoria.recibidos

    
    if (asesoria.asesoria.empleado) {
      const empleado =asesoria.asesoria.empleado
      if (empleado.hasOwnProperty('nombre_asesor')) {
        this.shadowRoot.getElementById('nombre-asesor-defensor').textContent = "Nombre del asesor:"
        this.shadowRoot.getElementById('nombre-asesor').textContent = empleado.nombre_asesor;

      } else {
        this.shadowRoot.getElementById('nombre-asesor-defensor').textContent = "Nombre del defensor:"
        this.shadowRoot.getElementById('nombre-asesor').textContent = empleado.nombre_defensor;
      }
    } else {
      if (asesoria.asesoria.asesor) {
        this.shadowRoot.getElementById('nombre-asesor-defensor').textContent = "Nombre del asesor:"
        this.shadowRoot.getElementById('nombre-asesor').textContent = asesoria.asesoria.asesor.nombre_asesor;
      } else {
        this.shadowRoot.getElementById('nombre-asesor-defensor').textContent = "Nombre del defensor:"
        this.shadowRoot.getElementById('nombre-asesor').textContent = asesoria.asesoria.defensor.nombre_defensor;
      }
    }

    this.shadowRoot.getElementById('tipo-juicio').textContent = asesoria.asesoria.tipos_juicio.tipo_juicio

    this.shadowRoot.getElementById('resumen').textContent = datosAsesoria.resumen_asesoria
    this.shadowRoot.getElementById('conclusion').textContent = datosAsesoria.conclusion_asesoria
    recibidos.forEach(item => {
      const element = document.createElement('p')
      element.textContent = item.descripcion_catalogo
      this.shadowRoot.getElementById('asesorado-recibio').appendChild(element)
    })

    if (datosAsesoria.estatus_requisitos) this.shadowRoot.getElementById('cumple-requisitos').textContent = 'Si'
    else this.shadowRoot.getElementById('cumple-requisitos').textContent = 'No'
  }
}

customElements.define('data-asesoria', DataAsesoria)