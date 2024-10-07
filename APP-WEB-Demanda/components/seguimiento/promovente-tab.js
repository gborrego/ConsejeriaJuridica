import { ValidationError } from '../../lib/errors.js'
import { validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model.js'
//  import '../codigo-postal/codigo-postal.js'



export class PromoventeTab extends HTMLElement {
  //Variables de 
  #api
  #nombre
  #apellidoPaterno
  #apellidoMaterno
  #edad
  #sexo
  #telefono

  #españolRadioYes
  #españolRadioNo

  #etnia
  #etnias

  #escolaridad
  #escolaridades

  #ocupacion
  #ocupaciones

  #calle
  #numeroExt
  #numeroInt
  #colonia
  #cp
  #municipio
  #estado
  #ciudad

  #turno

  #promovente = null
  #promventeDomicilio = null
  #tipoJuicio

  #busquedaCp
  #generos

  #etniaActual
  #escolaridadActual
  #ocupacionActual


  #generoActual
  #editablePromovente
  #botonBuscarCP
  #rellenoInputs = false

  #procesoSelecionado = null

  //Metodo encargado de observar los cambios en los atributos
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo que obtiene el valor del atributo
  get id() {
    return this.getAttribute('id')
  }

  //Metodo que establece el valor del atributo
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que verifica si el promovente esta completo
  get isComplete() {
    return this.validateInputs()
  }

  //Metodo que obtiene los datos del promovente
  get data() {
    const promovente = {
      nombre: this.#nombre.value,
      apellido_paterno: this.#apellidoPaterno.value,
      apellido_materno: this.#apellidoMaterno.value,
      edad: this.#edad.value,
      telefono: this.#telefono.value,
      id_genero: this.#sexo.value,
      id_etnia: this.#etnia.value,
      id_escolaridad: this.#escolaridad.value,
      id_ocupacion: this.#ocupacion.value,
      español: this.#españolRadioYes.checked,
      sexo: this.#sexo.options[this.#sexo.selectedIndex].text,
      etnia: this.#etnia.options[this.#etnia.selectedIndex].text,
      escolaridad: this.#escolaridad.options[this.#escolaridad.selectedIndex].text,
      ocupacion: this.#ocupacion.options[this.#ocupacion.selectedIndex].text,
      domicilio: {
        calle_domicilio: this.#calle.value,
        id_domicilio: this.#promventeDomicilio.id_domicilio,
        numero_exterior_domicilio: this.#numeroExt.value,
        numero_interior_domicilio: this.#numeroInt.value,
        id_colonia: this.#colonia.value,
        cp: this.#cp.value,
        estado: this.#estado.value,
        municipio: this.#municipio.value,
        ciudad: this.#ciudad.value,
        colonia: this.#colonia.options[this.#colonia.selectedIndex].text,
      },
    }
    return {
      promovente
    }
  }
  //Metodo que establece los datos del promovente
  set data(value) {
    this.setAttribute('data', value)
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/seguimiento/promovente-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Componente de registro tab
    this.registroTab = document.querySelector('registro-full-tab')
    //Obtencion del formulario de codigo postal
    this.formCP = this.shadowRoot.getElementById('buscar-cp')
    //Asignacion de la funcion de busqueda de codigo postal
    this.formCP.addEventListener('click', (event) => {
      event.preventDefault();
      if (
        !this.#cp.value ||
        this.#cp.value.length !== 5 ||
        isNaN(this.#cp.value)
      ) {
        this.#showModal('El código postal debe tener 5 dígitos', 'Advertencia')
        return
      }
      this.searchCP()
    })
    await this.campos()
  }
  //Constructor de la clase
  constructor() {
    super()
    //ID del promovente que nos ayuda con los tabs
    this.id = 'promovente'
    this.style.display = 'none'
    this.init2()


  }

  async datosGeneralesPromovente() {
    try {
      const etnias = await this.#api.getEtnias2()
      this.#etnias = etnias
    } catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }

    //Obtencion de las escolaridades
    try {
      const escolaridades = await this.#api.getEscolaridades2()
      this.#escolaridades = escolaridades
    } catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }

    //Obtencion de las ocupaciones
    try {
      const ocupaciones = await this.#api.getOcupaciones2()
      this.#ocupaciones = ocupaciones
    } catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }
    //Obtencion de los generos
    try {
      const { generos } = await this.#api.getGeneros2()
      this.#generos = generos
    } catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }
  }

  //Metodo que inicializa los datos del promovente, select ,etc
  async init() {
    //inicio de la api
    this.#api = new APIModel()
    //Obtencion de las etnias

    //Añadir mecanismo para que cuando se edite los campos de generos, ocupaciones etnicas ,escolaridades se presente el actual sin embargo, 
   await this.datosGeneralesPromovente()
    //Llamada al metodo que maneja los campos del formulario
    this.manageFormFields()

    //Llamada al metodo que llena los inputs
    this.fillInputs()

    this.verificacionDatos()
  }

  async verificacionDatos() {
    //Obtencion del genero actual
    try {
      const { genero } = await this.#api.getGeneroByID(this.#promovente.id_genero)
      this.#generoActual = genero
      console.log(this.#generos)
    } catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }
  
   if (this.#generos === undefined) { 
    const option = document.createElement('option')
    option.value = this.#generoActual.id_genero
    option.text = this.#generoActual.descripcion_genero
    this.#sexo.appendChild(option)
    this.#sexo.value = this.#generoActual.id_genero
   }else{
     //Verificar si el genero ya esta la lista de generos
     let existe = false
     for (let i = 0; i < this.#generos.length; i++) {
        if (this.#generos[i].id_genero === this.#generoActual.id_genero) {
          existe = true
          break
        }
      }
      
      if (existe===false) {
        const option = document.createElement('option')
        option.value = this.#generoActual.id_genero
        option.text = this.#generoActual.descripcion_genero
        this.#sexo.appendChild(option)
        this.#sexo.value = this.#generoActual.id_genero
      }
   }



  /*
 
    const etnia = await this.#api.getEtniaByID(this.#promovente.promovente.etnia.id_etnia)
    this.#etniaActual = etnia

    const escolaridad = await this.#api.getEscolaridadByID(this.#promovente.promovente.escolaridad.id_escolaridad)
    this.#escolaridadActual = escolaridad


    const ocupacion = await this.#api.getOcupacionByID(this.#promovente.promovente.ocupacion.id_ocupacion)
    this.#ocupacionActual = ocupacion

    const opcionesEtnia = this.#etnia.options
    let existeEtnia = false
    for (let i = 0; i < opcionesEtnia.length; i++) {
      if (opcionesEtnia[i].value === this.#etniaActual.id_etnia) {
        existeEtnia = true
        break
      }
    }

    if (existeEtnia) {
      const option = document.createElement('option')
      option.value = this.#etniaActual.id_etnia
      option.text = this.#etniaActual.nombre
      this.#etnia.appendChild(option)
    }

    this.#etnia.value = this.#etniaActual.id_etnia

    const opcionesEscolaridad = this.#escolaridad.options
    let existeEscolaridad = false
    for (let i = 0; i < opcionesEscolaridad.length; i++) {
      if (opcionesEscolaridad[i].value === this.#escolaridadActual.id_escolaridad) {
        existeEscolaridad = true
        break
      }
    }

    if (existeEscolaridad) {
      const option = document.createElement('option')
      option.value = this.#escolaridadActual.id_escolaridad
      option.text = this.#escolaridadActual.descripcion
      this.#escolaridad.appendChild(option)
    }


    this.#escolaridad.value = this.#escolaridadActual.id_escolaridad

    const opcionesOcupacion = this.#ocupacion.options
    let existeOcupacion = false


    for (let i = 0; i < opcionesOcupacion.length; i++) {

      if (opcionesOcupacion[i].value === this.#ocupacionActual.id_ocupacion) {
        existeOcupacion = true
        break
      }
    }

    if (existeOcupacion) {

      const option = document.createElement('option')
      option.value = this.#ocupacionActual.id_ocupacion
      option.text = this.#ocupacionActual.descripcion_ocupacion
      this.#ocupacion.appendChild(option)
    }

    this.#ocupacion.value = this.#ocupacionActual.id_ocupacion
   */

    
    try {
      const etnia = await this.#api.getEtniaByID(this.#promovente.promovente.etnia.id_etnia)
      this.#etniaActual = etnia
    }
    catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }

    if (this.#etnias === undefined) {
      const option = document.createElement('option')
      option.value = this.#etniaActual.id_etnia
      option.text = this.#etniaActual.nombre
      this.#etnia.appendChild(option)
      this.#etnia.value = this.#etniaActual.id_etnia
    }
    else {
      let existe = false
      for (let i = 0; i < this.#etnias.length; i++) {
        if (this.#etnias[i].id_etnia === this.#etniaActual.id_etnia) {
          existe = true
          break
        }
      }

      if (existe === false) {
        const option = document.createElement('option')
        option.value = this.#etniaActual.id_etnia
        option.text = this.#etniaActual.nombre
        this.#etnia.appendChild(option)
        this.#etnia.value = this.#etniaActual.id_etnia
      }
    }

    try {
      const escolaridad = await this.#api.getEscolaridadByID(this.#promovente.promovente.escolaridad.id_escolaridad)
      this.#escolaridadActual = escolaridad
    }

    catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }

    if (this.#escolaridades === undefined) {
      const option = document.createElement('option')
      option.value = this.#escolaridadActual.id_escolaridad
      option.text = this.#escolaridadActual.descripcion
      this.#escolaridad.appendChild(option)
      this.#escolaridad.value = this.#escolaridadActual.id_escolaridad
    }


    else {

      let existe = false
      for (let i = 0; i < this.#escolaridades.length; i++) {
        if (this.#escolaridades[i].id_escolaridad === this.#escolaridadActual.id_escolaridad) {
          existe = true
          break
        }
      }

      if (existe === false) {
        const option = document.createElement('option')
        option.value = this.#escolaridadActual.id_escolaridad
        option.text = this.#escolaridadActual.descripcion
        this.#escolaridad.appendChild(option)
        this.#escolaridad.value = this.#escolaridadActual.id_escolaridad
      }
    }
  /*
    const etnia = await this.#api.getEtniaByID(this.#promovente.promovente.etnia.id_etnia)
    this.#etniaActual = etnia

    const escolaridad = await this.#api.getEscolaridadByID(this.#promovente.promovente.escolaridad.id_escolaridad)
    this.#escolaridadActual = escolaridad


    const ocupacion = await this.#api.getOcupacionByID(this.#promovente.promovente.ocupacion.id_ocupacion)
    this.#ocupacionActual = ocupacion

      */
    try {
      const ocupacion = await this.#api.getOcupacionByID(this.#promovente.promovente.ocupacion.id_ocupacion)
      this.#ocupacionActual = ocupacion
    }

    catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }

    if (this.#ocupaciones === undefined) {
      const option = document.createElement('option')
      option.value = this.#ocupacionActual.id_ocupacion
      option.text = this.#ocupacionActual.descripcion_ocupacion
      this.#ocupacion.appendChild(option)
      this.#ocupacion.value = this.#ocupacionActual.id_ocupacion
    }

    else {
      let existe = false
      for (let i = 0; i < this.#ocupaciones.length; i++) {
        if (this.#ocupaciones[i].id_ocupacion === this.#ocupacionActual.id_ocupacion) {
          existe = true
          break
        }
      }

      if (existe === false) {
        const option = document.createElement('option')
        option.value = this.#ocupacionActual.id_ocupacion
        option.text = this.#ocupacionActual.descripcion_ocupacion
        this.#ocupacion.appendChild(option)
        this.#ocupacion.value = this.#ocupacionActual.id_ocupacion
      }
    }

    
     
  }


  //Metodo que maneja los campos del formulario
  manageFormFields() {
    this.#editablePromovente = this.shadowRoot.getElementById('cbx-editable-promovente')
    this.#botonBuscarCP = this.shadowRoot.getElementById('buscar-cp')
    this.#nombre = this.shadowRoot.getElementById('nombre')
    this.#apellidoPaterno = this.shadowRoot.getElementById('apellido-paterno')
    this.#apellidoMaterno = this.shadowRoot.getElementById('apellido-materno')
    this.#edad = this.shadowRoot.getElementById('edad')
    this.#sexo = this.shadowRoot.getElementById('sexo')
    this.#telefono = this.shadowRoot.getElementById('telefono')
    this.#españolRadioYes = this.shadowRoot.getElementById('español-radio-yes')
    this.#españolRadioNo = this.shadowRoot.getElementById('español-radio-no')
    this.#etnia = this.shadowRoot.getElementById('etnia')
    this.#escolaridad = this.shadowRoot.getElementById('escolaridad')
    this.#ocupacion = this.shadowRoot.getElementById('ocupacion')
    this.#calle = this.shadowRoot.getElementById('calle')
    this.#numeroExt = this.shadowRoot.getElementById('numero-ext')
    this.#numeroInt = this.shadowRoot.getElementById('numero-int')
    this.#colonia = this.shadowRoot.getElementById('colonia')
    this.#cp = this.shadowRoot.getElementById('codigo-postal')
    this.#municipio = this.shadowRoot.getElementById('municipio')
    this.#estado = this.shadowRoot.getElementById('estado')
    this.#ciudad = this.shadowRoot.getElementById('ciudad')
    this.#españolRadioYes = this.shadowRoot.getElementById('español-radio-yes')
    this.#españolRadioNo = this.shadowRoot.getElementById('español-radio-no')

    const yes = this.#españolRadioYes
    yes.checked = true

    const yesPromovente = this.#editablePromovente
    yesPromovente.checked = false

    this.#editablePromovente.checked = false

    this.#editablePromovente.addEventListener('change', () => {
      if (this.#editablePromovente.checked) {
        this.#nombre.disabled = false
        this.#botonBuscarCP.disabled = false
        this.#apellidoPaterno.disabled = false
        this.#apellidoMaterno.disabled = false
        this.#edad.disabled = false
        this.#telefono.disabled = false
        this.#españolRadioYes.disabled = false
        this.#españolRadioNo.disabled = false
        this.#etnia.disabled = false
        this.#escolaridad.disabled = false
        this.#ocupacion.disabled = false
        this.#calle.disabled = false
        this.#numeroExt.disabled = false
        this.#numeroInt.disabled = false
        this.#colonia.disabled = false
        this.#cp.disabled = false
      } else {
        this.#botonBuscarCP.disabled = true
        this.#nombre.disabled = true
        this.#apellidoPaterno.disabled = true
        this.#apellidoMaterno.disabled = true
        this.#edad.disabled = true
        this.#sexo.disabled = true
        this.#telefono.disabled = true
        this.#españolRadioYes.disabled = true
        this.#españolRadioNo.disabled = true
        this.#etnia.disabled = true
        this.#escolaridad.disabled = true
        this.#ocupacion.disabled = true
        this.#calle.disabled = true
        this.#numeroExt.disabled = true
        this.#numeroInt.disabled = true
        this.#colonia.disabled = true
        this.#cp.disabled = true
        this.#municipio.disabled = true
        this.#estado.disabled = true
        this.#ciudad.disabled = true
      }
    })

    var nombreInput = this.#nombre;
    var apellidoPaternoInput = this.#apellidoPaterno;
    var apellidoMaternoInput = this.#apellidoMaterno;
    // Agregar un evento 'input' al campo de entrada para validar en tiempo real
    nombreInput.addEventListener('input', function () {
      var nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;


      if (!nombrePattern.test(nombreInput.value)) {
        // Si el campo contiene caracteres no válidos, lanzar una excepción

        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El nombre solo permite letras, verifique su respuesta.'
        modal.title = 'Error de validación'
        modal.open = true

      } else if (nombreInput.value.length > 50) {
        // Si el campo tiene más de 50 caracteres, lanzar una excepción
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { })

        modal.message = 'El nombre no puede tener más de 50 caracteres, por favor ingréselo correctamente.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });

    apellidoPaternoInput.addEventListener('input', function () {
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      if (!apellidoPattern.test(apellidoPaternoInput.value)) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { })

        modal.message = 'El apellido paterno solo permite letras, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (apellidoPaternoInput.value.length > 50) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { })

        modal.message = 'El apellido paterno no puede tener más de 50 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;

      }
    });

    apellidoMaternoInput.addEventListener('input', function () {
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      if (!apellidoPattern.test(apellidoMaternoInput.value)) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { })

        modal.message = 'El apellido materno solo permite letras, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (apellidoMaternoInput.value.length > 50) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { })

        modal.message = 'El apellido materno no puede tener más de 50 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    }
    );

    var edadInput = this.#edad;

    edadInput.addEventListener('input', function () {
      var edadPattern = /^\d+$/;

      if (!edadPattern.test(edadInput.value)) {
        if (edadInput.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { })

          modal.message = 'La edad no puede estar vacía, por favor ingresela.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { })

          modal.message = 'La edad solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      } else if (edadInput.value > 200) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { })

        modal.message = 'La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

    var telefonoInput = this.#telefono;

    telefonoInput.addEventListener('input', function () {
      var telefonoPattern = /^\d+$/;

      if (!telefonoPattern.test(telefonoInput.value)) {
        if (telefonoInput.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { })

          modal.message = 'El teléfono no puede estar vacío, por favor ingréselo.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { })

          modal.message = 'El teléfono solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      } else if (telefonoInput.value.length > 10) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { })

        modal.message = 'El teléfono no puede tener más de 10 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

  }

  //Metodo que se encarga de llenar los inputs
  fillInputs() {
    //Obtencion de los datos del promovente
    this.#promovente = this.registroTab.data.promovente
    this.#promventeDomicilio = this.#promovente.domicilio
    this.#etnia.innerHTML = ''

    //Creacion de un option para el select
    const option = document.createElement('option')
    option.value = 0
    option.text = 'Seleccione una etnia'
    this.#etnia.appendChild(option)


    //Recorrido de las etnias para llenar el select
    try {

      this.#etnias.forEach(etnia => {
        const option = document.createElement('option')
        option.value = etnia.id_etnia
        option.text = etnia.nombre
        this.#etnia.appendChild(option)
      })


    } catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }

    //Limpiar el select de generos
    this.#sexo.innerHTML = ''

    //Creacion de un option para el select
    const optionGenero = document.createElement('option')
    optionGenero.value = 0
    optionGenero.text = 'Seleccione un género'
    this.#sexo.appendChild(optionGenero)

    //Recorrido de los generos para llenar el select
    try {
      this.#generos.forEach(genero => {
        const option = document.createElement('option')
        option.value = genero.id_genero
        option.text = genero.descripcion_genero
        this.#sexo.appendChild(option)
      })
    } catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }


    //Limpiar el select de escolaridades
    this.#escolaridad.innerHTML = ''

    //Creacion de un option para el select
    const optionEscolaridad = document.createElement('option')
    optionEscolaridad.value = 0
    optionEscolaridad.text = 'Seleccione una escolaridad'
    this.#escolaridad.appendChild(optionEscolaridad)

    //Recorrido de las escolaridades para llenar el select
    try {
      this.#escolaridades.forEach(escolaridad => {
        const option = document.createElement('option')
        option.value = escolaridad.id_escolaridad
        option.text = escolaridad.descripcion
        this.#escolaridad.appendChild(option)
      })
    } catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }

    //Limpiar el select de ocupaciones
    this.#ocupacion.innerHTML = ''


    //Creacion de un option para el select
    const optionOcupacion = document.createElement('option')
    optionOcupacion.value = 0
    optionOcupacion.text = 'Seleccione una ocupación'
    this.#ocupacion.appendChild(optionOcupacion)


    //Recorrido de las ocupaciones para llenar el select
    try {
      this.#ocupaciones.forEach(ocupacion => {
        const option = document.createElement('option')
        option.value = ocupacion.id_ocupacion
        option.text = ocupacion.descripcion_ocupacion
        this.#ocupacion.appendChild(option)
      })
    } catch (error) {
      console.error('Error al obtener datos de la API:', error)
    }

    //Obtencion de los datos del promovente y llenado de los inputs
    this.#nombre.value = this.#promovente.nombre
    this.#apellidoPaterno.value = this.#promovente.apellido_paterno
    this.#apellidoMaterno.value = this.#promovente.apellido_materno
    this.#edad.value = this.#promovente.edad
    this.#telefono.value = this.#promovente.telefono
   // this.#sexo.value = this.#promovente.id_genero
    // this.#etnia.value = this.#promovente.promovente.etnia.id_etnia
    // this.#escolaridad.value = this.#promovente.promovente.escolaridad.id_escolaridad
    // this.#ocupacion.value = this.#promovente.promovente.ocupacion.id_ocupacion


    //
    if (this.#promovente.promovente.español === true) {
      this.#españolRadioYes.checked = true
    } else {
      this.#españolRadioNo.checked = true
    }

    this.#calle.value = this.#promventeDomicilio.calle_domicilio
    this.#numeroExt.value = this.#promventeDomicilio.numero_exterior_domicilio
    this.#numeroInt.value = this.#promventeDomicilio.numero_interior_domicilio

    //Obtencion de la colonia por id
    this.#api.getColoniaById(this.#promventeDomicilio.id_colonia)
      .then(data => {
        const { colonia } = data
        this.#cp.value = colonia.codigo_postal.codigo_postal
        this.#municipio.value = colonia.municipio.nombre_municipio
        this.#estado.value = colonia.estado.nombre_estado
        this.#ciudad.value = colonia.ciudad.nombre_ciudad
        this.#api.getDomicilioByCP(colonia.codigo_postal.codigo_postal)
          .then(data2 => {
            const { colonias } = data2
            this.#colonia.innerHTML = ''
            const option = document.createElement('option')
            option.value = 0
            option.text = 'Seleccione una colonia'
            this.#colonia.appendChild(option)


            colonias.colonias.forEach(colonia => {
              const option = document.createElement('option')
              option.value = colonia.id_colonia
              option.text = colonia.nombre_colonia
              this.#colonia.appendChild(option)
            })
            this.#colonia.value = this.#promventeDomicilio.id_colonia
          })
          .catch(error => {
            console.error('Error al obtener datos de la API:', error);
          });
      })
      .catch(error => {
        console.error('Error al obtener datos de la API:', error);
      });


  }


  //Metodo encargado de validar los inputs
  validateInputs() {
    try {

      //Obtencion de los valores de los inputs
      const nombre = this.#nombre.value
      const apellidoPaterno = this.#apellidoPaterno.value
      const apellidoMaterno = this.#apellidoMaterno.value
      const edad = this.#edad.value
      const sexo = this.#sexo.value
      const telefono = this.#telefono.value
      const calle = this.#calle.value
      const numeroExt = this.#numeroExt.value
      const numeroInt = this.#numeroInt.value
      const colonia = this.#colonia.value
      var nombresApellidos = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      var edadPattern = /^\d+$/;


      //Verificacion de que si el nombre esta vacio, si es mayor a 50 caracteres y si solo contiene letras
      if (nombre === '') {
        throw new ValidationError('El nombre no puede estar vacío, por favor ingréselo.')
      } else if (nombre.length > 50) {
        throw new ValidationError('El nombre no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      } else if (!nombresApellidos.test(nombre)) {
        throw new ValidationError('El nombre solo permite letras, verifique su respuesta.')
      }

      //Verificacion de que si el apellido paterno esta vacio, si es mayor a 50 caracteres y si solo contiene letras
      if (apellidoPaterno === '') {
        throw new ValidationError('El apellido paterno no puede estar vacío, por favor ingréselo.')
      }
      else if (apellidoPaterno.length > 50) {
        throw new ValidationError('El apellido paterno no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      } else if (!nombresApellidos.test(apellidoPaterno)) {
        throw new ValidationError('El apellido paterno solo permite letras, verifique su respuesta.')
      }

      //Verificacion de que si el apellido materno esta vacio, si es mayor a 50 caracteres y si solo contiene letras
      if (apellidoMaterno === '') {
        throw new ValidationError('El apellido materno no puede estar vacío, por favor ingréselo.')

      } else if (apellidoMaterno.length > 50) {
        throw new ValidationError('El apellido materno no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      }
      else if (!nombresApellidos.test(apellidoMaterno)) {
        throw new ValidationError('El apellido materno solo permite letras, verifique su respuesta.')
      }

      //Verificacion de que si la edad esta vacia, si es mayor a 200 años y si solo contiene numeros
      if (edad === '') {
        throw new ValidationError('La edad no puede estar vacía, por favor ingresela.')
      }
      else if (!edadPattern.test(edad)) {
        throw new ValidationError('La edad solo permite números, verifique su respuesta.')
      } else if (edad > 200) {
        throw new ValidationError('La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.')
      }

      // Verificacion de que si el telefono esta vacio, si es mayor a 10 caracteres y si solo contiene numeros
      if (telefono === '') {
        throw new ValidationError('El teléfono no puede estar vacío, por favor ingréselo.')
      }
      else if (telefono.length > 10) {
        throw new ValidationError('El teléfono no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
      }
      else if (!edadPattern.test(telefono)) {
        throw new ValidationError('El teléfono solo permite números, verifique su respuesta.')
      }

      //Obtencion de los valores de los selects
      var etnia = this.#etnia.value
      var escolaridad = this.#escolaridad.value
      var ocupacion = this.#ocupacion.value
      var espapñolRadioYes = this.#españolRadioYes.checked
      var espapñolRadioNo = this.#españolRadioNo.checked

      //Verificacion de que si el select de español esta vacio
      if (espapñolRadioNo === false && espapñolRadioYes === false) {
        throw new ValidationError('Por favor seleccione si habla español o no.')
      }


      //Verificacion de que si el select de etnia esta vacio
      if (etnia === '0') {
        throw new ValidationError('Por favor seleccione una etnia.')
      }

      //Verificacion de que si el select de escolaridad esta vacio
      if (escolaridad === '0') {
        throw new ValidationError('Por favor seleccione una escolaridad.')
      }

      //Verificacion de que si el select de ocupacion esta vacio
      if (ocupacion === '0') {
        throw new ValidationError('Por favor seleccione una ocupación.')
      }

      //Verificacion de que si la calle esta vacia, si es mayor a 100 caracteres
      if (calle === '') {
        throw new ValidationError('La calle no puede estar vacía, por favor ingrésela.')
      }
      else if (calle.length > 100) {
        throw new ValidationError('La calle no puede tener más de 100 caracteres, por favor ingrésela correctamente.')
      }

      //Verificacion de que si el numero exterior esta vacio, si es mayor a 10 caracteres y si solo contiene numeros
      if (numeroExt === '') {
        throw new ValidationError('El número exterior no puede estar vacío, por favor ingréselo.')
      }
      else if (numeroExt.length > 10) {
        throw new ValidationError('El número exterior no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
      }
      else if (!edadPattern.test(numeroExt)) {
        throw new ValidationError('El número exterior solo permite números, verifique su respuesta.')
      }

      //En caso de que el numero interior no este vacio, si es mayor a 10 caracteres y si solo contiene numeros
      if (numeroInt !== '') {
        if (numeroInt.length > 10) {
          throw new ValidationError('El número interior no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
        }
        else if (!edadPattern.test(numeroInt)) {
          throw new ValidationError('El número interior solo permite números, verifique su respuesta.')
        }
      }

      //Verificacion de que si la colonia esta vacia
      if (colonia === '0') {
        throw new ValidationError('Por favor busque una colonia y selecciónela, por favor.')
      }

      return true
    } catch (error) {
      //Manejo de errores
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

  //Busqueda de codigo postal
  async searchCP() {
    try {
      //Obtencion de los datos de la api
      const { colonias: data } = await this.#api.getDomicilioByCP(
        this.#cp.value
      )
      //En caso de que no se encuentre el codigo postal
      if (!data || typeof data === 'string') {
        this.#showModal('No se encontró el código postal', 'Advertencia')
        return
      }
      //Obtencion de los datos de la colonia y llenado de los inputs
      this.#estado.innerHTML = '';
      this.#estado.value = data.estado.nombre_estado
      this.#municipio.innerHTML = '';
      this.#municipio.value = data.municipio.nombre_municipio
      this.#ciudad.innerHTML = '';
      this.#ciudad.value = data.ciudad.nombre_ciudad
      this.#colonia.innerHTML = '';

      //Creacion de un option para el select
      const option = document.createElement('option')
      option.value = 0
      option.text = 'Seleccione una colonia'
      this.#colonia.appendChild(option)

      //Recorrido de las colonias para llenar el select
      data.colonias.forEach(colonia => {
        const option = document.createElement('option')
        option.value = colonia.id_colonia
        option.textContent = colonia.nombre_colonia
        this.#colonia.appendChild(option)
      })
    } catch (error) {
      console.error(error)
      this.#showModal('Error al buscar el código postal', 'Error')
    }
  }

  //Metodo que se encarga de observar los cambios en los atributos
  async campos() {
    //Obtencion del boton de siguiente
    this.btnNext = this.shadowRoot.getElementById('btn-promovente-next')

    //Añadir un evento al boton de siguiente
    this.btnNext.addEventListener('click', () => {
      if (!this.validateInputs()) return
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'demandado' },
      })
      this.dispatchEvent(event)
    })

    //Añadir un evento al boton de atras 
    document.addEventListener('tab-change', event => {
      const tabId = event.detail.tabId
      //Verifacion que es realizada con el fin de saber si se ha selecionado ya algun proceso, en caso de que no se haya seleccionado se muestra un mensaje
      //y en caso de haya seleccionado uno diferente al que se tenia se actualiza el proceso
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

  //Muestra un modal de advertencia
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.setOnCloseCallback(() => { })

    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }
}

customElements.define('promovente-full-tab', PromoventeTab)
