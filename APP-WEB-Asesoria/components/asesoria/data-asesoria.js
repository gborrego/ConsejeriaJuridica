

export class DataAsesoria extends HTMLElement {
   
  // Se crea el constructor de la clase
  constructor(asesoria, domicilio) {
    super()
    this.asesoria = asesoria
    this.domicilio = domicilio
    this.init(asesoria, domicilio)
    //Se inicializan las variables que representan los datos de la asesoria y el domicilio
  
    //Se llama a la función fillData para llenar los datos de la asesoria
  }
  //Se crea la función init para inicializar el shadowRoot
  async init(asesoria, domicilio) {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    await this.fillData(asesoria, domicilio);
  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/data-asesoria.html')).text();
    template.innerHTML = html;
    return template;
  }

  //Función fillData para llenar los datos de la asesoria
  fillData = async (asesoria, domicilio) => {
    //Se obtienen los datos de la asesoria y el domicilio
    const persona = asesoria.asesoria.persona
    const asesorado = asesoria.asesoria.asesorado
    const datosAsesoria = asesoria.asesoria.datos_asesoria
    const recibidos = asesoria.asesoria.recibidos
    const domicilioData = domicilio.domicilio.colonia
     
        //Se llenan los datos de la asesoria en este caso el nombre
    this.shadowRoot.getElementById(
      'nombre-asesorado'
    ).textContent = `${persona.nombre} ${persona.apellido_paterno} ${persona.apellido_materno}`
    //Se llena el campo de edad
    this.shadowRoot.getElementById('edad').textContent = persona.edad
    //Se llena el campo de sexo
    this.shadowRoot.getElementById('sexo').textContent = persona.genero.descripcion_genero
    //Se llena el campo de telefono
    this.shadowRoot.getElementById('telefono').textContent = persona.telefono
    //Se llena el campo de trabajo y se valida si trabaja o no trabaja para mostrarlo
    if (this.asesoria.asesoria.asesorado.estatus_trabajo) this.shadowRoot.getElementById('trabaja-boolean').textContent = 'Si'
    else this.shadowRoot.getElementById('trabaja-boolean').textContent = 'No'
    //Se llena el campo de estado civil y el numero de hijos
    this.shadowRoot.getElementById('estado-civil').textContent =
      asesorado.estado_civil.estado_civil
    this.shadowRoot.getElementById('numero-hijos').textContent =
      asesorado.numero_hijos

    //Se llena el campo de domicilio calle, numero exterior, numero interior, codigo postal, estado, municipio, ciudad y colonia
    this.shadowRoot.getElementById('calle').textContent = persona.domicilio.calle_domicilio
    this.shadowRoot.getElementById('numero-exterior').textContent = persona.domicilio.numero_exterior_domicilio
    this.shadowRoot.getElementById('numero-interior').textContent = persona.domicilio.numero_interior_domicilio
    if( domicilioData  ){
      this.shadowRoot.getElementById('codigo-postal').textContent =  domicilioData.codigo_postal.codigo_postal
      this.shadowRoot.getElementById('estado').textContent = domicilioData.estado.nombre_estado
      this.shadowRoot.getElementById('municipio').textContent = domicilioData.municipio.nombre_municipio
      this.shadowRoot.getElementById('ciudad').textContent = domicilioData.ciudad.nombre_ciudad
      this.shadowRoot.getElementById('colonia').textContent = domicilioData.colonia.nombre_colonia
    }
  
    //Se llena el campo de nombre del asesor o defensor, dependiendo de si es asesor o defensor
    if (this.asesoria.asesoria.empleado) {
      const empleado = this.asesoria.asesoria.empleado
      if (empleado.hasOwnProperty('nombre_asesor')) {
        this.shadowRoot.getElementById('nombre-asesor-defensor').textContent = "Nombre del asesor:"
        this.shadowRoot.getElementById('nombre-asesor').textContent = empleado.nombre_asesor;

      } else {
        this.shadowRoot.getElementById('nombre-asesor-defensor').textContent = "Nombre del defensor:"
        this.shadowRoot.getElementById('nombre-asesor').textContent = empleado.nombre_defensor;
      }
    } else {
      if (this.asesoria.asesoria.asesor) {
        this.shadowRoot.getElementById('nombre-asesor-defensor').textContent = "Nombre del asesor:"
        this.shadowRoot.getElementById('nombre-asesor').textContent = this.asesoria.asesoria.asesor.nombre_asesor;
      } else {
        this.shadowRoot.getElementById('nombre-asesor-defensor').textContent = "Nombre del defensor:"
        this.shadowRoot.getElementById('nombre-asesor').textContent = this.asesoria.asesoria.defensor.nombre_defensor;
      }
    }
    //Se llena el campo de tipo de juicio con el tipo de juicio
    this.shadowRoot.getElementById('tipo-juicio').textContent = this.asesoria.asesoria.tipos_juicio.tipo_juicio
     //Se llena el resumen  de la asesoria
    this.shadowRoot.getElementById('resumen').textContent = datosAsesoria.resumen_asesoria
    //Se llena la conclusión de la asesoria
    this.shadowRoot.getElementById('conclusion').textContent = datosAsesoria.conclusion_asesoria
    //Se llena el campo de documentos recibidos con los documentos recibidos
    recibidos.forEach(item => {
      const element = document.createElement('p')
      element.textContent = item.descripcion_catalogo
      this.shadowRoot.getElementById('asesorado-recibio').appendChild(element)
    })
     //se llena el campo de cumple requisitos  y se valida si cumple o no
    if (datosAsesoria.estatus_requisitos) this.shadowRoot.getElementById('cumple-requisitos').textContent = 'Si'
    else this.shadowRoot.getElementById('cumple-requisitos').textContent = 'No'
  }
}

customElements.define('data-asesoria', DataAsesoria)