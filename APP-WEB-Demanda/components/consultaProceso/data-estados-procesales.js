
export class DataEstadosProcesales extends HTMLElement {

  //Constructor de la clase
  constructor(procesoRecibido) {
    super()
    this.model = procesoRecibido.model
    this.init2(procesoRecibido)
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/data-estados-procesales.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2(procesoRecibido) {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    this.#estadosProcesales = procesoRecibido.estadosProcesales
    this.#idProcesoJudicial = procesoRecibido.id_proceso_judicial
    this.buttonsEventListeners()
    this.fillData(procesoRecibido.estadosProcesales)
  }

  #estadosProcesales
  connectedCallback() {
  }
  #idProcesoJudicial
  async cargaDatos() {
    try {
      const { estadosProcesales } = await this.model.getEstadosBusqueda(this.#idProcesoJudicial, false, this.#pagina)
      this.#estadosProcesales = estadosProcesales
      this.getNumeroPaginas()
      this.mostrarEstadosProcesales()
    }
    catch (error) {
      this.#estadosProcesales = []
      const total = this.shadowRoot.getElementById('total')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + 0
      console.error('Error al establecer el valor del atributo data:', error)
    }
  }
  #pagina = 1
  #numeroPaginas
  //Este metodo se encarga de gestionar la paginacion de las asesorias
  buttonsEventListeners = () => {
    //Asignación de las variables correspondientes a los botones
    const prev = this.shadowRoot.getElementById('anterior-e')
    const next = this.shadowRoot.getElementById('siguiente-e')
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
      const { totalEstadosProcesales } = await this.model.getEstadosBusqueda(this.#idProcesoJudicial, true, this.#pagina)
      const total = this.shadowRoot.getElementById('total-e')
      total.innerHTML = ''
      total.innerHTML = '' + totalEstadosProcesales
      this.#numeroPaginas = (totalEstadosProcesales) / 10
    } catch (error) {
      console.error('Error ', error.message)
      console.log('Error ', error.message)  
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });
      modal.message = 'Error al obtener el total de estados procesales, intente de nuevo mas tarde o verifique el status del servidor';
      modal.title = 'Error'
      modal.open = 'true'
    }
  }

  mostrarEstadosProcesales = async () => {
    this.shadowRoot.getElementById('estados-procesales').value = ''
    this.shadowRoot.getElementById('estados-procesales').value = this.#estadosProcesales.map((estado, index) =>
      `${estado.id_estado_procesal}. Estado Procesal: ${estado.descripcion_estado_procesal} , Fecha: ${estado.fecha_estado_procesal}`).join('\n');
  }


  // Metodo para llenar los datos de los estados procesales
  fillData = async (estados_procesales) => {
    this.shadowRoot.getElementById('estados-procesales').value = estados_procesales.map((estado, index) =>
      `${estado.id_estado_procesal}. Estado Procesal: ${estado.descripcion_estado_procesal} , Fecha: ${estado.fecha_estado_procesal}`
    ).join('\n');
    this.getNumeroPaginas()
  }
}

customElements.define('data-estados-procesales', DataEstadosProcesales)