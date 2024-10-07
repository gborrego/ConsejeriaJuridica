import { ValidationError } from '../../lib/errors.js'
import { validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model.js'
import '../seguimientoProceso/estado-procesal.js'
import '../seguimientoProceso/familiar.js'
import '../seguimientoProceso/observacion.js'
import '../seguimientoProceso/prueba.js'
import '../seguimientoProceso/familiar.js'
import '../seguimientoProceso/resolucion.js'



export class ProcesoTab extends HTMLElement {

  //Variables de la clase
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



  #controlInternoData
  #numeroExpedienteData
  #idJuzgado


  #idDistritoJudicial
  #idMunicipio
  #idTipoJuicio
  #id_defensor

  #pruebasWC
  #familiaresWC
  #observacionesWC
  #resolucionesWC
  #estadosProcesalesWC
  #fecha_estatus
  #procesoSelecionado = null

  #proceso
  #estadosProcesales2
  #familiares2
  #observaciones2
  #pruebas2
  #resoluciones2


  //Metodo get que se encarga de obtener los atributos del componente
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo get que obtiene el valor del atributo id
  get id() {
    return this.getAttribute('id')
  }

  //Metodo set que establece el valor del atributo id
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo get que verifica si el formulario esta completo
  get isComplete() {
    return this.validateInputs()
  }

  //Metodo set que establece el valor del atributo data
  get data() {
    const estatusProceso = this.#estatusProceso.value === '1' ? 'BAJA' : 'CONCLUIDO'
    const proceso = {
      fecha_inicio: this.#fechaInicio.value,
      fecha_estatus: this.#estatusProceso.value === '0' ? null : new Date().toISOString().split('T')[0],
      id_juzgado: this.#juzgado.value,
      juzgado: this.#juzgado.options[this.#juzgado.selectedIndex].text,
      numero_expediente: this.#numeroExpediente.value,
      control_interno: this.#controlInterno.value,
      id_defensor: this.#id_defensor,
      estatus_proceso: this.#estatusProceso.value === '0' ? 'EN_TRAMITE' : estatusProceso,
      defensor: this.registroTab.data.defensor,
      id_distrito_judicial: this.#distritoJudicial.value,
      id_municipio_distrito: this.#municipio.value,
      id_tipo_juicio: this.#tipoJuicio.value,
      tipo_juicio: this.#tipoJuicio.options[this.#tipoJuicio.selectedIndex].text,
      municipio: this.#municipio.options[this.#municipio.selectedIndex].text,
      distrito_judicial: this.#distritoJudicial.options[this.#distritoJudicial.selectedIndex].text
      //,
     // pruebas: this.#pruebasWC.data.pruebas,
    //  familiares: this.#familiaresWC.data.familiares,
    //  observaciones: this.#observacionesWC.data.observaciones,
    //  resoluciones: this.#resolucionesWC.data.resoluciones,
    //  estadosProcesales: this.#estadosProcesalesWC.data.estadosProcesales,
    }
    return { proceso: proceso }

  }
  //Metodo set que establece el valor del atributo data
  set data(value) {
    this.setAttribute('data', value)
  }


  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/seguimiento/proceso-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Componentes de las demas pestañas requeridas previamente
    this.registroTab = document.querySelector('registro-full-tab')
    this.promoventeTab = document.querySelector('promovente-full-tab')
    this.demandadoTab = document.querySelector('demandado-full-tab')
    await this.campos()
  }
  //Constructor de la clase
  constructor() {
    super()
    //Variables que nos ayudan a determinar la pestaña actual
    this.id = 'proceso'
    this.style.display = 'none'
    this.init2()


  }

  //Metodo que inicializa las variables de la clase, datos, etc
  async init() {
    //Inicializacion de la api
    this.#api = new APIModel()

    //Obtencion de los juzgados 
    try{
    const juzgados = await this.#api.getJuzgados()
    this.#juzgados = juzgados
      
    }catch(error){  
      console.error(error)
    }

    //Obtencion de los distritos judiciales
    const distritosJudiciales = await this.#api.getDistritos()
    this.#distritosJudiciales = distritosJudiciales

    //Inicializacion de datos requeridos como lo son el id del distrito judicial, municipio, tipo de juicio, id del defensor, id del juzgado, control interno y numero de expediente
    //con el fin de llenar los campos del formulario
    const id_distrito_judicial = this.registroTab.data.proceso.id_distrito_judicial
    const id_municipio = this.registroTab.data.proceso.id_municipio_distrito
    this.#idDistritoJudicial = id_distrito_judicial
    this.#idMunicipio = id_municipio
    this.#idTipoJuicio = this.registroTab.data.proceso.id_tipo_juicio
    this.#id_defensor = this.registroTab.data.proceso.id_defensor
    this.#idJuzgado = this.registroTab.data.proceso.id_juzgado
    this.#controlInternoData = this.registroTab.data.proceso.control_interno
    this.#numeroExpedienteData = this.registroTab.data.proceso.numero_expediente

    //Obtencion de los tipos de juicio
    const { tiposDeJuicio } = await this.#api.getTiposJuicio()
    this.#tiposDeJuicio = tiposDeJuicio


    //Obtencion de los municipios
    const municipios = await this.#api.getMunicipiosByDistrito(id_distrito_judicial)
    this.#municipios = municipios

    //LLenado de los campos del formulario
    this.manageFormFields()
    //Llenado de los campos de los componentes de las demas pestañas
    this.fillInputs()
  }


  //Mensaje de advertencia al cambiar de estatus es decir de EN TRAMITE a BAJA o CONCLUIDO
  cambioEstatus() {
    if (this.#estatusProceso.value === '1' || this.#estatusProceso.value === '2') {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { })

      modal.message = 'Al cambiar de estatus y actualizarlo, este no podra ser modificado, al menos que un encargado  de distrito lo haga'
      modal.title = 'Mensaje de Advertencia unico'
      modal.open = true
      this.#fecha_estatus.value = new Date().toISOString().split('T')[0]
    }
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
  #bloqueEstatus
  #bloqueFechaEstatus
  
  #rol
  #idEmpleado
  #idUsuario   

  verificadorRol(){
    const { id_usuario, id_tipouser, id_distrito_judicial, id_empleado } = this.#api.user
    this.#rol = id_tipouser
    this.#idEmpleado = id_empleado
    this.#idDistritoJudicial = id_distrito_judicial
    this.#idUsuario = id_usuario
    this.#bloqueEstatus.classList.add('hidden')
    this.#bloqueFechaEstatus.classList.add('hidden')


    if ( this.#rol === 2 || this.#rol === 4) {
      this.#bloqueEstatus.classList.add('hidden')
      this.#bloqueFechaEstatus.classList.add('hidden')
    } 
    
    else     if (this.#rol === 1 ) {
      this.#bloqueEstatus.classList.remove('hidden')
      this.#bloqueFechaEstatus.classList.add('hidden')
    } 
    
    else if (this.#rol === 3) {
      this.#bloqueEstatus.classList.remove('hidden')
      this.#bloqueFechaEstatus.classList.remove('hidden')
    }
  }

  //Metodo que se encarga de llenar los campos del formulario
  manageFormFields() {

    this.#bloqueEstatus = this.shadowRoot.getElementById('bloque_estatus')
    this.#bloqueFechaEstatus = this.shadowRoot.getElementById('bloque_fecha_estatus')

    this.#bloqueEstatus.classList.add('hidden')
    this.#bloqueFechaEstatus.classList.add('hidden')
     this.verificadorRol()
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


    this.#fecha_estatus = this.shadowRoot.getElementById('fecha-estatus')
    this.#fechaInicio = this.shadowRoot.getElementById('fecha-inicio')
    this.#estatusProceso = this.shadowRoot.getElementById('estatus')
    this.#juzgado = this.shadowRoot.getElementById('juzgado')
    this.#numeroExpediente = this.shadowRoot.getElementById('expediente')
    this.#tipoJuicio = this.shadowRoot.getElementById('juicio')
    this.#controlInterno = this.shadowRoot.getElementById('ci')
    this.#distritoJudicial = this.shadowRoot.getElementById('distrito')
    this.#municipio = this.shadowRoot.getElementById('municipio')

    //Se le asigna el evento change al campo de estatus del proceso
    this.#estatusProceso.addEventListener('change', (e) => {
      this.cambioEstatus()
    })


    this.#estadosProcesales = this.shadowRoot.getElementById('estado-procesal')
    this.#familiares = this.shadowRoot.getElementById('familiar')
    this.#observaciones = this.shadowRoot.getElementById('observacion')
    this.#pruebas = this.shadowRoot.getElementById('prueba')
    this.#resoluciones = this.shadowRoot.getElementById('resolucion')


    this.#pruebasWC = this.shadowRoot.querySelector('prueba-promovente')
    this.#familiaresWC = this.shadowRoot.querySelector('familiar-promovente')
    this.#observacionesWC = this.shadowRoot.querySelector('observacion-promovente')
    this.#resolucionesWC = this.shadowRoot.querySelector('resolucion-promovente')
    this.#estadosProcesalesWC = this.shadowRoot.querySelector('estado-procesal')

    //Se obteiene el componente web de estado procesal y se le asigna la data


    const estadoProcesalWC = this.#estadosProcesalesWC
     
    // Verificar si el componente fue encontrado
    if (estadoProcesalWC) {
      const data = this.registroTab.data.id_proceso_judicial;
      estadoProcesalWC.data = data;
    } else {
      console.error('No se encontró el componente web "estado-procesal" en el DOM.');
    }

    //Se obteiene el componente web de familiar y se le asigna la data

    const familiarWC = this.#familiaresWC

    // Verificar si el componente fue encontrado
    if (familiarWC) {
      const data =this.registroTab.data.promovente.id_participante
      familiarWC.data = data;
    } else {
      console.error('No se encontró el componente web "familiar" en el DOM.');
    }

    //Se obteiene el componente web de observacion y se le asigna la data


    const observacionWC = this.#observacionesWC

    // Verificar si el componente fue encontrado
    if (observacionWC) {
      const data = this.registroTab.data.id_proceso_judicial
      observacionWC.data = data;

    } else {
      console.error('No se encontró el componente web "observacion" en el DOM.');
    }

    //Se obteiene el componente web de prueba y se le asigna la data

    const pruebaWC = this.#pruebasWC

    // Verificar si el componente fue encontrado
    if (pruebaWC) {
      const data = this.registroTab.data.id_proceso_judicial
      pruebaWC.data = data;
    } else {
      console.error('No se encontró el componente web "prueba" en el DOM.');
    }

    const resolucionWC = this.#resolucionesWC

    // Verificar si el componente fue encontrado

    if (resolucionWC) {
      const data = this.registroTab.data.id_proceso_judicial
      resolucionWC.data = data;
    } else {
      console.error('No se encontró el componente web "resolucion" en el DOM.');
    }

    //LLamda al metodo de manejo de entrada de texto
    this.manejadorEntradaTexto()
    if(this.registroTab.data.proceso.estatus_proceso ==='BAJA'){
     this.#estatusProceso.value = '1'
    }
     else if(this.registroTab.data.proceso.estatus_proceso ==='CONCLUIDO'){
       this.#estatusProceso.value = '2'
     } else {
       this.#estatusProceso.value = '0'
     }
 

  }

  //Metodo que se encarga de manejar la entrada de texto agregando eventos a los campos de texto
  manejadorEntradaTexto() {
    //Se le asigna el evento input a los campos de fecha de inicio, numero de expediente, control interno

    var numeroExpedienteInput = this.#numeroExpediente
    numeroExpedienteInput.addEventListener('input', function () {

      if (numeroExpedienteInput.value.length > 20) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El número de expediente no debe ser mayor a 20 caracteres'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });

    var controlInternoInput = this.#controlInterno
    controlInternoInput.addEventListener('input', function () {
      if (controlInternoInput.value.length > 20) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El número de control interno no debe ser mayor a 20 caracteres'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });
  }

  //LLenado de los campos del formulario select
  fillInputs() {
    //Se limpian los campos de los select
    this.#juzgado.innerHTML = ''

    //Se crea un option por defecto
    const optionDefault = document.createElement('option')
    optionDefault.value = '0'
    optionDefault.text = 'Seleccione un juzgado'
    this.#juzgado.appendChild(optionDefault)

    //Se llena el select de juzgados 
    this.#juzgados.forEach(juzgado => {
      const option = document.createElement('option')
      option.value = juzgado.id_juzgado
      option.text = juzgado.nombre_juzgado
      this.#juzgado.appendChild(option)
    })

    //Se limpian los campos de los select del distrito judicial
    this.#distritoJudicial.innerHTML = ''

    //Se crea un option por defecto
    const optionDefaultDistrito = document.createElement('option')
    optionDefaultDistrito.value = '0'
    optionDefaultDistrito.text = 'Seleccione un distrito judicial'
    this.#distritoJudicial.appendChild(optionDefaultDistrito)


    //Se llena el select de distritos judiciales
    this.#distritosJudiciales.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.textContent = distrito.nombre_distrito_judicial
      this.#distritoJudicial.appendChild(option)
    })


    //Se limpian los campos de los select del municipio
    this.#municipio.innerHTML = ''

    //Se crea un option por defecto
    const optionDefaultMunicipio = document.createElement('option')
    optionDefaultMunicipio.value = '0'
    optionDefaultMunicipio.text = 'Seleccione un municipio'
    this.#municipio.appendChild(optionDefaultMunicipio)

    //Se llena el select de municipios
    this.#municipios.forEach(municipio => {
      const option = document.createElement('option')
      option.value = municipio.id_municipio_distrito
      option.text = municipio.nombre_municipio
      this.#municipio.appendChild(option)
    })


    //Se limpian los campos de los select del tipo de juicio
    this.#tipoJuicio.innerHTML = ''

    //Se crea un option por defecto
    const optionDefaultTipoJuicio = document.createElement('option')
    optionDefaultTipoJuicio.value = '0'
    optionDefaultTipoJuicio.text = 'Seleccione un tipo de juicio'
    this.#tipoJuicio.appendChild(optionDefaultTipoJuicio)

    //Se llena el select de tipos de juicio
    this.#tiposDeJuicio.forEach(tipoJuicio => {
      const option = document.createElement('option')
      option.value = tipoJuicio.id_tipo_juicio
      option.textContent = tipoJuicio.tipo_juicio
      this.#tipoJuicio.appendChild(option)
    })

    //Se asignan los valores con respecto a los datos del proceso
    this.#proceso = this.registroTab.data.proceso

    this.#tipoJuicio.value = this.#idTipoJuicio
    this.#municipio.value = this.#idMunicipio
    this.#distritoJudicial.value = this.#idDistritoJudicial
    this.#fechaInicio.value = this.#proceso.fecha_inicio
    this.#juzgado.value = this.#idJuzgado
    this.#controlInterno.value = this.#controlInternoData
    this.#numeroExpediente.value = this.#numeroExpedienteData



  }



  //Metodo encargado de validar los campos del formulario
  validateInputs() {
    try {
      //Obtencion de los valores de los campos del formulario
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

      //Se valida que la fecha si exista o que haya seleccionado una fecha
      if (!fechaInicio) {
        throw new ValidationError('La fecha de inicio es requerida')
      }

      //Se valida el estatus del proceso
      if (!estatusProceso) {
        throw new ValidationError('El estatus del proceso es requerido')
      }

      //Se valida que el juzgado haya sido seleccionado
      if (juzgado === '0') {
        throw new ValidationError('El juzgado es requerido')
      }

      //Se valida que el numero de expediente no este vacio, que no sea mayor a 20 caracteres 
      if (numeroExpediente === '') {
        throw new ValidationError('El número de expediente es requerido')
      } else if (numeroExpediente.length > 20) {
        throw new ValidationError('El número de expediente no debe ser mayor a 20 caracteres')
      }

      //Se valida que el control interno no este vacio, que no sea mayor a 20 caracteres
      if (controlInterno === '') {
        throw new ValidationError('El número de control interno es requerido')
      }
      else if (controlInterno.length > 20) {
        throw new ValidationError('El número de control interno no debe ser mayor a 20 caracteres')
      }

      //Se valida que el distrito judicial haya sido seleccionado
      if (distritoJudicial === '0') {
        throw new ValidationError('El distrito judicial es requerido')
      }

      //Se valida que el municipio haya sido seleccionado
      if (municipio === '0') {
        throw new ValidationError('El municipio es requerido')
      }

      //Se valida que el tipo de juicio haya sido seleccionado
      if (tiposJuicio === '0') {
        throw new ValidationError('El tipo de juicio es requerido')
      }



      return true
    } catch (error) {
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

  //Metodo que se encarga de inicializar los eventos del componente
  async campos() {
    //Se obtiene el boton de siguiente
    this.btnNext = this.shadowRoot.getElementById('btn-proceso-next')

    //Se le asigna el evento click al boton de siguiente
    this.btnNext.addEventListener('click', () => {
      if (!this.validateInputs()) return
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'detalles' },
      })
      this.dispatchEvent(event)
    })
    //Se le asigna el evento change con respecto a las tabs
    document.addEventListener('tab-change', event => {
      const tabId = event.detail.tabId
      // Esto es con el fin de verificar si se ha seleccionado un proceso judicial , y en cason de que no se haya seleccionado uno, se seleccione uno
      //pero cuando ya se ha seleccionado uno, se verifica si el proceso seleccionado es diferente al que se selecciono anteriormente y asi cargar los datos
      if (this.#procesoSelecionado === null) {
        this.#procesoSelecionado = this.registroTab.proceso
        this.init()
      }
      if (this.#procesoSelecionado !== null && this.#procesoSelecionado.id_proceso_judicial !== this.registroTab.proceso.id_proceso_judicial) {
        this.#procesoSelecionado = this.registroTab.proceso
        this.init()
      }
    })
  }

  //Metodo que se encarga de mostrar el modal de advertencia
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
