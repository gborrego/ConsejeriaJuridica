const proceso_judicial = require('../models/proceso_judicial')
const participanteDAO = require('../data-access/participanteDAO')
const juzgadoDAO = require('../data-access/juzgadoDAO')


const estadosProcesalesDAO = require('../data-access/estado_procesalDAO')
const observacionesDAO = require('../data-access/observacionDAO')
const resolucionesDAO = require('../data-access/resolucionDAO')
const pruebasDAO = require('../data-access/pruebaDAO')
const familiaresDAO = require('../data-access/familiarDAO')

const demandadoDAO = require('../data-access/demandadoDAO')
const promoventeDAO = require('../data-access/promoventeDAO')
const domicilioDAO = require('../data-access/domicilio_participanteDAO')


const logger = require('../utilidades/logger');


class ProcesoJudicialDAO {

  /**
 * @abstract Método que permite crear un proceso judicial en la base de datos
 * @param {object} procesoJudicial - Objeto que contiene los datos del proceso judicial
 * @returns {object} Retorna el objeto del proceso judicial creado si la operación fue exitosa, de lo contrario lanza un error
 */
  async crearProcesoJudicial({
    turno, promovente, demandado, proceso }) {
    try {
      logger.info("Creando de proceso judicial", { turno, promovente, demandado, proceso })
      const promovente_object = JSON.parse(JSON.stringify(promovente))
      const turno_object = JSON.parse(JSON.stringify(turno))
      const demandado_object = JSON.parse(JSON.stringify(demandado))
      const proceso_object = JSON.parse(JSON.stringify(proceso))

       logger.info("Registrando proceso judicial", { proceso_object})
      const proceso_creado = await this.registrarProceso(proceso_object, turno_object)
     logger.info("Registrando promovente", { promovente_object})  
      const promovente_creado = await this.registrarPromovente(promovente_object, proceso_object.familiares, proceso_creado.id_proceso_judicial)
      logger.info("Registrando demandado", { demandado_object})
      const demandado_creado = await this.registrarDemandado(demandado_object, proceso_creado.id_proceso_judicial)
      const proces_cread_object = JSON.parse(JSON.stringify(proceso_creado))
      proces_cread_object.promovente = promovente_creado
      proces_cread_object.demandado = demandado_creado
      logger.info("LLamando a obtener proceso judicial y obtener todos sus datos", { id_proceso_judicial: proceso_creado.id_proceso_judicial })
      return await this.obtenerProcesoJudicial(proceso_creado.id_proceso_judicial)
    } catch (err) {
      logger.error("Error al crear proceso judicial", { error: err.message })
      throw err
    }
  }
   
  /** 
   * Método que permite registrar un demandado en la base de datos
   * @param {object} demandado - Objeto que contiene los datos del demandado
   * @param {number} id_proceso_judicial - ID del proceso judicial al que pertenece el demandado
   * @returns {object} Retorna el objeto del demandado creado si la operación fue exitosa, de lo contrario lanza un error
   * */

  async registrarDemandado(demandado, id_proceso_judicial) {
    logger.info("Registrando demandado", { demandado })
    const { nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero } = demandado
    logger.info("Creando participante", { nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_proceso_judicial })
    const demandado_creado = await participanteDAO.crearParticipante({ nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_proceso_judicial })
    const demandado_object = JSON.parse(JSON.stringify(demandado_creado))

    const domicilio = demandado.domicilio
    const { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia } = domicilio

    logger.info("Creando domicilio de participante", { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia, id_participante: demandado_object.id_participante })
    const domicilioParticipante = await domicilioDAO.crearDomicilioParticipante({ calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia, id_participante: demandado_object.id_participante })
    demandado_object.domicilio = domicilioParticipante

    logger.info("Creando demandado", { id_demandado: demandado_object.id_participante })
    const demandado_creado_oficial = await demandadoDAO.crearDemandado({ id_demandado: demandado_object.id_participante })
    demandado_object.demandado = demandado_creado_oficial

    return demandado_object

  }

  /**
   * Método que permite registrar un promovente en la base de datos
   * @param {object} promovente - Objeto que contiene los datos del promovente
   * @param {array} familiares - Arreglo de objetos que contienen los datos de los familiares del promovente
   * @param {number} id_proceso_judicial - ID del proceso judicial al que pertenece el promovente
   * @returns {object} Retorna el objeto del promovente creado si la operación fue exitosa, de lo contrario lanza un error
   * */

  async registrarPromovente(promovente, familiares, id_proceso_judicial) {
    logger.info("Registrando promovente", { promovente })

    const { nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero } = promovente

    logger.info("Creando participante", { nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_proceso_judicial })
    const participante = await participanteDAO.crearParticipante({ nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_proceso_judicial })
    const participante_object = JSON.parse(JSON.stringify(participante))
    const domicilio = promovente.domicilio
    const { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia } = domicilio

    logger.info("Creando domicilio de participante", { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia, id_participante: participante_object.id_participante })
    const domicilioParticipante = await domicilioDAO.crearDomicilioParticipante({ calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia, id_participante: participante_object.id_participante })
    participante_object.domicilio = domicilioParticipante
    const id_promovente = participante_object.id_participante
    const { español, id_escolaridad, id_etnia, id_ocupacion } = promovente

   logger.info("Creando promovente", { id_promovente, español, id_escolaridad, id_etnia, id_ocupacion })
    const promovente_creado = await promoventeDAO.crearPromovente({ id_promovente, español, id_escolaridad, id_etnia, id_ocupacion })
    participante_object.promovente = promovente_creado

    const familiares_creados = []
    logger.info("Creando familiares", { familiares })
    for (let i = 0; i < familiares.length; i++) {
      const familiar = familiares[i]
      const { nombre, nacionalidad, parentesco, perteneceComunidadLGBT, adultaMayor, saludPrecaria, pobrezaExtrema } = familiar
      const familiar_creado = await familiaresDAO.crearFamiliar({ nombre, nacionalidad, parentesco, perteneceComunidadLGBT, adultaMayor, saludPrecaria, pobrezaExtrema, id_promovente: participante_object.id_participante })
      familiares_creados.push(familiar_creado)
    }
    participante_object.familiares = familiares_creados

  logger.info("Promovente creado", { participante_object })
    return participante_object
  }

/** 
 * 
 * Método que permite registrar un proceso judicial en la base de datos
 * @param {object} proceso - Objeto que contiene los datos del proceso judicial
 * @param {object} turno - Objeto que contiene los datos del turno
 * @returns {object} Retorna el objeto del proceso judicial creado si la operación fue exitosa, de lo contrario lanza un error
 * */


  async registrarProceso(proceso, turno) {
    logger.info("Registrando proceso judicial", { proceso })
    const proceso_object = JSON.parse(JSON.stringify(proceso))
    const turno_object = JSON.parse(JSON.stringify(turno))

    const { fecha_inicio, fecha_estatus, control_interno, numero_expediente, id_distrito_judicial, id_municipio_distrito, id_tipo_juicio, estatus_proceso, id_juzgado, id_defensor } = proceso_object
    const { id_turno } = turno_object

    logger.info("Creando proceso judicial", { fecha_inicio, fecha_estatus, control_interno, numero_expediente, id_turno, id_distrito_judicial, id_municipio_distrito, id_tipo_juicio, estatus_proceso, id_juzgado, id_defensor })
    const procesoJudicial = await proceso_judicial.create({ fecha_inicio, fecha_estatus, control_interno, numero_expediente, id_turno, id_distrito_judicial, id_municipio_distrito, id_tipo_juicio, estatus_proceso, id_juzgado, id_defensor })

    const proceso_judicial_object = JSON.parse(JSON.stringify(procesoJudicial))

    const pruebas = proceso_object.pruebas
    const observaciones = proceso_object.observaciones
    const resoluciones = proceso_object.resoluciones
    const estadosProcesales = proceso_object.estadosProcesales

    const pruebas_creadas = []
    const observaciones_creadas = []
    const resoluciones_creadas = []
    const estadosProcesales_creados = []

     logger.info("Creando pruebas", { pruebas })
    for (let i = 0; i < pruebas.length; i++) {
      const prueba = await pruebasDAO.crearPrueba({ descripcion_prueba: pruebas[i].descripcion_prueba, id_proceso_judicial: procesoJudicial.id_proceso_judicial })
      pruebas_creadas.push(prueba)
    }

    logger.info("Creando observaciones", { observaciones })
    for (let i = 0; i < observaciones.length; i++) {
      const observacion = await observacionesDAO.crearObservacion({ observacion: observaciones[i].observacion, id_proceso_judicial: procesoJudicial.id_proceso_judicial })
      observaciones_creadas.push(observacion)
    }

    logger.info("Creando resoluciones", { resoluciones })
    for (let i = 0; i < resoluciones.length; i++) {
      const resolucion = await resolucionesDAO.crearResolucion({ resolucion: resoluciones[i].resolucion, fecha_resolucion: resoluciones[i].fecha_resolucion, id_proceso_judicial: procesoJudicial.id_proceso_judicial })
      resoluciones_creadas.push(resolucion)
    }

    logger.info("Creando estados procesales", { estadosProcesales })
    for (let i = 0; i < estadosProcesales.length; i++) {
      const estadoProcesal = await estadosProcesalesDAO.crearEstadoProcesal({ descripcion_estado_procesal: estadosProcesales[i].descripcion_estado_procesal, fecha_estado_procesal: estadosProcesales[i].fecha_estado_procesal, id_proceso_judicial: procesoJudicial.id_proceso_judicial })
      estadosProcesales_creados.push(estadoProcesal)
    }

    proceso_judicial_object.pruebas = pruebas_creadas
    proceso_judicial_object.observaciones = observaciones_creadas
    proceso_judicial_object.resoluciones = resoluciones_creadas
    proceso_judicial_object.estadosProcesales = estadosProcesales_creados

    logger.info("Proceso judicial creado", { proceso_judicial_object })
    return proceso_judicial_object

  }

/** 
 * Método que permite actualizar un proceso judicial en la base de datos
 * @param {object} proceso_judicial_ob - Objeto que contiene los datos del proceso judicial
 * @param {object} promovente - Objeto que contiene los datos del promovente
 * @returns {object} Retorna el objeto del proceso judicial actualizado si la operación fue exitosa, de lo contrario lanza un error
 * */


  async actualizarProcesoJudicial(proceso_judicial_ob, promovente) {
 
    logger.info("Actualizando proceso judicial", { proceso_judicial_ob, promovente })
    const proceso_object = JSON.parse(JSON.stringify(proceso_judicial_ob))
    const promovente_object = JSON.parse(JSON.stringify(promovente))
     const id_proceso_judicial = proceso_object.id_proceso_judicial
      const estatus_proceso = proceso_object.estatus_proceso

      logger.info("Actualizando proceso judicial dependiendo del estatus del proceso judicial", { estatus_proceso })
     if(estatus_proceso !== "EN_TRAMITE"){

      const {  fecha_inicio, fecha_estatus, estatus_proceso, id_juzgado, numero_expediente, control_interno, id_defensor, id_distrito_judicial, id_municipio_distrito, id_tipo_juicio } = proceso_object
      logger.info("Actualizando proceso judicial no tramite (Baja,COncluido)", { fecha_inicio, fecha_estatus, estatus_proceso, id_juzgado, numero_expediente, control_interno, id_defensor, id_distrito_judicial, id_municipio_distrito, id_tipo_juicio })
      const procesoJudicial = await proceso_judicial.update({ fecha_inicio, fecha_estatus, estatus_proceso, id_juzgado, numero_expediente, control_interno, id_defensor, id_distrito_judicial, id_municipio_distrito, id_tipo_juicio }, { where: { id_proceso_judicial: proceso_object.id_proceso_judicial } })
     }else {
      let {  fecha_inicio, fecha_estatus, estatus_proceso, id_juzgado, numero_expediente, control_interno, id_defensor, id_distrito_judicial, id_municipio_distrito, id_tipo_juicio } = proceso_object
       estatus_proceso = "EN_TRAMITE"
      fecha_estatus = null
      logger.info("Actualizando proceso judicial en tramite", { fecha_inicio, fecha_estatus, estatus_proceso, id_juzgado, numero_expediente, control_interno, id_defensor, id_distrito_judicial, id_municipio_distrito, id_tipo_juicio })
      const procesoJudicial = await proceso_judicial.update({ fecha_inicio, fecha_estatus, estatus_proceso, id_juzgado, numero_expediente, control_interno, id_defensor, id_distrito_judicial, id_municipio_distrito, id_tipo_juicio }, { where: { id_proceso_judicial: proceso_object.id_proceso_judicial } })
    
     }
/*
   
    const pruebas = proceso_object.pruebas
    const observaciones = proceso_object.observaciones
    const resoluciones = proceso_object.resoluciones
    const estadosProcesales = proceso_object.estadosProcesales
    const familiares = proceso_object.familiares 

    const pruebas_actualizadas = []
    const observaciones_actualizadas = []
    const resoluciones_actualizadas = []
    const estadosProcesales_actualizados = []
   const familiares_actualizados = []
    
 

    for (let i = 0; i < pruebas.length; i++) {
       if (pruebas[i].id_prueba) {
        
        const prueba = await pruebasDAO.actualizarPrueba(pruebas[i].id_prueba, { descripcion_prueba: pruebas[i].descripcion_prueba, id_proceso_judicial })
        pruebas_actualizadas.push(pruebas[i])
      } else {
        const prueba = await pruebasDAO.crearPrueba({ descripcion_prueba: pruebas[i].descripcion_prueba, id_proceso_judicial: id_proceso_judicial })
        pruebas_actualizadas.push(prueba)
      }
    }
     
    for (let i = 0; i < observaciones.length; i++) {
      if (observaciones[i].id_observacion) {
       
        const observacion = await observacionesDAO.actualizarObservacion(observaciones[i].id_observacion, { observacion: observaciones[i].observacion, id_proceso_judicial })
        observaciones_actualizadas.push(observaciones[i])
      } else {
       
        const observacion = await observacionesDAO.crearObservacion({ id_proceso_judicial, observacion: observaciones[i].observacion })
        observaciones_actualizadas.push(observacion)
      }
    }

    for (let i = 0; i < resoluciones.length; i++) {
      if (resoluciones[i].id_resolucion) {
       
        const resolucion = await resolucionesDAO.actualizarResolucion(resoluciones[i].id_resolucion, { resolucion: resoluciones[i].resolucion, fecha_resolucion: resoluciones[i].fecha_resolucion })
        resoluciones_actualizadas.push(resoluciones[i])
      } else {
    
         const { resolucion, fecha_resolucion } = resoluciones[i]
        const resolucion_creada = await resolucionesDAO.crearResolucion({ id_proceso_judicial, resolucion, fecha_resolucion })
        resoluciones_actualizadas.push(resolucion_creada)
      }
    }

    for (let i = 0; i < estadosProcesales.length; i++) {
      if (estadosProcesales[i].id_estado_procesal) {
        const estadoProcesal = await estadosProcesalesDAO.actualizarEstadoProcesal(estadosProcesales[i].id_estado_procesal, { descripcion_estado_procesal: estadosProcesales[i].descripcion_estado_procesal, fecha_estado_procesal: estadosProcesales[i].fecha_estado_procesal, id_proceso_judicial })
        estadosProcesales_actualizados.push(estadosProcesales[i])
      } else {
        const estadoProcesal = await estadosProcesalesDAO.crearEstadoProcesal({ descripcion_estado_procesal: estadosProcesales[i].descripcion_estado_procesal, fecha_estado_procesal: estadosProcesales[i].fecha_estado_procesal, id_proceso_judicial })
        estadosProcesales_actualizados.push(estadoProcesal)
      }
    }
  
    for (let i = 0; i < familiares.length; i++) {

       if (familiares[i].id_familiar) {
        const familiar = await familiaresDAO.actualizarFamiliar(familiares[i].id_familiar, { nombre: familiares[i].nombre, nacionalidad: familiares[i].nacionalidad, parentesco: familiares[i].parentesco, perteneceComunidadLGBT: familiares[i].perteneceComunidadLGBT, adultaMayor: familiares[i].adultaMayor, saludPrecaria: familiares[i].saludPrecaria, pobrezaExtrema: familiares[i].pobrezaExtrema, id_promovente: familiares[i].id_promovente })
        familiares_actualizados.push( familiares[i])
      } else {
        const familiar = await familiaresDAO.crearFamiliar({ nombre: familiares[i].nombre, nacionalidad: familiares[i].nacionalidad, parentesco: familiares[i].parentesco, perteneceComunidadLGBT: familiares[i].perteneceComunidadLGBT, adultaMayor: familiares[i].adultaMayor, saludPrecaria: familiares[i].saludPrecaria, pobrezaExtrema: familiares[i].pobrezaExtrema, id_promovente: promovente_object.id_promovente })
        familiares_actualizados.push(familiar)
      }
    }
*/
    const proceso_judicial_sin_datos  = this.obtenerProcesoJudicialNormal(id_proceso_judicial)
    const proceso_judicial_object_pre = JSON.parse(JSON.stringify(proceso_judicial_sin_datos))
   
    //proceso_judicial_object_pre.familiares = familiares_actualizados
    //proceso_judicial_object_pre.pruebas = pruebas_actualizadas
    //proceso_judicial_object_pre.observaciones = observaciones_actualizadas
    //proceso_judicial_object_pre.resoluciones = resoluciones_actualizadas
    //proceso_judicial_object_pre.estados_procesales = estadosProcesales_actualizados
     logger.info("Proceso judicial actualizado", { proceso_judicial_object_pre })
    return proceso_judicial_object_pre
  }
  /**  
   * Metodo que permite actualizar un demandado en la base de datos
   * @param {object} demandado - Objeto que contiene los datos del demandado
   * @returns {object} Retorna el objeto del demandado actualizado si la operación fue exitosa, de lo contrario lanza un error
   * */


  async actualizarDemandado(demandado) {
     logger.info("Actualizando demandado", { demandado })
    const demandado_object = JSON.parse(JSON.stringify(demandado))
    const { id_demandado, nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero } = demandado_object
     logger.info("Actualizando participante", { id_demandado, nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero })
    const demandado_ = await participanteDAO.actualizarParticipante(id_demandado, { nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero })
    const domicilio = demandado_object.domicilio
    const { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia } = domicilio
    logger.info("Actualizando domicilio de participante", { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia })
    const domicilioParticipante = await domicilioDAO.actualizarDomicilioParticipante(domicilio.id_domicilio, { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia })
    return demandado_object
  }

  /**
   * Método que permite actualizar un promovente en la base de datos
   * @param {object} promovente - Objeto que contiene los datos del promovente
   *  
   * @returns {object} Retorna el objeto del promovente actualizado si la operación fue exitosa, de lo contrario lanza un error
   * */
  

  async actualizarPromovente(promovente) {
   logger.info("Actualizando promovente", { promovente })
    const promovente_object = JSON.parse(JSON.stringify(promovente))
    const { id_promovente, nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_escolaridad, id_etnia, id_ocupacion, español } = promovente_object
     logger.info("Actualizando promovente", { id_promovente, nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero, id_escolaridad, id_etnia, id_ocupacion, español })
    const promovente_ = await promoventeDAO.actualizarPromovente(id_promovente, {español, id_escolaridad, id_etnia, id_ocupacion  })
     logger.info("Actualizando participante", { id_promovente, nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero })
    const participante_actualizado = await participanteDAO.actualizarParticipante(id_promovente, { nombre, apellido_paterno, apellido_materno, edad, telefono, id_genero })
    const domicilio = promovente_object.domicilio
    const { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia } = domicilio
   logger.info("Actualizando domicilio de participante", { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia })
    const domicilioParticipante = await domicilioDAO.actualizarDomicilioParticipante(domicilio.id_domicilio, { calle_domicilio, numero_exterior_domicilio, numero_interior_domicilio, id_colonia })
     logger.info("Promovente actualizado", { promovente_object })
    return promovente_object
    
  }

  /** 
   *  Método que permite obtener un proceso judicial de la base de datos por su id
   * @param {number} id - ID del proceso judicial a obtener
   * @returns {object} Retorna el objeto del proceso judicial si la operación fue exitosa, de lo contrario lanza un error
   * */

  async obtenerProcesoJudicialNormal(id) {
    try {
      logger.info("Obteniendo proceso judicial", { id })
      const procesoJudicial = await proceso_judicial.findByPk(id)
     if (!procesoJudicial) {
        logger.info("Proceso judicial no encontrado")
        throw new Error("Proceso judicial no encontrado") 
      }

      logger.info("Proceso judicial obtenido", { procesoJudicial })
      return procesoJudicial
    } catch (err) {
      logger.error("Error al obtener proceso judicial", { error: err.message })
      throw err
    }
  }
  /**
 * @abstract Método que permite obtener todos los procesos judiciales de la base de datos
 * @returns {array} Retorna un arreglo de objetos de procesos judiciales si la operación fue exitosa, de lo contrario lanza un error
 */
  async obtenerProcesosJudiciales() {
    try {
      logger.info("Obteniendo procesos judiciales")
      const procesosJudiciales = await proceso_judicial.findAll()
      if(procesosJudiciales ===null || procesosJudiciales.length === 0){
        logger.info("Procesos judiciales no encontrados")
        throw new Error("Procesos judiciales no encontrados")
      }

      const procesosJudicialesObject = JSON.parse(JSON.stringify(procesosJudiciales))
       logger.info("Obteniendo todos los datos de los procesos judiciales, juzgados y particpantes")  
      for (let i = 0; i < procesosJudicialesObject.length; i++) {
        procesosJudicialesObject[i].participantes = await participanteDAO.obtenerParticipantesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
        procesosJudicialesObject[i].juzgado = await juzgadoDAO.obtenerJuzgado(procesosJudicialesObject[i].id_juzgado)
       // procesosJudicialesObject[i].estados_procesales = await estadosProcesalesDAO.obtenerEstadoProcesalPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
       // procesosJudicialesObject[i].observaciones = await observacionesDAO.obtenerObservacionesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
       // procesosJudicialesObject[i].resoluciones = await resolucionesDAO.obtenerResolucionesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
      //  procesosJudicialesObject[i].pruebas = await pruebasDAO.obtenerPruebasPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
      }

      logger.info("Procesos judiciales obtenidos", { procesosJudicialesObject })
      return procesosJudicialesObject
    } catch (err) {
      logger.error("Error al obtener procesos judiciales", { error: err.message })
      throw err
    }
  }
  /** 
   * Método que permite obtener todos los procesos judiciales de un defensor de la base de datos
   * @param {number} id_defensor - ID del defensor a obtener sus procesos judiciales
   * @returns {array} Retorna un arreglo de objetos de procesos judiciales si la operación fue exitosa, de lo contrario lanza un error
   * */


  async obtenerProcesosJudicialesPorDefensor(id_defensor) {
    try {
      logger.info("Obteniendo procesos judiciales por defensor", { id_defensor })
      const procesosJudiciales = await proceso_judicial.findAll({ where: { id_defensor: id_defensor } })
      if(procesosJudiciales ===null || procesosJudiciales.length === 0){
        logger.info("Procesos judiciales no encontrados")
        throw new Error("Procesos judiciales no encontrados")
      }

      const procesosJudicialesObject = JSON.parse(JSON.stringify(procesosJudiciales))

      logger.info("Obteniendo todos los datos de los procesos judiciales, juzgados y particpantes")
      for (let i = 0; i < procesosJudicialesObject.length; i++) {
        procesosJudicialesObject[i].participantes = await participanteDAO.obtenerParticipantesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
        procesosJudicialesObject[i].juzgado = await juzgadoDAO.obtenerJuzgado(procesosJudicialesObject[i].id_juzgado)
       // procesosJudicialesObject[i].estados_procesales = await estadosProcesalesDAO.obtenerEstadoProcesalPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
      //  procesosJudicialesObject[i].observaciones = await observacionesDAO.obtenerObservacionesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
      //  procesosJudicialesObject[i].resoluciones = await resolucionesDAO.obtenerResolucionesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
      //  procesosJudicialesObject[i].pruebas = await pruebasDAO.obtenerPruebasPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
      }
      return procesosJudicialesObject
    } catch (err) {
      throw err
    }
  }

  async obtenerProcesosJudicialesPorDefensorEstatus(id_defensor, estatus_proceso) {
    try {
       logger.info("Obteniendo procesos judiciales por defensor y estatus", { id_defensor, estatus_proceso })
      const procesosJudiciales = await proceso_judicial.findAll({ where: { id_defensor: id_defensor, estatus_proceso: estatus_proceso } })
       if(procesosJudiciales ===null || procesosJudiciales.length === 0){
        logger.info("Procesos judiciales no encontrados")
        throw new Error("Procesos judiciales no encontrados")
      }
    
      const procesosJudicialesObject = JSON.parse(JSON.stringify(procesosJudiciales))

      logger.info("Obteniendo todos los datos de los procesos judiciales, juzgados y particpantes")
      for (let i = 0; i < procesosJudicialesObject.length; i++) {
        procesosJudicialesObject[i].participantes = await participanteDAO.obtenerParticipantesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
        procesosJudicialesObject[i].juzgado = await juzgadoDAO.obtenerJuzgado(procesosJudicialesObject[i].id_juzgado)
     //   procesosJudicialesObject[i].estados_procesales = await estadosProcesalesDAO.obtenerEstadoProcesalPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
     //   procesosJudicialesObject[i].observaciones = await observacionesDAO.obtenerObservacionesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
     //   procesosJudicialesObject[i].resoluciones = await resolucionesDAO.obtenerResolucionesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
     //   procesosJudicialesObject[i].pruebas = await pruebasDAO.obtenerPruebasPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
      }
      return procesosJudicialesObject
    } catch (err) {
      throw err
    }
  }
  /**
 * @abstract Método que permite obtener un proceso judicial de la base de datos por su id
 * @param {number} id - ID del proceso judicial a obtener
 * @returns {object} Retorna el objeto del proceso judicial si la operación fue exitosa, de lo contrario lanza un error
 */
  async obtenerProcesoJudicial(id) {
    try {
      logger.info("Obteniendo proceso judicial", { id })

      const procesoJudicial = await proceso_judicial.findByPk(id)
       if (!procesoJudicial) {
        throw new Error("Proceso judicial no encontrado")  
       }

      const procesoJudicialObject = JSON.parse(JSON.stringify(procesoJudicial))
       
      logger.info("Obteniendo todos los datos del proceso judicial, juzgados y particpantes")
      procesoJudicialObject.participantes = await participanteDAO.obtenerParticipantesPorProcesoJudicial(id)
      procesoJudicialObject.juzgado = await juzgadoDAO.obtenerJuzgado(procesoJudicialObject.id_juzgado)
     // procesoJudicialObject.estados_procesales = await estadosProcesalesDAO.obtenerEstadoProcesalPorProcesoJudicial(id)
    //  procesoJudicialObject.observaciones = await observacionesDAO.obtenerObservacionesPorProcesoJudicial(id)
     // procesoJudicialObject.resoluciones = await resolucionesDAO.obtenerResolucionesPorProcesoJudicial(id)
     // procesoJudicialObject.pruebas = await pruebasDAO.obtenerPruebasPorProcesoJudicial(id)

      logger.info("Proceso judicial obtenido", { procesoJudicialObject })
      return procesoJudicialObject
    } catch (err) {
      logger.error("Error al obtener proceso judicial", { error: err.message })
      //console.log(err.message)

      throw err
    }
  }


   async obtenerProcesoJudicialMiddleware(id) {
    try {
      logger.info("Obteniendo proceso judicial", { id })
      const procesoJudicial = await proceso_judicial.findByPk(id)
      if (!procesoJudicial) {
        throw new Error("Proceso judicial no encontrado")
      } 
      

      const procesoJudicialObject = JSON.parse(JSON.stringify(procesoJudicial))
       logger.info("Processo judicial obtenido", { procesoJudicialObject })
      return procesoJudicialObject
    } catch (err) {
      logger.error("Error al obtener proceso judicial", { error: err.message })
      //console.log(err.message)
      throw err
    }
   }

  /**
 * @abstract Método que permite actualizar un proceso judicial en la base de datos
 * @param {number} id_proceso_judicial - ID del proceso judicial a actualizar
 * @param {object} procesoJudicial - Objeto que contiene los nuevos datos del proceso judicial
 * @returns {object} Retorna el objeto del proceso judicial actualizado si la operación fue exitosa, de lo contrario lanza un error
 */
  async actualizarProcesoJudicialOficial(id, { promovente, demandado, proceso }) {
    try {
      logger.info("Actualizando proceso judicial", { id, promovente, demandado, proceso })  
      const promovente_object = JSON.parse(JSON.stringify(promovente))
      const demandado_object = JSON.parse(JSON.stringify(demandado))
      const proceso_object = JSON.parse(JSON.stringify(proceso))
       
      logger.info("Actualizando proceso judicial", { id, promovente, demandado, proceso })
      const proceso_actualizado = await this.actualizarProcesoJudicial(proceso_object, promovente_object)
      logger.info("Actualizando promovente", { promovente })
      const promovente_actualizado = await this.actualizarPromovente(promovente_object)
      logger.info("Actualizando demandado", { demandado })
      const demandado_actualizado = await this.actualizarDemandado(demandado_object)
      logger.info("Proceso judicial actualizado", { proceso_actualizado })
      return await this.obtenerProcesoJudicial(id)
    } catch (err) {
      logger.error("Error al actualizar proceso judicial", { error: err.message })
      //console.log(err.message)
      throw err
    }
  }


 /**
  * Método que permite obtener todos los procesos judiciales de un juzgado de la base de datos por su estatus
  * @param {string} estatus_proceso - Estatus del proceso judicial a obtener
  * @returns {array} Retorna un arreglo de objetos de procesos judiciales si la operación fue exitosa, de lo contrario lanza un error
  * */

  async obtenerProcesosJudicialesPorTramite(estatus_proceso){
    try {
      logger.info("Obteniendo procesos judiciales por estatus", { estatus_proceso })
      const procesosJudiciales = await proceso_judicial.findAll({ where: {estatus_proceso: estatus_proceso } })
   if ( procesosJudiciales === null || procesosJudiciales.length === 0) {
        throw new Error("Procesos judiciales no encontrados")  
       }

      const procesosJudicialesObject = JSON.parse(JSON.stringify(procesosJudiciales))
      logger.info("Obteniendo todos los datos de los procesos judiciales, juzgados y particpantes")
      for (let i = 0; i < procesosJudicialesObject.length; i++) {
        procesosJudicialesObject[i].participantes = await participanteDAO.obtenerParticipantesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
        procesosJudicialesObject[i].juzgado = await juzgadoDAO.obtenerJuzgado(procesosJudicialesObject[i].id_juzgado)
     //   procesosJudicialesObject[i].estados_procesales = await estadosProcesalesDAO.obtenerEstadoProcesalPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
      //  procesosJudicialesObject[i].observaciones = await observacionesDAO.obtenerObservacionesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
     //   procesosJudicialesObject[i].resoluciones = await resolucionesDAO.obtenerResolucionesPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
      //  procesosJudicialesObject[i].pruebas = await pruebasDAO.obtenerPruebasPorProcesoJudicial(procesosJudicialesObject[i].id_proceso_judicial)
      }
      logger.info("Procesos judiciales obtenidos", { procesosJudicialesObject })
      return procesosJudicialesObject
    } catch (err) {
      logger.error("Error al obtener procesos judiciales por estatus", { error: err.message })
      throw err
    }
    
  }


  async  obtenerProcesosJudicialesBusqueda(id_defensor,id_distrito_judicial, total, pagina,estatus_proceso) {
    try {
     logger.info("Obteniendo procesos judiciales por busqueda", { id_defensor, id_distrito_judicial, total, pagina,estatus_proceso })
       
      const limite = 10;
      const offset = (pagina - 1) * limite;
      const whereClause = {};
         
      logger.info("Verificando datos de clausula where que se van a agregar al query", { id_defensor, id_distrito_judicial, total, pagina,estatus_proceso })
      if(id_defensor) whereClause.id_defensor = id_defensor;
      if(id_distrito_judicial) whereClause.id_distrito_judicial = id_distrito_judicial;
      if (estatus_proceso) whereClause.estatus_proceso = estatus_proceso;
  
      logger.info("Si total es verdadero se cuenta la cantidad de procesos judiciales, de lo contrario se obtienen los procesos judiciales")
      if (total) {

        logger.info("Contando la cantidad de procesos judiciales")
        return await proceso_judicial.count({
          where: whereClause
        });
      } else {
        logger.info("Obteniendo los procesos judiciales")
        const procesosJudiciales = await proceso_judicial.findAll({
          where: whereClause,
          limit: limite,
          offset: offset
        });
      if(procesosJudiciales === null || procesosJudiciales.length === 0){
        throw new Error("Procesos judiciales no encontrados")
      }

        const procesosJudicialesObject = JSON.parse(JSON.stringify(procesosJudiciales));

        logger.info("Obteniendo todos los datos de los procesos judiciales, juzgados y particpantes")
        for (let i = 0; i < procesosJudicialesObject.length; i++) {
          const proceso = procesosJudicialesObject[i];
          proceso.participantes = await participanteDAO.obtenerParticipantesPorProcesoJudicial(proceso.id_proceso_judicial);
          proceso.juzgado = await juzgadoDAO.obtenerJuzgado(proceso.id_juzgado);
         // proceso.estados_procesales = await estadosProcesalesDAO.obtenerEstadoProcesalPorProcesoJudicial(proceso.id_proceso_judicial);
         // proceso.observaciones = await observacionesDAO.obtenerObservacionesPorProcesoJudicial(proceso.id_proceso_judicial);
        //  proceso.resoluciones = await resolucionesDAO.obtenerResolucionesPorProcesoJudicial(proceso.id_proceso_judicial);
         // proceso.pruebas = await pruebasDAO.obtenerPruebasPorProcesoJudicial(proceso.id_proceso_judicial);
        }

        logger.info("Procesos judiciales obtenidos", { procesosJudicialesObject })
        return procesosJudicialesObject;
      }
    } catch (err) {
      logger.error("Error al obtener procesos judiciales por busqueda", { error: err.message })
  //    console.error("Error al obtener procesos judiciales:", err.message);
      throw err;
    }
  }
   /*
  async  agregarDetallesProcesosJudiciales(procesosJudiciales) {
    try {
      const procesosJudicialesObject = JSON.parse(JSON.stringify(procesosJudiciales));
      for (let i = 0; i < procesosJudicialesObject.length; i++) {
        const proceso = procesosJudicialesObject[i];
        proceso.participantes = await participanteDAO.obtenerParticipantesPorProcesoJudicial(proceso.id_proceso_judicial);
        proceso.juzgado = await juzgadoDAO.obtenerJuzgado(proceso.id_juzgado);
        proceso.estados_procesales = await estadosProcesalesDAO.obtenerEstadoProcesalPorProcesoJudicial(proceso.id_proceso_judicial);
        proceso.observaciones = await observacionesDAO.obtenerObservacionesPorProcesoJudicial(proceso.id_proceso_judicial);
        proceso.resoluciones = await resolucionesDAO.obtenerResolucionesPorProcesoJudicial(proceso.id_proceso_judicial);
        proceso.pruebas = await pruebasDAO.obtenerPruebasPorProcesoJudicial(proceso.id_proceso_judicial);
      }
      return procesosJudicialesObject;
    } catch (err) {
      console.error("Error al agregar detalles a procesos judiciales:", err.message);
      throw err;
    }
  }
    */
}

module.exports = new ProcesoJudicialDAO()
