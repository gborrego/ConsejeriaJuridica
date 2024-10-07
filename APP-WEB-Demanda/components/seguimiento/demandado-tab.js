import { ValidationError } from '../../lib/errors.js'
import { validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model.js'
//import '../codigo-postal/codigo-postal.js'



export class DemandadoTab extends HTMLElement {
  //Variables de la clase
  #api
  #nombre
  #apellidoPaterno
  #apellidoMaterno
  #edad
  #sexo
  #telefono
  #generoActual
  #editableDemandadoCheckbox
  #botonBuscarCP
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
  #procesoSelecionado = null

  #demandado
  #demandadoDomicilio

  //Metodo get que regresa los atributos que se observan
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo que get que regresa el valor del atributo id
  get id() {
    return this.getAttribute('id')
  }

  //Metodo que set que asigna el valor del atributo id
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que verifica si el componente esta completo
  get isComplete() {
    return this.validateInputs()
  }

  //Metodo que regresa los datos del demandado
  get data() {
    const demandado = {
      nombre: this.#nombre.value,
      apellido_paterno: this.#apellidoPaterno.value,
      apellido_materno: this.#apellidoMaterno.value,
      edad: this.#edad.value,
      telefono: this.#telefono.value,
      id_genero: this.#sexo.value,
      sexo: this.#sexo.options[this.#sexo.selectedIndex].text,
      domicilio: {
        id_domicilio: this.#demandadoDomicilio.id_domicilio,
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
      demandado
    }
  }

  //Metodo que asigna los datos del demandado
  set data(value) {
    this.setAttribute('data', value)
  }


  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/seguimiento/demandado-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));

    //Componentes del registro y promovente
    this.registroTab = document.querySelector('registro-full-tab')
    this.promoventeTab = document.querySelector('promovente-full-tab')

    //Obtencion del formulario de busqueda de codigo postal
    this.formCP = this.shadowRoot.getElementById('buscar-cp')

    //ASignacion de eventos a los elementos del formulario
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
    //ID del componente con respecto a las tabs
    this.id = 'demandado'
    this.style.display = 'none'
    this.init2()

  }

  //Metodo que inicializa los datos del imputads, vrianles,etc
  async init() {
    this.#api = new APIModel()
    this.datosGeneros()
    this.manageFormFields()
    this.fillInputs()
    this.generoActual()
  }
  async datosGeneros() {
    //Obtencion de los generos
    try {
      const { generos } = await this.#api.getGeneros2()
      //Asignacion de los generos
      this.#generos = generos
    } catch (error) {
      //  console.error('Error al obtener datos de la API:', error);
    }


  }

  async generoActual() {
    //Obtencion del genero actual
    try {
      console.log(this.#demandado)
      const { genero } = await this.#api.getGeneroByID(this.#demandado.id_genero)
      this.#generoActual = genero
      console.log(this.#generoActual)
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
    } else {
      //Verificar si el genero ya esta la lista de generos
      let existe = false
      for (let i = 0; i < this.#generos.length; i++) {
        if (this.#generos[i].id_genero === this.#generoActual.id_genero) {
          existe = true
          break
        }
      }

      if (existe === false) {
        const option = document.createElement('option')
        option.value = this.#generoActual.id_genero
        option.text = this.#generoActual.descripcion_genero
        this.#sexo.appendChild(option)
        this.#sexo.value = this.#generoActual.id_genero
      }
    }



  }
  //Metodo que maneja los campos del formulario
  manageFormFields() {

    this.#editableDemandadoCheckbox = this.shadowRoot.getElementById('cbx-editable-demandado')
    this.#botonBuscarCP = this.shadowRoot.getElementById('buscar-cp')

    this.#nombre = this.shadowRoot.getElementById('nombre')
    this.#apellidoPaterno = this.shadowRoot.getElementById('apellido-paterno')
    this.#apellidoMaterno = this.shadowRoot.getElementById('apellido-materno')
    this.#edad = this.shadowRoot.getElementById('edad')
    this.#sexo = this.shadowRoot.getElementById('sexo')
    this.#telefono = this.shadowRoot.getElementById('telefono')

    this.#calle = this.shadowRoot.getElementById('calle')
    this.#numeroExt = this.shadowRoot.getElementById('numero-ext')
    this.#numeroInt = this.shadowRoot.getElementById('numero-int')
    this.#colonia = this.shadowRoot.getElementById('colonia')
    this.#cp = this.shadowRoot.getElementById('codigo-postal')
    this.#municipio = this.shadowRoot.getElementById('municipio')
    this.#estado = this.shadowRoot.getElementById('estado')
    this.#ciudad = this.shadowRoot.getElementById('ciudad')
    //Llamada al metodo que maneja lo relacionado con el checkbox de editable del demandado   
    this.checboxEditableDemandado()
    //LLamada al metodo que maneja la entrada de texto en los campos
    this.manejadorEntradaTexto()
  }

  //Metodo que maneja el checkbox de editable del demandado, esto con el fin de que si se desea editar los campos del demandado
  //estos se habiliten , caso contrario se deshabiliten
  checboxEditableDemandado() {
    this.#editableDemandadoCheckbox.checked = false
    this.#editableDemandadoCheckbox.addEventListener('change', () => {
      if (this.#editableDemandadoCheckbox.checked) {
        this.#nombre.disabled = false
        this.#apellidoPaterno.disabled = false
        this.#apellidoMaterno.disabled = false
        this.#edad.disabled = false
        this.#telefono.disabled = false
        this.#calle.disabled = false
        this.#numeroExt.disabled = false
        this.#numeroInt.disabled = false
        this.#colonia.disabled = false
        this.#cp.disabled = false
      } else {
        this.#nombre.disabled = true
        this.#apellidoPaterno.disabled = true
        this.#apellidoMaterno.disabled = true
        this.#edad.disabled = true
        this.#sexo.disabled = true
        this.#telefono.disabled = true
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

  }

  manejadorEntradaTexto() {
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

    // Agregar un evento 'input' al campo de entrada para validar en tiempo real
    apellidoPaternoInput.addEventListener('input', function () {

      // Expresión regular para validar el apellido
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      // Si el campo contiene caracteres no válidos, lanzar una excepción
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

    // Agregar un evento 'input' al campo de entrada para validar en tiempo real
    apellidoMaternoInput.addEventListener('input', function () {
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      if (!apellidoPattern.test(apellidoMaternoInput.value)) {
        // Si el campo contiene caracteres no válidos, lanzar una excepción
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { })

        modal.message = 'El apellido materno solo permite letras, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (apellidoMaternoInput.value.length > 50) {
        // Si el campo tiene más de 50 caracteres, lanzar una excepción
        const modal = document.querySelector('modal-warning');
        modal.setOnCloseCallback(() => { })

        modal.message = 'El apellido materno no puede tener más de 50 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

    // Agregar un evento 'input' al campo de entrada para validar en tiempo real
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
  }

  //Metodo que senecarga de llenar los campos del formulario con los datos del demandado ,etc
  fillInputs() {
    //Limpia del select de generos
    this.#sexo.innerHTML = ''

    //Creacion de un option para el select de generos
    const optionGenero = document.createElement('option')
    optionGenero.value = '0'
    optionGenero.text = 'Seleccione un género'
    this.#sexo.appendChild(optionGenero)

    try {
      //Se recorren los generos para agregarlos al select
      this.#generos.forEach(genero => {
        const option = document.createElement('option')
        option.value = genero.id_genero
        option.text = genero.descripcion_genero
        this.#sexo.appendChild(option)
      })
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }

    //Se obtiene los datos del demandado y su domicilio y se agregan a las variables de la clase
    this.#demandado = this.registroTab.data.demandado
    this.#demandadoDomicilio = this.#demandado.domicilio

    this.#nombre.value = this.#demandado.nombre
    this.#apellidoPaterno.value = this.#demandado.apellido_paterno
    this.#apellidoMaterno.value = this.#demandado.apellido_materno
    this.#edad.value = this.#demandado.edad
    this.#telefono.value = this.#demandado.telefono
   //  this.#sexo.value = this.#demandado.id_genero


    this.#calle.value = this.#demandadoDomicilio.calle_domicilio
    this.#numeroExt.value = this.#demandadoDomicilio.numero_exterior_domicilio
    this.#numeroInt.value = this.#demandadoDomicilio.numero_interior_domicilio

    //Esto es con el fin de consultar los datos de la colonia del demandado
    this.#api.getColoniaById(this.#demandadoDomicilio.id_colonia)
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
            const optionColonia = document.createElement('option')
            optionColonia.value = '0'
            optionColonia.text = 'Seleccione una colonia'
            this.#colonia.appendChild(optionColonia)


            colonias.colonias.forEach(colonia => {
              const option = document.createElement('option')
              option.value = colonia.id_colonia
              option.text = colonia.nombre_colonia
              this.#colonia.appendChild(option)
            })
            this.#colonia.value = this.#demandadoDomicilio.id_colonia
          })
          .catch(error => {
            console.error('Error al obtener datos de la API:', error);
          });
      })
      .catch(error => {
        console.error('Error al obtener datos de la API:', error);
      });

  }

  //Metodo que se encarga de validar los campos del formulario
  validateInputs() {
    try {
      //Obtenemos los valores de los campos del formulario
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
      //Expresiones regulares para validar los campos
      var nombresApellidos = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
      var edadPattern = /^\d+$/;


      //Validacion del nombre si esta vacio, si tiene mas de 50 caracteres, si solo tiene letras
      if (nombre === '') {
        throw new ValidationError('El nombre no puede estar vacío, por favor ingréselo.')
      } else if (nombre.length > 50) {
        throw new ValidationError('El nombre no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      } else if (!nombresApellidos.test(nombre)) {
        throw new ValidationError('El nombre solo permite letras, verifique su respuesta.')
      }

      //Validacion del apellido paterno si esta vacio, si tiene mas de 50 caracteres, si solo tiene letras
      if (apellidoPaterno === '') {
        throw new ValidationError('El apellido paterno no puede estar vacío, por favor ingréselo.')
      }
      else if (apellidoPaterno.length > 50) {
        throw new ValidationError('El apellido paterno no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      } else if (!nombresApellidos.test(apellidoPaterno)) {
        throw new ValidationError('El apellido paterno solo permite letras, verifique su respuesta.')
      }

      //Validacion del apellido materno si esta vacio, si tiene mas de 50 caracteres, si solo tiene letras
      if (apellidoMaterno === '') {
        throw new ValidationError('El apellido materno no puede estar vacío, por favor ingréselo.')

      } else if (apellidoMaterno.length > 50) {
        throw new ValidationError('El apellido materno no puede tener más de 50 caracteres, por favor ingréselo correctamente.')
      }
      else if (!nombresApellidos.test(apellidoMaterno)) {
        throw new ValidationError('El apellido materno solo permite letras, verifique su respuesta.')
      }

      //Validacion de la edad si esta vacia, si solo tiene numeros, si es mayor a 200
      if (edad === '') {
        throw new ValidationError('La edad no puede estar vacía, por favor ingresela.')
      }
      else if (!edadPattern.test(edad)) {
        throw new ValidationError('La edad solo permite números, verifique su respuesta.')
      } else if (edad > 200) {
        throw new ValidationError('La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.')
      }

      //Validacion del telefono si esta vacio, si tiene mas de 10 caracteres, si solo tiene numeros
      if (telefono === '') {
        throw new ValidationError('El teléfono no puede estar vacío, por favor ingréselo.')
      }
      else if (telefono.length > 10) {
        throw new ValidationError('El teléfono no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
      }
      else if (!edadPattern.test(telefono)) {
        throw new ValidationError('El teléfono solo permite números, verifique su respuesta.')
      }

      //Validacion del sexo si esta vacio
      if (sexo === '0') {
        throw new ValidationError('Por favor seleccione un género.')
      }
      if (calle === '') {
        throw new ValidationError('La calle no puede estar vacía, por favor ingrésela.')
      }
      else if (calle.length > 100) {
        throw new ValidationError('La calle no puede tener más de 100 caracteres, por favor ingrésela correctamente.')
      }

      //Validacion del numero exterior si esta vacio, si tiene mas de 10 caracteres, si solo tiene numeros
      if (numeroExt === '') {
        throw new ValidationError('El número exterior no puede estar vacío, por favor ingréselo.')
      }
      else if (numeroExt.length > 10) {
        throw new ValidationError('El número exterior no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
      }
      else if (!edadPattern.test(numeroExt)) {
        throw new ValidationError('El número exterior solo permite números, verifique su respuesta.')
      }

      //En caso de que el numero interior no este vacio, si tiene mas de 10 caracteres, si solo tiene numeros
      if (numeroInt !== '') {
        if (numeroInt.length > 10) {
          throw new ValidationError('El número interior no puede tener más de 10 caracteres, por favor ingréselo correctamente.')
        }
        else if (!edadPattern.test(numeroInt)) {
          throw new ValidationError('El número interior solo permite números, verifique su respuesta.')
        }
      }
      //Validacion de la colonia si esta vacia
      if (colonia === '0') {
        throw new ValidationError('Por favor busque una colonia y selecciónela, por favor.')
      }

      return true
    } catch (error) {
      if (error instanceof ValidationError) {
        this.#showModal(error.message, 'Error de validación')
      } else {
        console.error(error.message)
        this.#showModal(
          'Error al validar datos , persona, domicilio, por favor intenta de nuevo',
          'Error'
        )
      }
      return false
    }
  }

  //Metodo encargado de buscar el codigo postal y la informaicon relacionada a este
  async searchCP() {
    try {
      //Se obtiene la informacion del codigo postal
      const { colonias: data } = await this.#api.getDomicilioByCP(
        this.#cp.value
      )
      //En caso de que no se encuentre informacion del codigo postal
      if (!data || typeof data === 'string') {
        this.#showModal('No se encontró el código postal', 'Advertencia')
        return
      }
      //Se limpian los campos del formulario y se asignan los valores obtenidos
      this.#estado.innerHTML = '';
      this.#estado.value = data.estado.nombre_estado
      this.#municipio.innerHTML = '';
      this.#municipio.value = data.municipio.nombre_municipio
      this.#ciudad.innerHTML = '';
      this.#ciudad.value = data.ciudad.nombre_ciudad
      this.#colonia.innerHTML = '';

      //Se crea un option para la colonia
      const optionColonia = document.createElement('option')
      optionColonia.value = '0'
      optionColonia.text = 'Seleccione una colonia'
      this.#colonia.appendChild(optionColonia)

      //Se recorren las colonias para agregarlas al select
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

  //Metodo encargado de la conexion del componente con el DOM
  async campos() {
    //Obtencion del boton de siguiente
    this.btnNext = this.shadowRoot.getElementById('btn-demandado-next')

    //Asignacion de eventos al boton de siguiente
    this.btnNext.addEventListener('click', () => {
      if (!this.validateInputs()) return
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'proceso' },
      })
      this.dispatchEvent(event)
    })
    //Metodo encargado de la gestion de los cambios del tabs
    document.addEventListener('tab-change', event => {
      const tabId = event.detail.tabId
      //Estas verificacion es de igual manera como en codigos pasados es con el fin de validar si se ha seleccionado 
      //ahora en este caso un proceso judicial , esto con el fin de cargar los datos del demandado , caso contrario donde se seleccione 
      //un nuevo proceso judicial se limpiaran los campos del formulario y se cargaran los datos del nuevo proceso
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

  //Metodo que se encarga de mostrar un modal
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.setOnCloseCallback(() => { })

    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }
}

customElements.define('demandado-full-tab', DemandadoTab)
