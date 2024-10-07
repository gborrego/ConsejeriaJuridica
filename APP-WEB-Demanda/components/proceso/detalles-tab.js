import { ValidationError } from '../../lib/errors.js'
import { validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model.js'
//import '../codigo-postal/codigo-postal.js'

 

export class DetallesTab extends HTMLElement {

    //Variables de la clase 
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



    async fetchTemplate() {
        const template = document.createElement('template');
        const html = await (await fetch('./components/proceso/detalles-tab.html')).text();
        template.innerHTML = html;
        return template;
      }
      async init2() {
        const templateContent = await this.fetchTemplate();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(templateContent.content.cloneNode(true));
             //Aqui se obtienen los web components que se van a utilizar en el componente de los demas
        //tabs en este caso se obtienen los datos de los tabs de registro, promovente, demandado y proceso
        this.#registroTab = document.querySelector('registro-full-tab')
        this.#promoventeTab = document.querySelector('promovente-full-tab')
        this.#demandadoTab = document.querySelector('demandado-full-tab')
        this.#procesoTab = document.querySelector('proceso-full-tab')
        await this.campos()

      }
      //Constructor de la clase
      constructor() {
        super()
        this.id = 'detalles'
        this.style.display = 'none'
        this.init2()

   
    }

    //Metodo que se encarga de inicializar el componente
    async init() {
        this.#api = new APIModel()
        this.manageFormFields()
        this.fillInputs()
    }

    //Metodo que se encarga de manejar los campos del formulario
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
        this.#sexoDemandado = this.shadowRoot.getElementById('sexo-demandado')
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

    //Metodo que se encarga de llenar los campos del formulario
    fillInputs() {
     
        //Se obtienen los datos de los tabs de registro, promovente, demandado y proceso
        const { turno } = this.#registroTab.data
        const { promovente } = this.#promoventeTab.data
        const { demandado } = this.#demandadoTab.data
        const { proceso } = this.#procesoTab.data

        //Se rellenan los campos del formulario con los datos obtenidos

        this.#nombreDefensor.textContent = proceso.defensor
        this.#tipoJuicio.textContent = proceso.tipo_juicio
        this.#fechaInicio.textContent = proceso.fecha_inicio
        this.#numeroExpediente.textContent = proceso.numero_expediente
        this.#ci.textContent = proceso.control_interno


        //Se obtienen los datos de los arrays de estados procesales, pruebas, resoluciones, observaciones y familiares

        //Se rellenan los estados procesales
        this.#estadosProcesales.textContent = proceso.estadosProcesales.map((estado, index) =>
            `${index + 1}. Estado Procesal: ${estado.descripcion_estado_procesal} Fecha: ${estado.fecha_estado_procesal}`).join(', ')

        //Se rellenan las pruebas
        this.#pruebas.textContent = proceso.pruebas.map((prueba, index) => `${index + 1}. Prueba: ${prueba.descripcion_prueba}`).join(', ')

        //Se rellenan las resoluciones
        this.#resoluciones.textContent = proceso.resoluciones.map((resolucion, index) => `${index + 1}. Resolucion: ${resolucion.resolucion}
        Fecha: ${resolucion.fecha_resolucion}`).join(', ')

        //Se rellenan las observaciones
        this.#observaciones.textContent = proceso.observaciones.map((observacion, index) => `${index + 1}. Observacion: ${observacion.observacion}`).join(', ')

        //Se rellenan los familiares 
        this.#familiares.textContent = proceso.familiares.map((familiar, index) => `${index + 1}. Nombre: ${familiar.nombre} Nacionalidad: ${familiar.nacionalidad}
    Parentesco: ${familiar.parentesco} Pertenece a la comunidad LGBT: ${familiar.perteneceComunidadLGBT===true?'Si':'No'} Adulto Mayor: ${familiar.adultaMayor===true? 'Si': 'No'} Salud Precaria: ${familiar.saludPrecaria===true?'Si': 'No'} Pobreza Extrema: ${familiar.pobrezaExtrema ===true?'Si': 'No'}`).join(', ')

        //Se rellenan los campos del promovente e demandado        
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

        this.#nombreDemandado.textContent = demandado.nombre  + ' ' + demandado.apellido_paterno + ' ' + demandado.apellido_materno
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

    //Callback que se ejecuta cuando el componente es agregado al DOM
    async campos() {
        //Asignacion de eventos a los botones

        this.btnCrearAsesoria = this.shadowRoot.getElementById('btn-crear-proceso')

        //Evento que se ejecuta al hacer clic en el boton de crear asesoria
        this.btnCrearAsesoria.addEventListener('click', async () => {
            try { 
                /*

                const modal = document.querySelector('modal-warning')
                modal.message = 'Si esta seguro de editar el catalogo presione aceptar, de lo contrario presione x para cancelar.'
                modal.title = '¿Confirmacion de editar catalogo?'
                
                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    if (modal.respuesta === true) {
                      modal.respuesta = false

                      this.#api.putCatalogos(catalogoID, catalogo).then(response => {
                        if (response) {
                          this.#catalogo.value = '';
                          this.#estatusCatalogo.value = '0';
                          this.#idSeleccion = null;
                          this.#pagina = 1
                          this.getNumeroPaginas()
                          this.mostrarCatalogos();
                        }
                      }).catch(error => {
                        console.error('Error al editar el catalogo:', error);
                        const modal = document.querySelector('modal-warning')
                        modal.setOnCloseCallback(() => {});

                        modal.message = 'Error al editar el catalogo, intente de nuevo o verifique el status del servidor.'
                        modal.title = 'Error de validación'
                        modal.open = true
                      });
                    }
                  }
                }
                );
                modal.open = true

                */
                /*
                //Obtencion de los datos de los tabs de registro, promovente, demandado y proceso
                const { turno } = this.#registroTab.data
                const { promovente } = this.#promoventeTab.data
                const { demandado } = this.#demandadoTab.data
                const { proceso } = this.#procesoTab.data
                const procesoJudicial = {
                    turno,
                    promovente,
                    demandado,
                    proceso
                }

                //Llamda a la API para crear el proceso judicial
                await this.#api.postProcesoJudicial(procesoJudicial)
                  
                //actualizar turno
                 const turnoActualizado = {
                    id_turno: turno.id_turno,
                    fecha_turno: turno.fecha_turno,
                    hora_turno: turno.hora_turno,
                    id_asesoria: turno.asesoria.datos_asesoria.id_asesoria,
                    id_defensor: turno.defensor.id_defensor,
                    estatus_general: 'EN_SEGUIMIENTO'
                 }
                 //Llamada a la API para actualizar el turno ya que el turno tiene ciertos estados.
                    await this.#api.putTurno(turno.id_turno,turnoActualizado)
                this.#showModal(
                    'El proceso judicial se ha creado correctamente',
                    'Proceso Judicial creado',
                    () => {
                        location.href = '/'
                    }
                )
                    */
                    
                    
                const modal = document.querySelector('modal-warning')
                modal.message = 'Si esta seguro de crear el proceso judicial presione aceptar, de lo contrario presione x para cancelar.'
                modal.title = '¿Confirmacion de crear proceso judicial?'

                modal.setOnCloseCallback(() => {
                    if (modal.open === 'false') {
                        if (modal.respuesta === true) {
                            modal.respuesta = false
                            const { turno } = this.#registroTab.data
                            const { promovente } = this.#promoventeTab.data
                            const { demandado } = this.#demandadoTab.data
                            const { proceso } = this.#procesoTab.data
                            const procesoJudicial = {
                                turno,
                                promovente,
                                demandado,
                                proceso
                            }
                            const turnoActualizado = {
                                id_turno: turno.id_turno,
                                fecha_turno: turno.fecha_turno,
                                hora_turno: turno.hora_turno,
                                id_asesoria: turno.asesoria.datos_asesoria.id_asesoria,
                                id_defensor: turno.defensor.id_defensor,
                                estatus_general: 'EN_SEGUIMIENTO'
                            }

                            this.#api.putTurno(turno.id_turno, turnoActualizado).then(response => {
                              
                            }).catch(error => {
                                console.error('Error al actualizar el turno:', error)
                                this.#showModal(
                                    'Ocurrió un error al actualizar el turno, verifique que el turno con id ' + turno.id_turno + ' se haya sido actualizado, si no es así, actualice el turno manualmente' ,
                                    'Error al actualizar el turno, consulte al administrador del sistema'
                                )
                            })
                        

                            this.#api.postProcesoJudicial(procesoJudicial).then(response => {
                                if (response) {
                                    this.#showModal(
                                        'El proceso judicial se ha registrado correctamente',
                                        'Proceso judicial registrado',
                                        () => {
                                           location.href = '/'
                                        }
                                    )
                                }
                            }).catch(error => {
                                console.error('Error al registrar el proceso judicial:', error)
                                this.#showModal(
                                    'Ocurrió un error al registrar el proceso judicial',
                                    'Error al registrar el proceso judicial'
                                )
                            })
                        }
                    }
                })
                modal.open = true
                   
            } catch (error) {
                console.error(error)
                this.#showModal(
                    'Ocurrió un error al registrar el proceso judicial',
                    'Error al registrar el proceso judicial'
                )
            }
        })

        //Evento que se ejecuta al cambio de tab
        document.addEventListener('tab-change', event => {
            const tabId = event.detail.tabId
            if (tabId !== 'detalles') {
                return
            }
            this.init()
        })
    }

    //Metodo que se encarga de mostrar el modal de error
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
