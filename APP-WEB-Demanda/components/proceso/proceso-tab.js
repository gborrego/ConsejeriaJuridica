import { ValidationError } from '../../lib/errors.js'
import { validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model.js'
import '../registroProceso/estado-procesal.js'
import '../registroProceso/familiar.js'
import '../registroProceso/observacion.js'
import '../registroProceso/prueba.js'
import '../registroProceso/familiar.js'
import '../registroProceso/resolucion.js'

export class ProcesoTab extends HTMLElement {
  #estadosProcesales
  #familiares
  #observaciones
  #pruebas
  #resoluciones
  #api


  #fechaInicio
  #estatusProceso

  #juzgado
  #juzgados

  #numeroExpediente
  #controlInterno

  #municipio
  #municipios

  #distritoJudicial
  #distritosJudiciales

  #tipoJuicio
  #tiposDeJuicio




  #idDistritoJudicial
  #idMunicipio
  #idTipoJuicio
  #id_defensor

  #pruebasWC
  #familiaresWC
  #observacionesWC
  #resolucionesWC
  #estadosProcesalesWC
  #turnoSeleccionado = null

  //Metodo get para obtener el valor del atributo id
  get id() {
    return this.getAttribute('id')
  }

  //Metodo set para asignar un valor al atributo id
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo para validar si el componente esta completo
  get isComplete() {
    return this.validateInputs()
  }
  //Metodo para obtener los datos del proceso
  get data() {
    const proceso = {
      fecha_inicio: this.#fechaInicio.value,
      fecha_estatus: null,
      estatus_proceso: this.#estatusProceso.value,
      id_juzgado: this.#juzgado.value,
      juzgado: this.#juzgado.options[this.#juzgado.selectedIndex].text,
      numero_expediente: this.#numeroExpediente.value,
      control_interno: this.#controlInterno.value,
      id_defensor: this.#id_defensor,
      defensor: this.registroTab.data.turno.defensor.nombre_defensor,
      id_distrito_judicial: this.#distritoJudicial.value,
      id_municipio_distrito: this.#municipio.value,
      id_tipo_juicio: this.#tipoJuicio.value,
      tipo_juicio: this.#tipoJuicio.options[this.#tipoJuicio.selectedIndex].text,
      municipio: this.#municipio.options[this.#municipio.selectedIndex].text,
      distrito_judicial: this.#distritoJudicial.options[this.#distritoJudicial.selectedIndex].text,
      pruebas: this.#pruebasWC.data.pruebas,
      familiares: this.#familiaresWC.data.familiares,
      observaciones: this.#observacionesWC.data.observaciones,
      resoluciones: this.#resolucionesWC.data.resoluciones,
      estadosProcesales: this.#estadosProcesalesWC.data.estadosProcesales,

    }
    return { proceso: proceso }

  }

  //Metodo para asignar los datos del proceso
  set data(value) {
    this.setAttribute('data', value)
  }

  //Metodo para obtener los valores de los atributos id y data
  static get observedAttributes() {
    return ['id', 'data']
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/proceso/proceso-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Obtenemos los componentes 
    this.registroTab = document.querySelector('registro-full-tab')
    this.promoventeTab = document.querySelector('promovente-full-tab')
    this.demandadoTab = document.querySelector('demandado-full-tab')
    await this.campos()

  }
  //Constructor de la clase
  constructor() {
    super()
    //ID del componente este nos ayuda con el manejo de los tabs
    this.id = 'proceso'
    this.style.display = 'none'
    this.init2()

  }

  //Metodo para inicializar variables, obtener datos de la API y llenar los campos del formulario
  async init() {
    //Obtenemos los datos de la API
    this.#api = new APIModel()
    //Llamamos al metodo para la obtencion de los datos
    await this.obtencionDatos()

    //Llamamos al metodo para la gestion de los campos del formulario
    this.manageFormFields()
    //Llamamos al metodo para llenar los campos del formulario
    this.fillInputs()

  }

  //Metodo para la obtencion de los datos y asignacion de los mismos a las variables correspondientes
  async obtencionDatos() {
    //Obtenemos los datos de los juzgados
    try{
    const juzgados = await this.#api.getJuzgados2()
    this.#juzgados = juzgados
    }catch(error){
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      });
      modal.message = 'Error al cargar los datos de juzgados, por favor intenta de nuevo habilitarlos o ingresar nuevos datos.'
      modal.title = 'Error'
      modal.open = true
    }  

    //Obtenemos los datos de los distritos judiciales
    const distritosJudiciales = await this.#api.getDistritos()
    this.#distritosJudiciales = distritosJudiciales

    //Obtenemos los datos del turno seleccionado y los asignamos a las variables correspondientes


    const id_distrito_judicial = this.registroTab.data.turno.asesoria.distrito_judicial.id_distrito_judicial
    const id_municipio = this.registroTab.data.turno.asesoria.municipio.id_municipio_distrito
    this.#idDistritoJudicial = id_distrito_judicial
    this.#idMunicipio = id_municipio
    this.#idTipoJuicio = this.registroTab.data.turno.asesoria.tipos_juicio.id_tipo_juicio
    this.#id_defensor = this.registroTab.data.turno.defensor.id_defensor

    //Obtenemos los datos de los tipos de juicio
    const { tiposDeJuicio } = await this.#api.getTiposJuicio2()
    this.#tiposDeJuicio = tiposDeJuicio

    //Obtenemos los datos de los municipios
    const municipios = await this.#api.getMunicipiosByDistrito(id_distrito_judicial)
    this.#municipios = municipios

  }

  #botonEstadoProcesal
  #botonFamiliar
  #botonObservacion
  #botonPrueba
  #botonResolucion

  #componenteEstadoProcesal
  #componenteFamiliar
  #componenteObservacion
  #componentePrueba
  #componenteResolucion


  manejadorComponentes(componente) {
    switch (componente) {
      case 'estado-procesal':
        this.#componenteEstadoProcesal.classList.remove('hidden')
        this.#componenteFamiliar.classList.add('hidden')
        this.#componenteObservacion.classList.add('hidden')
        this.#componentePrueba.classList.add('hidden')
        this.#componenteResolucion.classList.add('hidden')
        break
      case 'familiar':
        this.#componenteFamiliar.classList.remove('hidden')
        this.#componenteEstadoProcesal.classList.add('hidden')
        this.#componenteObservacion.classList.add('hidden')
        this.#componentePrueba.classList.add('hidden')
        this.#componenteResolucion.classList.add('hidden')
        break
      case 'observacion':
        this.#componenteObservacion.classList.remove('hidden')
        this.#componenteEstadoProcesal.classList.add('hidden')
        this.#componenteFamiliar.classList.add('hidden')
        this.#componentePrueba.classList.add('hidden')
        this.#componenteResolucion.classList.add('hidden')
        break
      case 'prueba':
        this.#componentePrueba.classList.remove('hidden')
        this.#componenteEstadoProcesal.classList.add('hidden')
        this.#componenteFamiliar.classList.add('hidden')
        this.#componenteObservacion.classList.add('hidden')
        this.#componenteResolucion.classList.add('hidden')
        break
      case 'resolucion':
        this.#componenteResolucion.classList.remove('hidden')
        this.#componenteEstadoProcesal.classList.add('hidden')
        this.#componenteFamiliar.classList.add('hidden')
        this.#componenteObservacion.classList.add('hidden')
        this.#componentePrueba.classList.add('hidden')
        break
    }
  }

  //Metodo que se ejecuta cuando se cambia un atributo
  manageFormFields() {
    this.#componenteEstadoProcesal = this.shadowRoot.getElementById('estadoProcesal')
    this.#componenteFamiliar = this.shadowRoot.getElementById('familiarPromovente')
    this.#componenteObservacion = this.shadowRoot.getElementById('observacionPromovente')
    this.#componentePrueba = this.shadowRoot.getElementById('pruebaPromovente')
    this.#componenteResolucion = this.shadowRoot.getElementById('resolucionPromovente')

    this.#botonPrueba = this.shadowRoot.getElementById('button-pruebas')
    this.#botonFamiliar = this.shadowRoot.getElementById('button-familiares')
    this.#botonObservacion = this.shadowRoot.getElementById('button-observaciones')
    this.#botonResolucion = this.shadowRoot.getElementById('button-resoluciones')
    this.#botonEstadoProcesal = this.shadowRoot.getElementById('button-estados-procesales')


    this.#botonEstadoProcesal.addEventListener('click', () => {
      this.manejadorComponentes('estado-procesal')
    })
    this.#botonFamiliar.addEventListener('click', () => {
      this.manejadorComponentes('familiar')
    })
    this.#botonObservacion.addEventListener('click', () => {
      this.manejadorComponentes('observacion')
    })
    this.#botonPrueba.addEventListener('click', () => {
      this.manejadorComponentes('prueba')
    })
    this.#botonResolucion.addEventListener('click', () => {
      this.manejadorComponentes('resolucion')
    })

    //Asignacion de los campos del formulario a las variables correspondientes
    this.#fechaInicio = this.shadowRoot.getElementById('fecha-inicio')
    this.#estatusProceso = this.shadowRoot.getElementById('estatus')
    this.#juzgado = this.shadowRoot.getElementById('juzgado')
    this.#numeroExpediente = this.shadowRoot.getElementById('expediente')
    this.#tipoJuicio = this.shadowRoot.getElementById('juicio')
    this.#controlInterno = this.shadowRoot.getElementById('ci')
    this.#distritoJudicial = this.shadowRoot.getElementById('distrito')
    this.#municipio = this.shadowRoot.getElementById('municipio')

    //Asignacion de los componentes a las variables correspondientes
    this.#estadosProcesales = this.shadowRoot.getElementById('estado-procesal')
    this.#familiares = this.shadowRoot.getElementById('familiar')
    this.#observaciones = this.shadowRoot.getElementById('observacion')
    this.#pruebas = this.shadowRoot.getElementById('prueba')
    this.#resoluciones = this.shadowRoot.getElementById('resolucion')

    //Asignacion de los componentes a las variables correspondientes
    this.#pruebasWC = this.shadowRoot.querySelector('prueba-promovente')
    this.#familiaresWC = this.shadowRoot.querySelector('familiar-promovente')
    this.#observacionesWC = this.shadowRoot.querySelector('observacion-promovente')
    this.#resolucionesWC = this.shadowRoot.querySelector('resolucion-promovente')
    this.#estadosProcesalesWC = this.shadowRoot.querySelector('estado-procesal')

    //Llamamos al metodo para la gestion de los campos de texto
    this.manejadorEntradaTexto()

  }

  //Metodo que asigna los eventos a los campos de texto de tipo input
  manejadorEntradaTexto() {
    //Evento que se ejecuta cuando se ingresa un valor en el campo de texto    en el numero de expediente
    var numeroExpedienteInput = this.#numeroExpediente
    numeroExpedienteInput.addEventListener('input', function () {

      if (numeroExpedienteInput.value.length > 20) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El número de expediente no debe ser mayor a 20 caracteres'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });

    //Evento que se ejecuta cuando se ingresa un valor en el campo de texto en el control interno
    var controlInternoInput = this.#controlInterno
    controlInternoInput.addEventListener('input', function () {
      if (controlInternoInput.value.length > 20) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El número de control interno no debe ser mayor a 20 caracteres'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });
  }


  //Metodo que se encarga del llenado de los campos del formulario
  fillInputs() {
    //Limpiamos el select de juzgados
    this.#juzgado.innerHTML = ''
    //Creamos un option para el select de juzgados
    const option = document.createElement('option')
    option.value = '0'
    option.text = 'Seleccione un juzgado'
    this.#juzgado.appendChild(option)


    //Llenamos el select de juzgados con los datos obtenidos de la API
    this.#juzgados.forEach(juzgado => {
      const option = document.createElement('option')
      option.value = juzgado.id_juzgado
      option.text = juzgado.nombre_juzgado
      this.#juzgado.appendChild(option)
    })

    //Limpiamos el select de distritos judiciales
    this.#distritoJudicial.innerHTML = ''

    //Creamos un option para el select de distritos judiciales
    const optionDistrito = document.createElement('option')
    optionDistrito.value = '0'
    optionDistrito.text = 'Seleccione un distrito judicial'
    this.#distritoJudicial.appendChild(optionDistrito)

    //Llenamos el select de distritos judiciales con los datos obtenidos de la API
    this.#distritosJudiciales.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.textContent = distrito.nombre_distrito_judicial
      this.#distritoJudicial.appendChild(option)
    })

    //Limpiamos el select de municipios
    this.#municipio.innerHTML = ''

    //Creamos un option para el select de municipios
    const optionMunicipio = document.createElement('option')
    optionMunicipio.value = '0'
    optionMunicipio.text = 'Seleccione un municipio'
    this.#municipio.appendChild(optionMunicipio)

    //Llenamos el select de municipios con los datos obtenidos de la API
    this.#municipios.forEach(municipio => {
      const option = document.createElement('option')
      option.value = municipio.id_municipio_distrito
      option.text = municipio.nombre_municipio
      this.#municipio.appendChild(option)
    })

    //Limpiamos el select de tipos de juicio
    this.#tipoJuicio.innerHTML = ''

    //Creamos un option para el select de tipos de juicio
    const optionTipoJuicio = document.createElement('option')
    optionTipoJuicio.value = '0'
    optionTipoJuicio.text = 'Seleccione un tipo de juicio'
    this.#tipoJuicio.appendChild(optionTipoJuicio)

    //Llenamos el select de tipos de juicio con los datos obtenidos de la API
    this.#tiposDeJuicio.forEach(tipoJuicio => {
      const option = document.createElement('option')
      option.value = tipoJuicio.id_tipo_juicio
      option.textContent = tipoJuicio.tipo_juicio
      this.#tipoJuicio.appendChild(option)
    })

    //Establecemos los valores por defecto de los campos del formulario
    this.#tipoJuicio.value = this.#idTipoJuicio
    this.#municipio.value = this.#idMunicipio
    this.#distritoJudicial.value = this.#idDistritoJudicial
    this.#fechaInicio.value = new Date().toISOString().split('T')[0]
  }


  //Metodo que se encarga de validar los campos del formulario
  validateInputs() {
    try {
      //Se validan los componentes y si estos estan completos
      //los componentes son registroTab, promoventeTab, demandadoTab
      if (this.registroTab.isComplete === false) {
        this.#showModal('No se ha seleccionado un turno, por favor seleccione uno.', 'Error de validación')
        return false
      }

      if (this.promoventeTab.isComplete === false) {
        this.#showModal('No se han ingresado los datos del promovente, por favor ingreselos.', 'Error de validación')
        return false
      }

      if (this.demandadoTab.isComplete === false) {
        this.#showModal('No se han ingresado los datos del demandado, por favor ingreselos.', 'Error de validación')
        return false
      }

      //Asignamos los valores de los campos del formulario a las variables correspondientes
      const fechaInicio = this.#fechaInicio.value
      const estatusProceso = this.#estatusProceso.value
      const juzgado = this.#juzgado.value
      const numeroExpediente = this.#numeroExpediente.value
      const controlInterno = this.#controlInterno.value
      const distritoJudicial = this.#distritoJudicial.value
      const municipio = this.#municipio.value
      const tiposJuicio = this.#tipoJuicio.value

      const fechaActual = new Date();
      fechaActual.setUTCHours(0, 0, 0, 0); // Establecer hora UTC

      // Obtener la fecha ingresada desde tu input HTML (asegúrate de obtener el valor correctamente)
      const fechaIngresada = new Date(fechaInicio);
      fechaIngresada.setUTCHours(0, 0, 0, 0); // Establecer hora UTC


      //Se valida si la fecha de inicio esta vacia
      if (!fechaInicio) {
        throw new ValidationError('La fecha de inicio es requerida')
      }

      //Se valida si el estatus del proceso esta vacio
      if (!estatusProceso) {
        throw new ValidationError('El estatus del proceso es requerido')
      }

      //Se valida si el juzgado esta vacio
      if (juzgado === '0') {
        throw new ValidationError('El juzgado es requerido')
      }

      //Se valida si el numero de expediente esta vacio y si es mayor a 20 caracteres
      if (numeroExpediente === '') {
        throw new ValidationError('El número de expediente es requerido')
      } else if (numeroExpediente.length > 20) {
        throw new ValidationError('El número de expediente no debe ser mayor a 20 caracteres')
      }


      //Se valida si el control interno esta vacio y si es mayor a 20 caracteres
      if (controlInterno === '') {
        throw new ValidationError('El número de control interno es requerido')
      }
      else if (controlInterno.length > 20) {
        throw new ValidationError('El número de control interno no debe ser mayor a 20 caracteres')
      }

      //Se valida si el distrito judicial esta vacio
      if (distritoJudicial === '0') {
        throw new ValidationError('El distrito judicial es requerido')
      }

      //Se valida si el municipio esta vacio
      if (municipio === '0') {
        throw new ValidationError('El municipio es requerido')
      }

      //Se valida si el tipo de juicio esta vacio
      if (tiposJuicio === '0') {
        throw new ValidationError('El tipo de juicio es requerido')
      }

      return true
    } catch (error) {
      //Manejador de errores
      if (error instanceof ValidationError) {
        this.#showModal(error.message, 'Error de validación')
      } else {
        console.error(error)
        this.#showModal(
          'Error al validar datos , persona, domicilio, por favor intenta de nuevo',
          'Error'
        )
      }

      return false
    }
  }

  //Metodo que se llama o coneta el componente
  async campos() {
    //Se asignan los eventos a los botones del formulario
    this.btnNext = this.shadowRoot.getElementById('btn-proceso-next')

    //Evento que se ejecuta cuando se da click en el boton siguiente
    this.btnNext.addEventListener('click', () => {
      if (!this.validateInputs()) return
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'detalles' },
      })
      this.dispatchEvent(event)
    })

    //Manejador de eventos con respecto a los tabs
    document.addEventListener('tab-change', event => {
      const tabId = event.detail.tabId
      if (tabId !== 'proceso') {
        return
      }
      //De igual manera que los demas esta condicion se encarga de verificar si un turno ha sido seleccionado y asi poder 
      //inicializar el componente con los datos, caso contrario donde se seleccione otro turno se reinician los campos
      if (this.registroTab.isComplete === true) {

        if (this.#turnoSeleccionado === null) {
          this.#turnoSeleccionado = this.registroTab.turno
          this.init()
        }
        if (this.#turnoSeleccionado !== null && this.#turnoSeleccionado.id_turno !== this.registroTab.turno.id_turno) {
          this.#turnoSeleccionado = this.registroTab.turno
          this.init()
          this.restetCampos()
        }
      }
    })

  }

  //Metodo que se encarga de limpiar los campos del formulario , componentes y variables
  restetCampos() {
    this.#fechaInicio.value = new Date().toISOString().split('T')[0]
    this.#juzgado.value = '0'
    this.#numeroExpediente.value = ''
    this.#controlInterno.value = ''
    this.#distritoJudicial.value = '0'
    this.#municipio.value = '0'
    this.#tipoJuicio.value = '0'


    const data = []
    const estadoProcesalWC = this.#estadosProcesalesWC
    estadoProcesalWC.data = data;

    const familiarWC = this.#familiaresWC
    familiarWC.data = data;

    const observacionWC = this.#observacionesWC
    observacionWC.data = data;

    const pruebaWC = this.#pruebasWC
    pruebaWC.data = data;

    const resolucionWC = this.#resolucionesWC
    resolucionWC.data = data;


  }


  //Metodo que se encarga de mostrar un mensaje de alerta o de error
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.setOnCloseCallback(() => { })

    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }

}

customElements.define('proceso-full-tab', ProcesoTab)
