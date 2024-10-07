import '../registroProceso/familiar.js'
 
export class DataPromovente extends HTMLElement {
  //Variables de la clase
  #familiares

  //Constructor de la clase
  constructor(proceso) {
    super()
    this.model=proceso.model
    this.#idPromovente = proceso.promovente.id_participante
    console.log(proceso)
    this.init2(proceso)

  }



  #idPromovente
  async cargaDatos() {
    try {
      const { familiares } = await this.model.getFamiliaresBusqueda(this.#idPromovente, false, this.#pagina)
      this.#familiares = familiares
      this.getNumeroPaginas()
      this.mostrarFamiliares()
    }
    catch (error) {
      this.#familiares = []
      const total = this.shadowRoot.getElementById('total-f')
      total.innerHTML = ''
      total.innerHTML = '' + 0
      console.error('Error al establecer el valor del atributo data:', error)
    }
  }

  #pagina = 1
  #numeroPaginas
  //Este metodo se encarga de gestionar la paginacion de las asesorias
  buttonsEventListeners = () => {
    this.getNumeroPaginas()
    //Asignación de las variables correspondientes a los botones
    const prev = this.shadowRoot.getElementById('anterior-f')
    const next = this.shadowRoot.getElementById('siguiente-f')
    //Asignación de los eventos de los botones y la llamada de los metodos correspondientes en este caso la paginacion metodos de next y prev
    prev.addEventListener('click', this.handlePrevPage)
    next.addEventListener('click', this.handleNextPage)
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion previa
  handlePrevPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina > 1) {
      //Decremento de la pagina
      this.#pagina--
      //Llamada al metodo de consultar asesorias
      this.cargaDatos()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina < this.#numeroPaginas) {
      //Incremento de la pagina
      this.#pagina++
      //Llamada al metodo de consultar asesorias
      this.cargaDatos()
    }
  }

  getNumeroPaginas = async () => {
    try {
      const { totalFamiliares } = await this.model.getFamiliaresBusqueda(this.#idPromovente, true, this.#pagina)
      const total = this.shadowRoot.getElementById('total-f')
      total.innerHTML = ''
      total.innerHTML = '' + totalFamiliares
      this.#numeroPaginas = (totalFamiliares) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de familiares, intente de nuevo mas tarde o verifique el status del servidor';
      modal.title = 'Error'
      modal.open = 'true'
    }
  }



  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/data-promovente.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2(proceso) {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    this.fillData(proceso)
  }
  connectedCallback() {
  }

  //Metodo para llenar los datos del promovente
  fillData = async (proceso) => {
    const promovente =proceso.promovente
    const familiares = proceso.familiares
     //Promovente
    this.shadowRoot.getElementById('nombre').innerHTML = promovente.nombre
    this.shadowRoot.getElementById('apellido-paterno').innerHTML = promovente.apellido_paterno
    this.shadowRoot.getElementById('apellido-materno').innerHTML = promovente.apellido_materno
    this.shadowRoot.getElementById('telefono').innerHTML = promovente.telefono
    if(promovente.promovente.español){
      this.shadowRoot.getElementById('espanol').innerHTML = "Si"
    }
    else{
      this.shadowRoot.getElementById('espanol').innerHTML = "No"
    }

    if(promovente.promovente.escolaridad){
      this.shadowRoot.getElementById('escolaridad').innerHTML = promovente.promovente.escolaridad.descripcion
    }
    else{
      this.shadowRoot.getElementById('escolaridad').innerHTML = promovente.promovente.escolaridad.estatus_general
    }

    if(promovente.promovente.etnia){
      this.shadowRoot.getElementById('etnia').innerHTML = promovente.promovente.etnia.nombre
    }
    else{
      this.shadowRoot.getElementById('etnia').innerHTML = "No"
    }

    if(promovente.promovente.ocupacion){
      this.shadowRoot.getElementById('ocupacion').innerHTML = promovente.promovente.ocupacion.descripcion_ocupacion
    }
    else{
      this.shadowRoot.getElementById('ocupacion').innerHTML = "Ninguna"
    }
  
    //Familiar
    this.shadowRoot.getElementById('familiares').value = familiares.map((familiar, index) => `${familiar.id_familiar}. Nombre: ${familiar.nombre} , Nacionalidad: ${familiar.nacionalidad}
    , Parentesco: ${familiar.parentesco} , Pertenece a la comunidad LGBT: ${familiar.perteneceComunidadLGBT===true?'Si':'No'} , Adulto Mayor: ${familiar.adultaMayor===true? 'Si': 'No'} , Salud Precaria: ${familiar.saludPrecaria===true?'Si': 'No'} , Pobreza Extrema: ${familiar.pobrezaExtrema ===true?'Si': 'No'}`).join('\n')
    this.buttonsEventListeners()
  
  }

  mostrarFamiliares =async () => {
    this.shadowRoot.getElementById('familiares').value = ''
    this.shadowRoot.getElementById('familiares').value =  this.#familiares.map((familiar, index) => `${familiar.id_familiar}. Nombre: ${familiar.nombre} , Nacionalidad: ${familiar.nacionalidad}
    , Parentesco: ${familiar.parentesco} , Pertenece a la comunidad LGBT: ${familiar.perteneceComunidadLGBT===true?'Si':'No'} , Adulto Mayor: ${familiar.adultaMayor===true? 'Si': 'No'} , Salud Precaria: ${familiar.saludPrecaria===true?'Si': 'No'} , Pobreza Extrema: ${familiar.pobrezaExtrema ===true?'Si': 'No'}`).join('\n')
  }
}

customElements.define('data-promovente', DataPromovente)