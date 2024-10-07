
export class DataPrueba extends HTMLElement {


  //Constructor de la clase
  constructor(procesoRecibido) {
    super()
    this.model = procesoRecibido.model
    this.#pruebas = procesoRecibido.pruebas 
    this.#resoluciones = procesoRecibido.resoluciones
    this.#idProcesoJudicial = procesoRecibido.id_proceso_judicial
    this.#observaciones = procesoRecibido.observaciones
    this.init2(procesoRecibido)
  }
  #resoluciones
  async cargaDatosResoluciones() {
    try {
      const { resoluciones } = await this.model.getResolucionesBusqueda(this.#idProcesoJudicial, false, this.#paginaResoluciones)
      this.#resoluciones = resoluciones
      this.getNumeroPaginasResoluciones()
      this.mostrarResoluciones()
    }
    catch (error) {
      console.error(error.message)
      this.#resoluciones = []
      const total = this.shadowRoot.getElementById('total-r')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + 0
      console.error('Error al establecer el valor del atributo data:', error)
    }
  }

  #paginaResoluciones = 1
  #numeroPaginasResoluciones
  //Este metodo se encarga de gestionar la paginacion de las asesorias
  buttonsEventListenersResoluciones = () => {
    this.getNumeroPaginasResoluciones()
    //Asignación de las variables correspondientes a los botones
    const prev = this.shadowRoot.getElementById('anterior-r')
    const next = this.shadowRoot.getElementById('siguiente-r')
    //Asignación de los eventos de los botones y la llamada de los metodos correspondientes en este caso la paginacion metodos de next y prev
    prev.addEventListener('click', this.handlePrevPageResoluciones)
    next.addEventListener('click', this.handleNextPageResoluciones)
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion previa
  handlePrevPageResoluciones = async () => {
    //Validación de la pagina actual
    if (this.#paginaResoluciones > 1) {
      //Decremento de la pagina
      this.#paginaResoluciones--
      //Llamada al metodo de consultar asesorias
      this.cargaDatosResoluciones()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPageResoluciones = async () => {
    //Validación de la pagina actual
    if (this.#paginaResoluciones < this.#numeroPaginasResoluciones) {
      //Incremento de la pagina
      this.#paginaResoluciones++
      //Llamada al metodo de consultar asesorias
      this.cargaDatosResoluciones()
    }
  }

  getNumeroPaginasResoluciones = async () => {
    try {
      const { totalResoluciones } = await this.model.getResolucionesBusqueda(this.#idProcesoJudicial, true, this.#paginaResoluciones)
      const total = this.shadowRoot.getElementById('total-r')
      total.innerHTML = ''
      total.innerHTML = '' + totalResoluciones
      this.#numeroPaginasResoluciones = (totalResoluciones) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de resoluciones, intente de nuevo mas tarde o verifique el status del servidor';
      modal.title = 'Error'
      modal.open = 'true'
    }
  }


  #pruebas
  async cargaDatosPruebas() {
    try {
      const { pruebas } = await this.model.getPruebasBusqueda(this.#idProcesoJudicial, false, this.#paginaPruebas)
      this.#pruebas = pruebas
      this.getNumeroPaginasPruebas()
      this.mostrarPruebas()
    }
    catch (error) {
      this.#pruebas = []
      const total = this.shadowRoot.getElementById('total-p')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + 0
      console.error('Error al establecer el valor del atributo data:', error)
    }
  }

  #paginaPruebas = 1
  #numeroPaginasPruebas
  //Este metodo se encarga de gestionar la paginacion de las asesorias
  buttonsEventListenersPruebas = () => {
    this.getNumeroPaginasPruebas()
    //Asignación de las variables correspondientes a los botones
    const prev = this.shadowRoot.getElementById('anterior-p')
    const next = this.shadowRoot.getElementById('siguiente-p')
    //Asignación de los eventos de los botones y la llamada de los metodos correspondientes en este caso la paginacion metodos de next y prev
    prev.addEventListener('click', this.handlePrevPagePruebas)
    next.addEventListener('click', this.handleNextPagePruebas)
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion previa
  handlePrevPagePruebas = async () => {
    //Validación de la pagina actual
    if (this.#paginaPruebas > 1) {
      //Decremento de la pagina
      this.#paginaPruebas--
      //Llamada al metodo de consultar asesorias
      this.cargaDatosPruebas()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPagePruebas = async () => {
    //Validación de la pagina actual
    if (this.#paginaPruebas < this.#numeroPaginasPruebas) {
      //Incremento de la pagina
      this.#paginaPruebas++
      //Llamada al metodo de consultar asesorias
      this.cargaDatosPruebas()
    }
  }

  getNumeroPaginasPruebas = async () => {
    try {
      const { totalPruebas } = await this.model.getPruebasBusqueda(this.#idProcesoJudicial, true, this.#paginaPruebas)
      const total = this.shadowRoot.getElementById('total-p')
      total.innerHTML = ''
      total.innerHTML = '' + totalPruebas
      this.#numeroPaginasPruebas = (totalPruebas) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de pruebas, intente de nuevo mas tarde o verifique el status del servidor';
      modal.title = 'Error'
      modal.open = 'true'
    }
  }






  #observaciones

  #idProcesoJudicial
  async cargaDatosObservaciones() {
    try {
      const { observaciones } = await this.model.getObservacionesBusqueda(this.#idProcesoJudicial, false, this.#paginaObservaciones)
      this.#observaciones = observaciones
      this.getNumeroPaginasObservaciones()
      this.mostrarObservaciones()
    }
    catch (error) {
      this.#observaciones = []
      const total = this.shadowRoot.getElementById('total-o')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + 0
      console.error('Error al establecer el valor del atributo data:', error)
    }
  }

  #paginaObservaciones = 1
  #numeroPaginasObservaciones
  //Este metodo se encarga de gestionar la paginacion de las asesorias
  buttonsEventListenersObservaciones = () => {
    //Asignación de las variables correspondientes a los botones
    const prev = this.shadowRoot.getElementById('anterior-o')
    const next = this.shadowRoot.getElementById('siguiente-o')
    //Asignación de los eventos de los botones y la llamada de los metodos correspondientes en este caso la paginacion metodos de next y prev
    prev.addEventListener('click', this.handlePrevPageObservaciones)
    next.addEventListener('click', this.handleNextPageObservaciones)
    this.getNumeroPaginasObservaciones()
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion previa
  handlePrevPageObservaciones = async () => {
    //Validación de la pagina actual
    if (this.#paginaObservaciones > 1) {
      //Decremento de la pagina
      this.#paginaObservaciones--
      //Llamada al metodo de consultar asesorias
      this.cargaDatosObservaciones()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPageObservaciones = async () => {
    //Validación de la pagina actual
    if (this.#paginaObservaciones < this.#numeroPaginasObservaciones) {
      //Incremento de la pagina
      this.#paginaObservaciones++
      //Llamada al metodo de consultar asesorias
      this.cargaDatosObservaciones()
    }
  }

  getNumeroPaginasObservaciones = async () => {
    try {
      const { totalObservaciones } = await this.model.getObservacionesBusqueda(this.#idProcesoJudicial, true, this.#paginaObservaciones)
      const total = this.shadowRoot.getElementById('total-o')
      total.innerHTML = ''
      total.innerHTML = '' + totalObservaciones
      this.#numeroPaginasObservaciones = (totalObservaciones) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de observaciones, intente de nuevo mas tarde o verifique el status del servidor';
      modal.title = 'Error'
      modal.open = 'true'
    }
  }


  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/data-prueba.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2(procesoRecibido) {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    this.fillData(procesoRecibido)
  }
  connectedCallback() {
  }
  mostrarPruebas = async () => {
    this.shadowRoot.getElementById('pruebas').value = ""
    this.shadowRoot.getElementById('pruebas').value = this.#pruebas.map((prueba, index) => `${index + 1}. Prueba: ${prueba.descripcion_prueba}`).join('\n');
  }
  mostrarResoluciones = async () => {
    this.shadowRoot.getElementById('resoluciones').value = ""
    this.shadowRoot.getElementById('resoluciones').value = this.#resoluciones.map((resolucion, index) => `${index + 1}. Resolucion: ${resolucion.resolucion}\nFecha: ${resolucion.fecha_resolucion}`).join('\n');
  }
  mostrarObservaciones = async () => {
    this.shadowRoot.getElementById('observaciones').value =""
    this.shadowRoot.getElementById('observaciones').value = this.#observaciones.map((observacion, index) => `${index + 1}. Observacion: ${observacion.observacion}`).join('\n');
  }
  //Metodo para llenar los datos de las pruebas
  fillData = async (procesoRecibido) => {
    this.shadowRoot.getElementById('pruebas').value = procesoRecibido.pruebas.map((prueba, index) => `${index + 1}. Prueba: ${prueba.descripcion_prueba}`).join('\n');
    this.shadowRoot.getElementById('resoluciones').value = procesoRecibido.resoluciones.map((resolucion, index) => `${index + 1}. Resolucion: ${resolucion.resolucion}\nFecha: ${resolucion.fecha_resolucion}`).join('\n');
    this.shadowRoot.getElementById('observaciones').value = procesoRecibido.observaciones.map((observacion, index) => `${index + 1}. Observacion: ${observacion.observacion}`).join('\n');
    this.buttonsEventListenersObservaciones()
    this.buttonsEventListenersPruebas()
    this.buttonsEventListenersResoluciones()
  }
}

customElements.define('data-prueba', DataPrueba)