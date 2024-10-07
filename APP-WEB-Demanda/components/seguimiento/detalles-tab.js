import { ValidationError } from '../../lib/errors.js'
import { validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model.js'
//import '../codigo-postal/codigo-postal.js'

 

export class DetallesTab extends HTMLElement {

    //Variable de la clase
    #api
    #registroTab
    #promoventeTab
    #procesoTab
    #demandadoTab
    #nombreDefensor
    #tipoJuicio
    #fechaInicio
    #numeroExpediente
    #ci
    #estadosProcesales
    #pruebas
    #resoluciones
    #observaciones
    #familiares

    #nombrePromovente
    #edadPromovente
    #sexoPromovente
    #telefonoPromovente
    #etniaPromovente
    #escolaridadPromovente
    #ocupacionPromovente
    #españolPromovente
    #callePromovente
    #numeroExteriorPromovente
    #numeroInteriorPromovente
    #codigoPostalPromovente
    #estadoPromovente
    #municipioPromovente
    #ciudadPromovente
    #coloniaPromovente

    #nombreDemandado
    #edadDemandado
    #sexoDemandado
    #telefonoDemandado
    #etniaDemandado
    #escolaridadDemandado
    #ocupacionDemandado
    #españolDemandado
    #calleDemandado
    #numeroExteriorDemandado
    #numeroInteriorDemandado
    #codigoPostalDemandado
    #estadoDemandado
    #municipioDemandado
    #ciudadDemandado
    #coloniaDemandado

    //Metodo que obtiene los atributos que se observan
    static get observedAttributes() {
        return ['id', 'data']
    }

    //Metodo que obtiene el id del componente
    get id() {
        return this.getAttribute('id')
    }

    //Metodo que setea el id del componente
    set id(value) {
        this.setAttribute('id', value)
    }

    //Metodo que valida si el componente esta   completo
    get isComplete() {
        return this.validateInputs()
    }

    //Metodo que obtiene los datos del componente
    get data() {
        return {}
    }

    //Metodo que setea los datos del componente
    set data(value) {
        this.init()
        this.setAttribute('data', value)
    }


 
    async fetchTemplate() {
        const template = document.createElement('template');
        const html = await (await fetch('./components/seguimiento/detalles-tab.html')).text();
        template.innerHTML = html;
        return template;
      }
      async init2() {
        const templateContent = await this.fetchTemplate();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(templateContent.content.cloneNode(true));
        
        //Inicializamos las variables de los componentes
        this.#registroTab = document.querySelector('registro-full-tab')
        this.#promoventeTab = document.querySelector('promovente-full-tab')
        this.#demandadoTab = document.querySelector('demandado-full-tab')
        this.#procesoTab = document.querySelector('proceso-full-tab')
         await this.campos()
      }
      //Constructor de la clase
      constructor() {
        super()
        //ID que nos ayuda para el cambio de tabs
        this.id = 'detalles'
        this.style.display = 'none'
        this.init2()

    }

    //Metodo que inicializa las variables de la clase, maneja los campos del formulario y llena los inputs
    async init() {
        this.#api = new APIModel()
        this.manageFormFields()
        this.fillInputs()
    }

    //Metodo que maneja los campos del formulario
    manageFormFields() {

        this.#nombreDefensor = this.shadowRoot.getElementById('nombre-defensor')
        this.#tipoJuicio = this.shadowRoot.getElementById('tipo-juicio')
        this.#fechaInicio = this.shadowRoot.getElementById('fecha-inicio')
        this.#numeroExpediente = this.shadowRoot.getElementById('numero-expediente')
        this.#ci = this.shadowRoot.getElementById('ci')
        this.#estadosProcesales = this.shadowRoot.getElementById('estados-procesales')
        this.#pruebas = this.shadowRoot.getElementById('pruebas')
        this.#resoluciones = this.shadowRoot.getElementById('resoluciones')
        this.#observaciones = this.shadowRoot.getElementById('observaciones')
        this.#familiares = this.shadowRoot.getElementById('familiares')

        this.#nombrePromovente = this.shadowRoot.getElementById('nombre-promovente')
        this.#edadPromovente = this.shadowRoot.getElementById('edad-promovente')
        this.#sexoPromovente = this.shadowRoot.getElementById('sexo-promovente')
        this.#telefonoPromovente = this.shadowRoot.getElementById('telefono-promovente')
        this.#etniaPromovente = this.shadowRoot.getElementById('etnia-promovente')
        this.#escolaridadPromovente = this.shadowRoot.getElementById('escolaridad-promovente')
        this.#ocupacionPromovente = this.shadowRoot.getElementById('ocupacion-promovente')
        this.#españolPromovente = this.shadowRoot.getElementById('español-promovente')
        this.#callePromovente = this.shadowRoot.getElementById('calle-promovente')
        this.#numeroExteriorPromovente = this.shadowRoot.getElementById('numero-exterior-promovente')

        this.#numeroInteriorPromovente = this.shadowRoot.getElementById('numero-interior-promovente')
        this.#codigoPostalPromovente = this.shadowRoot.getElementById('codigo-postal-promovente')
        this.#estadoPromovente = this.shadowRoot.getElementById('estado-promovente')
        this.#municipioPromovente = this.shadowRoot.getElementById('municipio-promovente')
        this.#ciudadPromovente = this.shadowRoot.getElementById('ciudad-promovente')
        this.#coloniaPromovente = this.shadowRoot.getElementById('colonia-promovente')

        this.#nombreDemandado = this.shadowRoot.getElementById('nombre-demandado')
        this.#edadDemandado = this.shadowRoot.getElementById('edad-demandado')
        this.#sexoDemandado= this.shadowRoot.getElementById('sexo-demandado')
        this.#telefonoDemandado = this.shadowRoot.getElementById('telefono-demandado')
        this.#calleDemandado = this.shadowRoot.getElementById('calle-demandado')
        this.#numeroExteriorDemandado = this.shadowRoot.getElementById('numero-exterior-demandado')
        this.#numeroInteriorDemandado = this.shadowRoot.getElementById('numero-interior-demandado')

        this.#codigoPostalDemandado = this.shadowRoot.getElementById('codigo-postal-demandado')
        this.#estadoDemandado = this.shadowRoot.getElementById('estado-demandado')
        this.#municipioDemandado = this.shadowRoot.getElementById('municipio-demandado')
        this.#ciudadDemandado = this.shadowRoot.getElementById('ciudad-demandado')
        this.#coloniaDemandado = this.shadowRoot.getElementById('colonia-demandado')

    }

    //Metodo que llena los inputs del formulario , etc
    fillInputs() {

        //Obtencion de los datos de los tabs, para llenar los inputs
        //en este caso se obtienen los datos de los tabs de promovente, demandado y proceso
        //y se rellenan los datos al html correspondiente

        const { promovente } = this.#promoventeTab.data
        const { demandado } = this.#demandadoTab.data
        const { proceso } = this.#procesoTab.data
        
        this.#tipoJuicio.textContent = proceso.tipo_juicio
        this.#fechaInicio.textContent = proceso.fecha_inicio
        this.#numeroExpediente.textContent = proceso.numero_expediente
        this.#ci.textContent = proceso.control_interno

   /*

        this.#estadosProcesales.textContent = proceso.estadosProcesales.map((estado, index) =>
            `${index + 1}. Estado Procesal: ${estado.descripcion_estado_procesal} Fecha: ${estado.fecha_estado_procesal}`).join(', ')


        this.#pruebas.textContent = proceso.pruebas.map((prueba, index) => `${index + 1}. Prueba: ${prueba.descripcion_prueba}`).join(', ')


        this.#resoluciones.textContent = proceso.resoluciones.map((resolucion, index) => `${index + 1}. Resolucion: ${resolucion.resolucion}
        Fecha: ${resolucion.fecha_resolucion}`).join(', ')


        this.#observaciones.textContent = proceso.observaciones.map((observacion, index) => `${index + 1}. Observacion: ${observacion.observacion}`).join(', ')

        this.#familiares.textContent = proceso.familiares.map((familiar, index) => `${index + 1}. Nombre: ${familiar.nombre} Nacionalidad: ${familiar.nacionalidad}
    Parentesco: ${familiar.parentesco} Pertenece a la comunidad LGBT: ${familiar.perteneceComunidadLGBT === true ? 'Si' : 'No'} Adulto Mayor: ${familiar.adultaMayor === true ? 'Si' : 'No'} Salud Precaria: ${familiar.saludPrecaria === true ? 'Si' : 'No'} Pobreza Extrema: ${familiar.pobrezaExtrema === true ? 'Si' : 'No'}`).join(', ')

    */

        this.#nombrePromovente.textContent = promovente.nombre + ' ' + promovente.apellido_paterno + ' ' + promovente.apellido_materno
        this.#edadPromovente.textContent = promovente.edad
        this.#sexoPromovente.textContent = promovente.sexo
        this.#telefonoPromovente.textContent = promovente.telefono
        this.#etniaPromovente.textContent = promovente.etnia
        this.#escolaridadPromovente.textContent = promovente.escolaridad
        this.#ocupacionPromovente.textContent = promovente.ocupacion
        this.#españolPromovente.textContent = promovente.español === true ? 'Si' : 'No'
        this.#callePromovente.textContent = promovente.domicilio.calle_domicilio
        this.#numeroExteriorPromovente.textContent = promovente.domicilio.numero_exterior_domicilio
        this.#numeroInteriorPromovente.textContent = promovente.domicilio.numero_interior_domicilio
        this.#codigoPostalPromovente.textContent = promovente.domicilio.cp
        this.#estadoPromovente.textContent = promovente.domicilio.estado
        this.#municipioPromovente.textContent = promovente.domicilio.municipio
        this.#ciudadPromovente.textContent = promovente.domicilio.ciudad
        this.#coloniaPromovente.textContent = promovente.domicilio.colonia

        this.#nombreDemandado.textContent = demandado.nombre + ' ' + demandado.apellido_paterno + ' ' + demandado.apellido_materno
        this.#edadDemandado.textContent = demandado.edad
        this.#sexoDemandado.textContent = demandado.sexo
        this.#telefonoDemandado.textContent = demandado.telefono
        this.#calleDemandado.textContent = demandado.domicilio.calle_domicilio
        this.#numeroExteriorDemandado.textContent = demandado.domicilio.numero_exterior_domicilio
        this.#numeroInteriorDemandado.textContent = demandado.domicilio.numero_interior_domicilio
        this.#codigoPostalDemandado.textContent = demandado.domicilio.cp
        this.#estadoDemandado.textContent = demandado.domicilio.estado
        this.#municipioDemandado.textContent = demandado.domicilio.municipio
        this.#ciudadDemandado.textContent = demandado.domicilio.ciudad
        this.#coloniaDemandado.textContent = demandado.domicilio.colonia



    }

    //Conector del componente que inicializa el componente
    async campos() {
        //Obtencion del boton de crear asesoria
        this.btnCrearAsesoria = this.shadowRoot.getElementById('btn-crear-proceso')

        //Evento que se dispara al dar click en el boton de crear asesoria
        this.btnCrearAsesoria.addEventListener('click', async () => {
            try {
                //Onjeto que contiene los datos de los tabs
                const { promovente } = this.#promoventeTab.data
                const { demandado } = this.#demandadoTab.data
                const { proceso } = this.#procesoTab.data
                const { id_proceso_judicial, id_promovente, id_demandado} = this.#registroTab.data
                promovente.id_promovente = id_promovente
                demandado.id_demandado = id_demandado
                proceso.id_proceso_judicial = id_proceso_judicial
                //Creacion del objeto que contiene los datos de los tabs
                const data = {
                    promovente,
                    demandado,
                    proceso
                }
              

                await this.#api.putProcesoJudicial(proceso.id_proceso_judicial, data)
                //Mensaje de exito
                this.#showModal(
                    'El proceso judicial se ha actualizado correctamente',
                    'Proceso Judicial actualizado',
                    () => {
                        location.href = '/'
                    }
                ) 
            } catch (error) {
                //Mensaje de error
                console.error(error)
                this.#showModal(
                    'Ocurrió un error al registrar el proceso judicial',
                    'Error al registrar el proceso judicial'
                )
            }
        })
   //Metodo que maneja los cambios de tabs
        document.addEventListener('tab-change', event => {
            const tabId = event.detail.tabId
            if (tabId !== 'detalles') {
                return
            }
            this.init()
        })
    }


   
    //Metodo que muestra el mensaje de modal
    #showModal(message, title, onCloseCallback) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = message
        modal.title = title
        modal.open = true
        modal.setOnCloseCallback(onCloseCallback)
    }

}

customElements.define('detalles-full-tab', DetallesTab)
