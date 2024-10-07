import { ValidationError } from '../../lib/errors.js'
import { validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model.js'
//  import '../codigo-postal/codigo-postal.js'


export class PromoventeTab extends HTMLElement {

  //Variables de la clase 
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

  #promovente
  #promventeDomicilio
  #tipoJuicio

  #busquedaCp
  #generos
  #turnoSeleccionado = null
  #generoActual

  //Metodo get que se obtiene el data
  set data(value) {
    this.setAttribute('data', value)
  }
  //Metodo get que se obtiene el id 
  get id() {
    return this.getAttribute('id')
  }

  //Metodo set que se establece el id
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo para verificar si el componente esta completo
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

  //Metodo que establece las variables observadas 
  static get observedAttributes() {
    return ['id', 'data']
  }


  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/proceso/promovente-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Componentes 
    this.registroTab = document.querySelector('registro-full-tab')

    //Variable que se encarga de buscar el codigo postal o que almacena el html con el id buscar-cp
    this.formCP = this.shadowRoot.getElementById('buscar-cp')

    //Asignacion de eventos a la variable formCP para la busqueda del codigo postal y la informacion del mismo
    this.formCP.addEventListener('click', (event) => {
      event.preventDefault();
      if (
        !this.#cp.value ||
        this.#cp.value.length !== 5 ||
        //Validacion de que el codigo postal sea un numero
        isNaN(this.#cp.value)
      ) {
        //Mensaje de advertencia si el codigo postal no es valido
        this.#showModal('El código postal debe tener 5 dígitos', 'Advertencia')
        return
      }
      //Llamado al metodo searchCP
      this.searchCP()
    })
    await this.campos()

  }
  //Constructor de la clase
  constructor() {
    super()
    //ID con respecto al manejo de las tabs
    this.id = 'promovente'
    this.style.display = 'none'
    this.init2()


  }


  //Obtencion de los datos
  async obtencionDatos() {
    try {
      const etnias = await this.#api.getEtnias2()
      this.#etnias = etnias
    }
    catch (error) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      });
      modal.message = 'Error al cargar los datos de etnia, por favor intenta de nuevo habilitarlos o ingresar nuevos datos.'
      modal.title = 'Error'
      modal.open = true
    }
    try {
      const escolaridades = await this.#api.getEscolaridades2()
      this.#escolaridades = escolaridades
    } catch (error) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      });
      modal.message = 'Error al cargar los datos de escolaridad, por favor intenta de nuevo habilitarlos o ingresar nuevos datos.'
      modal.title = 'Error'
      modal.open = true

    }

    try {

      const ocupaciones = await this.#api.getOcupaciones2()
      this.#ocupaciones = ocupaciones

    } catch (error) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      }
      );
      modal.message = 'Error al cargar los datos de ocupación, por favor intenta de nuevo habilitarlos o ingresar nuevos datos.'
      modal.title = 'Error'
      modal.open = true

    }
    try {
      const { generos } = await this.#api.getGeneros2()
      this.#generos = generos
    } catch (error) {

    }
  }

  //Metodo que se encarga de inicializar diferentes variables y metodos
  async init() {
    this.#api = new APIModel()
    //Llamado al metodo obtencionDatos
    await this.obtencionDatos()
    //Llamado al metodo que se encarga de manejar los campos del formulario
    this.manageFormFields()
    //Llamado al metodo que se encarga de llenar los campos del formulario
    this.fillInputs()
    this.generoActual()
    //Llamado al metodo que se encarga de manejar los campos de texto y select genero
    this.manejadorEntradaTextoYSelect()
  }
 
  async generoActual(){
    // this.#promovente.genero.id_genero
       //Obtencion del genero actual
       try {
        const { genero } = await this.#api.getGeneroByID(this.#promovente.genero.id_genero)
        this.#generoActual = genero
     //   console.log(this.#generos)
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
  
  
  }

  async manejadorEntradaTextoYSelect() {
    //Variables de entrada de texto para asignarle un evento
    var nombreInput = this.#nombre;
    var apellidoPaternoInput = this.#apellidoPaterno;
    var apellidoMaternoInput = this.#apellidoMaterno;
    var edadInput = this.#edad;

    // Agregar un evento 'input' al campo de entrada para validar en tiempo real
    nombreInput.addEventListener('input', function () {
      var nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      if (!nombrePattern.test(nombreInput.value)) {
        // Si el campo contiene caracteres no válidos, lanzar una excepción

        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

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

    //Evento de entrada de texto para el apellido paterno
    apellidoPaternoInput.addEventListener('input', function () {
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

      if (!apellidoPattern.test(apellidoPaternoInput.value)) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido paterno solo permite letras, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (apellidoPaternoInput.value.length > 50) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido paterno no puede tener más de 50 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

    //Evento de entrada de texto para el apellido materno
    apellidoMaternoInput.addEventListener('input', function () {
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      if (!apellidoPattern.test(apellidoMaternoInput.value)) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido materno solo permite letras, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (apellidoMaternoInput.value.length > 50) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido materno no puede tener más de 50 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

    //Evento de entrada de texto para la edad
    edadInput.addEventListener('input', function () {
      var edadPattern = /^\d+$/;
      if (!edadPattern.test(edadInput.value)) {
        if (edadInput.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });

          modal.message = 'La edad no puede estar vacía, por favor ingresela.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });

          modal.message = 'La edad solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      } else if (edadInput.value > 200) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });


  }

  //Metodo que se encarga de llenar los campos del formulario
  fillInputs() {
    //Limpia del select etnia
    this.#etnia.innerHTML = ''

    //Option de etnia por defecto
    const option = document.createElement('option')
    option.value = '0'
    option.text = 'Seleccione una etnia'
    this.#etnia.appendChild(option)

    //Se recorre el array de etnias y se agregan al select
    this.#etnias.forEach(etnia => {
      const option = document.createElement('option')
      option.value = etnia.id_etnia
      option.text = etnia.nombre
      this.#etnia.appendChild(option)
    })

    //Limpia del select sexo
    this.#sexo.innerHTML = ''

    //Option de sexo por defecto
    const option2 = document.createElement('option')
    option2.value = '0'
    option2.text = 'Seleccione un género'
    this.#sexo.appendChild(option2)

    try {
      //Se recorre el array de generos y se agregan al select
      this.#generos.forEach(genero => {
        const option = document.createElement('option')
        option.value = genero.id_genero
        option.text = genero.descripcion_genero
        this.#sexo.appendChild(option)
      })
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }

    //Limpia del select escolaridad
    this.#escolaridad.innerHTML = ''

    //Option de escolaridad por defecto
    const option3 = document.createElement('option')
    option3.value = '0'
    option3.text = 'Seleccione una escolaridad'
    this.#escolaridad.appendChild(option3)

    //Se recorre el array de escolaridades y se agregan al select
    this.#escolaridades.forEach(escolaridad => {
      const option = document.createElement('option')
      option.value = escolaridad.id_escolaridad
      option.text = escolaridad.descripcion
      this.#escolaridad.appendChild(option)
    })

    //Limpia del select ocupacion
    this.#ocupacion.innerHTML = ''

    //Option de ocupacion por defecto
    const option4 = document.createElement('option')
    option4.value = '0'
    option4.text = 'Seleccione una ocupación'
    this.#ocupacion.appendChild(option4)

    //Se recorre el array de ocupaciones y se agregan al select
    this.#ocupaciones.forEach(ocupacion => {
      const option = document.createElement('option')
      option.value = ocupacion.id_ocupacion
      option.text = ocupacion.descripcion_ocupacion
      this.#ocupacion.appendChild(option)
    })


    //Asignacion de variables de clase con respecto a los componentes y la informacion de los mismos
    this.#turno = this.registroTab.data
    const { turno } = this.#turno;
    this.#promovente = turno.asesoria.persona
    this.#promventeDomicilio = turno.asesoria.persona.domicilio
    this.#tipoJuicio = turno.asesoria.tipos_juicio

    this.#nombre.value = this.#promovente.nombre
    this.#apellidoPaterno.value = this.#promovente.apellido_paterno
    this.#apellidoMaterno.value = this.#promovente.apellido_materno
    this.#edad.value = this.#promovente.edad
    this.#telefono.value = this.#promovente.telefono
   //  this.#sexo.value = this.#promovente.genero.id_genero


    this.#calle.value = this.#promventeDomicilio.calle_domicilio
    this.#numeroExt.value = this.#promventeDomicilio.numero_exterior_domicilio
    this.#numeroInt.value = this.#promventeDomicilio.numero_interior_domicilio

    //Este es con el fin de que se muestre la colonia seleccionada y los datos del codigo postal
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



  //Metodo  que se encarga de manejar los campos del formulario y eventos de texto
  manageFormFields() {
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

    var telefonoInput = this.#telefono;
    var edadInput = this.#edad;
    var nombreInput = this.#nombre;
    var apellidoPaternoInput = this.#apellidoPaterno;
    var apellidoMaternoInput = this.#apellidoMaterno;
    // Agregar un evento 'input' al campo de entrada para validar en tiempo real
    nombreInput.addEventListener('input', function () {
      var nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

      if (!nombrePattern.test(nombreInput.value)) {
        // Si el campo contiene caracteres no válidos, lanzar una excepción

        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El nombre solo permite letras, verifique su respuesta.'
        modal.title = 'Error de validación'
        modal.open = true

      } else if (nombreInput.value.length > 50) {
        // Si el campo tiene más de 50 caracteres, lanzar una excepción
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'El nombre no puede tener más de 50 caracteres, por favor ingréselo correctamente.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });


    // Agregar un evento 'input' al campo de entrada de apellido paterno para validar en tiempo real
    apellidoPaternoInput.addEventListener('input', function () {
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      if (!apellidoPattern.test(apellidoPaternoInput.value)) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido paterno solo permite letras, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (apellidoPaternoInput.value.length > 50) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido paterno no puede tener más de 50 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;

      }
    });


    // Agregar un evento 'input' al campo de entrada de apellido materno para validar en tiempo real
    apellidoMaternoInput.addEventListener('input', function () {
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      if (!apellidoPattern.test(apellidoMaternoInput.value)) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido materno solo permite letras, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (apellidoMaternoInput.value.length > 50) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El apellido materno no puede tener más de 50 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    }
    );



    // Agregar un evento 'input' al campo de entrada de edad para validar en tiempo real
    edadInput.addEventListener('input', function () {
      var edadPattern = /^\d+$/;
      if (!edadPattern.test(edadInput.value)) {
        if (edadInput.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });

          modal.message = 'La edad no puede estar vacía, por favor ingresela.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });

          modal.message = 'La edad solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      } else if (edadInput.value > 200) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

    // Agregar un evento 'input' al campo de entrada de telefono para validar en tiempo real
    telefonoInput.addEventListener('input', function () {
      var telefonoPattern = /^\d+$/;
      if (!telefonoPattern.test(telefonoInput.value)) {
        if (telefonoInput.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });

          modal.message = 'El teléfono no puede estar vacío, por favor ingréselo.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => { });

          modal.message = 'El teléfono solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      } else if (telefonoInput.value.length > 10) {
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { });

        modal.message = 'El teléfono no puede tener más de 10 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

  }


  //Metodo que se encarga de validar los datos del formulario
  validateInputs() {
    try {
      //Se valida si el turno esta seleccionado
      if (this.registroTab.isComplete === false) {
        this.#showModal('No se ha seleccionado un turno, por favor seleccione uno.', 'Error de validación')
        return false
      }

      //Asignacion de variables de clase con respecto a los componentes y la informacion de los mismos
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


      //Se verifica si los campos no estan vacios, si no tienen mas de 50 caracteres y si solo permiten letras en este caso del nombre
      if (nombre === '') {
        throw new ValidationError('El nombre no puede estar vacío, por favor ingréselo.')
      } else if (nombre.length > 50) {
        throw new ValidationError('El nombre no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      } else if (!nombresApellidos.test(nombre)) {
        throw new ValidationError('El nombre solo permite letras, verifique su respuesta.')
      }

      // Se verifica si los campos no estan vacios, si no tienen mas de 50 caracteres y si solo permiten letras en este caso del apellido paterno
      if (apellidoPaterno === '') {
        throw new ValidationError('El apellido paterno no puede estar vacío, por favor ingréselo.')
      }
      else if (apellidoPaterno.length > 50) {
        throw new ValidationError('El apellido paterno no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      } else if (!nombresApellidos.test(apellidoPaterno)) {
        throw new ValidationError('El apellido paterno solo permite letras, verifique su respuesta.')
      }

      // Se verifica si los campos no estan vacios, si no tienen mas de 50 caracteres y si solo permiten letras en este caso del apellido materno
      if (apellidoMaterno === '') {
        throw new ValidationError('El apellido materno no puede estar vacío, por favor ingréselo.')

      } else if (apellidoMaterno.length > 50) {
        throw new ValidationError('El apellido materno no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      }
      else if (!nombresApellidos.test(apellidoMaterno)) {
        throw new ValidationError('El apellido materno solo permite letras, verifique su respuesta.')
      }

      // Se verifica si los campos no estan vacios, si solo permiten numeros y si la edad no es mayor a 200
      if (edad === '') {
        throw new ValidationError('La edad no puede estar vacía, por favor ingresela.')
      }
      else if (!edadPattern.test(edad)) {
        throw new ValidationError('La edad solo permite números, verifique su respuesta.')
      } else if (edad > 200) {
        throw new ValidationError('La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.')
      }

      //Se valida si el campo de telefono no esta vacio, si solo permite numeros y si no tiene mas de 10 caracteres
      if (telefono === '') {
        throw new ValidationError('El teléfono no puede estar vacío, por favor ingréselo.')
      }
      else if (telefono.length > 10) {
        throw new ValidationError('El teléfono no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
      }
      else if (!edadPattern.test(telefono)) {
        throw new ValidationError('El teléfono solo permite números, verifique su respuesta.')
      }



      //Validaciones con respecto a la etnia, escolaridad, ocupacion, calle, numero exterior, numero interior y colonia
      var etnia = this.#etnia.value
      var escolaridad = this.#escolaridad.value
      var ocupacion = this.#ocupacion.value
      var espapñolRadioYes = this.#españolRadioYes.checked
      var espapñolRadioNo = this.#españolRadioNo.checked

      //Se verifica si el radio de español esta seleccionado
      if (espapñolRadioNo === false && espapñolRadioYes === false) {
        throw new ValidationError('Por favor seleccione si habla español o no.')
      }

      //Se verifica si los campos de etnia, escolaridad y ocupacion no estan vacios
      //Aqui se verifica si la etnia se le ha seleccionado una opcion diferente a la por defecto
      if (etnia === '0') {
        throw new ValidationError('Por favor seleccione una etnia.')
      }

      //Aqui se verifica si la escolaridad se le ha seleccionado una opcion diferente a la por defecto
      if (escolaridad === '0') {
        throw new ValidationError('Por favor seleccione una escolaridad.')
      }

      //Aqui se verifica si la ocupacion se le ha seleccionado una opcion diferente a la por defecto
      if (ocupacion === '0') {
        throw new ValidationError('Por favor seleccione una ocupación.')
      }

      //Se verifica si los campos de calle, numero exterior, numero interior y colonia no estan vacios

      //Aca se verifica si la calle no esta vacia y si no tiene mas de 100 caracteres
      if (calle === '') {
        throw new ValidationError('La calle no puede estar vacía, por favor ingrésela.')
      }
      else if (calle.length > 100) {
        throw new ValidationError('La calle no puede tener más de 100 caracteres, por favor ingrésela correctamente.')
      }


      //Aca se verifica si el numero exterior no esta vacio, si no tiene mas de 10 caracteres y si solo permite numeros
      if (numeroExt === '') {
        throw new ValidationError('El número exterior no puede estar vacío, por favor ingréselo.')
      }
      else if (numeroExt.length > 10) {
        throw new ValidationError('El número exterior no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
      }
      else if (!edadPattern.test(numeroExt)) {
        throw new ValidationError('El número exterior solo permite números, verifique su respuesta.')
      }


      //En caso de que el numero interior no este vacio, si no tiene mas de 10 caracteres y si solo permite numeros
      if (numeroInt !== '') {
        if (numeroInt.length > 10) {
          throw new ValidationError('El número interior no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
        }
        else if (!edadPattern.test(numeroInt)) {
          throw new ValidationError('El número interior solo permite números, verifique su respuesta.')
        }
      }

      //Se verifica si la colonia se le ha seleccionado una opcion diferente a la por defecto
      if (colonia === '0') {
        throw new ValidationError('Por favor busque una colonia y selecciónela, por favor.')
      }

      //En caso de que todo este correcto se retorna true
      return true
    } catch (error) {
      //Se manejan los errores y se muestran los mensajes de error
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

  //Metodo que se encarga de buscar el codigo postal 
  async searchCP() {
    try {
      //Busqueda de la informacion del codigo postal
      const { colonias: data } = await this.#api.getDomicilioByCP(
        this.#cp.value
      )

      //En caso de que no se encuentre el codigo postal se muestra un mensaje de advertencia
      if (!data || typeof data === 'string') {
        this.#showModal('No se encontró el código postal', 'Advertencia')
        return
      }

      //Se limpian los campos de municipio, estado, ciudad y colonia
      //y se asignan los valores de municipio, estado, ciudad y colonia
      this.#estado.innerHTML = '';
      this.#estado.value = data.estado.nombre_estado
      this.#municipio.innerHTML = '';
      this.#municipio.value = data.municipio.nombre_municipio
      this.#ciudad.innerHTML = '';
      this.#ciudad.value = data.ciudad.nombre_ciudad
      this.#colonia.innerHTML = '';

      //Option de colonia por defecto
      const option = document.createElement('option')
      option.value = '0'
      option.text = 'Seleccione una colonia'
      this.#colonia.appendChild(option)

      //Se recorre el array de colonias y se agregan al select
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

  //Se conecta el componente
  async campos() {
    //Asignacion del boton de siguiente
    this.btnNext = this.shadowRoot.getElementById('btn-promovente-next')

    //Se le asigna un evento al boton de siguiente
    this.btnNext.addEventListener('click', () => {
      if (!this.validateInputs()) return
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'demandado' },
      })
      this.dispatchEvent(event)
    })
    //Manejo de los eventos de cambio de tab
    document.addEventListener('tab-change', event => {
      const tabId = event.detail.tabId
      if (tabId !== 'promovente') {
        return
      }
      //Condicion para validar si se ha seleccionado un turno, esto con el fin de establecer un turno cuando sea la primera vez
      // en caso de que se seleccione se rellenan los campos por defecto, en caso de se este diferente del actual se resetean los campos
      // y se rellenan los campos por defecto
      if (this.registroTab.isComplete === true) {
        if (this.#turnoSeleccionado === null) {
          this.#turnoSeleccionado = this.registroTab.turno
          this.init()
        }
        if (this.#turnoSeleccionado !== null && this.#turnoSeleccionado.id_turno !== this.registroTab.turno.id_turno) {
          this.#turnoSeleccionado = this.registroTab.turno
          this.resetCampos()
          this.init()
        }
      }

    })

  }

  //Metodo que se encarga de mostrar un modal
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.setOnCloseCallback(() => { })

    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }


  //Metodo que se encarga de resetear los campos del formulario
  resetCampos() {
    this.#nombre.value = ''
    this.#apellidoPaterno.value = ''
    this.#apellidoMaterno.value = ''
    this.#edad.value = ''
    this.#telefono.value = ''
    this.#sexo.value = ''
    this.#etnia.value = ''
    this.#escolaridad.value = ''
    this.#ocupacion.value = ''
    this.#calle.value = ''
    this.#numeroExt.value = ''
    this.#numeroInt.value = ''
    this.#colonia.innerHTML = ''
    const option = document.createElement('option')
    option.value = '0'
    option.text = 'Seleccione una colonia'
    this.#colonia.appendChild(option)


    this.#cp.value = ''
    this.#municipio.value = ''
    this.#estado.value = ''
    this.#ciudad.value = ''
    this.#españolRadioYes.checked = true
    this.#españolRadioNo.checked = false
  }

}

customElements.define('promovente-full-tab', PromoventeTab)
