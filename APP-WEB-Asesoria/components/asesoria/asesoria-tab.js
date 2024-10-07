import { ValidationError } from '../../lib/errors.js'
import { getDate, validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model.js'



export class AsesoriaTab extends HTMLElement {

  //Variables privadas
  // API Model para la comunicación con el backend
  #api

  //Select, inputs y variables de los inputs
  //Variable que almacena los tipos de juicio obtenidos
  #tiposJuicio
  //Select de asesores en el formulario
  #asesor
  //Select de defensores en el formulario
  #defensor
  //Select de tipos de juicio en el formulario
  #tipoJuicio
  //Input de resumen en el formulario
  #resumen
  //Input de conclusion en el formulario
  #conclusion
  //Select de distrito judicial en el formulario
  #distrito
  //Select de municipio en el formulario
  #municipio


  //Variable que almacena todos los checkbox de documentos recibidos
  #recibido

  //Variable que almacena los datos de los checkbox de documentos recibidos que esten seleccionados
  #recibidoValue


  //Variable que guarda los valores de los radio buton ya sea asesor o defensor
  #tipoEmpleadoValue
  //Variable que almacena si cumple o no con los requisitos osea guarda el valor selecionado de los radio ya sea yes o no
  #requisitosValue

  //Variable que almacena todos los radio buttons de empleado
  #tipoEmpleado
  //Variable que almacena todos los radio buttons de requisitos
  #requisitos


  //Datos obtenidos
  //Variable que almacena los asesores obtenidos
  #asesores
  //Variable que almacena los defensores obtenidos
  #defensores
  //Variable que almacena los distritos obtenidos
  #distritos


  // Metodos de la clase que realiza u obtiene los valores de los inputs
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo que verifica si los campos estan completos
  get isComplete() {
    return this.validateInputs()
  }

  // Metodo que obtiene los valores de los inputs
  get data() {
    // LLamada a la funcion que obtiene los valores de los inputs
    this.getValues()
    // Armado del json con los valores de los inputs
    const datos_asesoria = {
      resumen_asesoria: this.#resumen.value,
      conclusion_asesoria: this.#conclusion.value,
      estatus_requisitos: this.#requisitosValue === 'yes',
      fecha_registro: getDate(),
      usuario: this.#api.user.name,
      id_usuario: this.#api.user.id_usuario,
      estatus_asesoria: 'NO_TURNADA',
      id_distrito_judicial: Number(this.#distrito.value),
      id_municipio_distrito: Number(this.#municipio.value)
    }
    // Mapeo de los valores de los documentos recibidos
    const recibidos = this.#recibidoValue.map(
      ({ id_catalogo, descripcion_catalogo }) => {
        return {
          id_catalogo: Number(id_catalogo),
          descripcion_catalogo,
        }
      }
    )
    // Mapeo de los valores del tipo de juicio
    const tipos_juicio = {
      id_tipo_juicio: Number(this.#tipoJuicio.value),
      tipo_juicio:
        this.#tipoJuicio.options[this.#tipoJuicio.selectedIndex].text,
    }

    //Mapeo del empleado seleccionado (Asesor o Defensor)
    const idEmpleado =
      this.#tipoEmpleadoValue === 'asesor'
        ? this.#asesor.value
        : this.#defensor.value
    const nombreEmpleado =
      this.#tipoEmpleadoValue === 'asesor'
        ? this.#asesor.options[this.#asesor.selectedIndex].text
        : this.#defensor.options[this.#defensor.selectedIndex].text
    const empleado =
      this.#tipoEmpleadoValue === 'asesor'
        ?
        {
          id_empleado: Number(idEmpleado),
          nombre_asesor: nombreEmpleado,
        } : {
          id_empleado: Number(idEmpleado),
          nombre_defensor: nombreEmpleado,
        }

    // Retorno de los valores de los inputs
    return {
      datos_asesoria,
      recibidos,
      tipos_juicio,
      empleado,
    }
  }
  // Metodo que setea los valores de los inputs
  set data(value) {
    this.setAttribute('data', value)
  }

  // Metodo que obtiene el id del componente
  get id() {
    return this.getAttribute('id')
  }

  // Metodo que setea el id del componente
  set id(value) {
    this.setAttribute('id', value)
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/asesoria/asesoria-tab.html')).text();
    template.innerHTML = html;

    return template;
  }
  //Constructor de la clase
  constructor() {
    super()
    //Id del componente con el fin de establecer la pestaña correspondiente en el tab
    this.id = 'asesoria'
    this.style.display = 'none'
    //Llamada a la funcion init
    this.init()
  }


  //Metodo que inicializa las variables y llena los inputs
  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));

    //Instancia de la clase APIModel
    this.#api = new APIModel()
    await this.campos()

    //Llamada a la funcion que obtiene los datos y los asigna a las variables
    await this.manageFormFields()
    //Llamada a la funcion que obtiene los datos de los asesores, defensores, tipos de juicio y distritos
    await this.busquedaDatosYAsignaicon()
    //Llamada a la funcion que llena los inputs con los valores obtenidos
    await this.fillInputs()

    await this.agregarMunicipiosByDistrito()
    //Llamada a la funcion que maneja los eventos de los inputs
    await this.manejadorDeEntrada()
  }

  #busquedaAsesor = false
  #busquedaDefensor = false


  //Metodo que obtiene los datos de los asesores, defensores, tipos de juicio y distritos
  async busquedaDatosYAsignaicon() {


    // Llamada a la funcion que obtiene los datos de los asesores, defensores, tipos de juicio y distritos, los metodos de getAsesores2, getDefensores2 y getTiposJuicio2 
    // son medotos que solicitan solo aquellos datos que esten activos
    try {
      const asesores = await this.#api.getAsesoresByDistrito(this.#api.user.id_distrito_judicial)
      this.#asesores = asesores
    }
    catch (error) {
      this.#busquedaAsesor = true
    }

    try {
      const defensores = await this.#api.getDefensoresByDistrito(this.#api.user.id_distrito_judicial)
      this.#defensores = defensores
    }
    catch (error) {
      this.#busquedaDefensor = true
    }
    if (this.#busquedaAsesor && this.#busquedaDefensor) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      })
      modal.message = 'Error al cargar los defensores  o asesores, ninguno se encuentra activ. Por favor intenta de nuevo o verifique en el respectivo seccion administritiva.'
      modal.title = 'Error'
      modal.open = true
    }

    try {
      const { tiposDeJuicio } = await this.#api.getTiposJuicio2()
      this.#tiposJuicio = tiposDeJuicio
    }
    catch (error) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      })
      modal.message = 'Error al cargar los tipos de juicio, por favor intenta de nuevo o verifique en el respectivo seccion administritiva.'
      modal.title = 'Error'
      modal.open = true
    }

    // Llamada a la funcion que obtiene los distritos y los asigna a la variable distritos
    this.#distritos = await this.#api.getDistritos()


  }

  //Metodo que llena los inputs con los valores obtenidos
  async fillInputs() {
    //Llenado de los asesores, defensores, tipos de juicio y distritos
    if (this.#busquedaAsesor === false) {
      this.#asesores.forEach(asesor => {
        const option = document.createElement('option')
        option.value = asesor.id_asesor
        option.textContent = asesor.nombre_asesor
        this.#asesor.appendChild(option)
      })
    }

    if (this.#busquedaDefensor === false) {
      this.#defensores.forEach(defensor => {
        const option = document.createElement('option')
        option.value = defensor.id_defensor
        option.textContent = defensor.nombre_defensor
        this.#defensor.appendChild(option)
      })
    }

    this.#tiposJuicio.forEach(tipoJuicio => {
      const option = document.createElement('option')
      option.value = tipoJuicio.id_tipo_juicio
      option.textContent = tipoJuicio.tipo_juicio
      this.#tipoJuicio.appendChild(option)
    })

    this.#distritos.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.textContent = distrito.nombre_distrito_judicial
      this.#distrito.appendChild(option)
    })


  }



  //Metodo que maneja los eventos de los inputs
  async manejadorDeEntrada() {
    // Asignacion de la variable asesor al input con id asesor 
    var resumenInput = this.#resumen;
    // Evento que se dispara cuando se escribe en el input resumen
    resumenInput.addEventListener('input', function () {
      if (resumenInput.value !== '') {
        if (resumenInput.value.length > 500) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El resumen no puede tener más de 500 caracteres, por favor revisa.'
          modal.title = 'Error de validación'
          modal.open = true
        }
      }

    });
    // Asignacion de la variable conclusion al input con id conclusion
    var conclusionInput = this.#conclusion;
    // Evento que se dispara cuando se escribe en el input conclusion
    conclusionInput.addEventListener('input', function () {
      if (conclusionInput.value !== '') {
        if (conclusionInput.value.length > 250) {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'La conclusión no puede tener más de 250 caracteres, por favor revisa.'
          modal.title = 'Error de validación'
          modal.open = true
        }
      }
    });

  }

  //Metodo que maneja los campos del formulario y la asignacion de los valores a las variables
  async manageFormFields() {
    //Asignacion de las variables a los inputs
    this.#asesor = this.shadowRoot.getElementById('asesor')
    this.#defensor = this.shadowRoot.getElementById('defensor')
    this.#tipoJuicio = this.shadowRoot.getElementById('tipo-juicio')
    this.#municipio = this.shadowRoot.getElementById('municipio')
    this.#distrito = this.shadowRoot.getElementById('distrito')
    this.#resumen = this.shadowRoot.getElementById('resumen')
    this.#conclusion = this.shadowRoot.getElementById('conclusion')



    // Asignacion del radio de requisitos que evalua si cumple o no con los requisitos
    this.#requisitos = this.shadowRoot.querySelectorAll(
      'input[type="radio"][name="rb-requisitos"]'
    )
    // Asignacion del radio de empleado que evalua si es asesor o defensor
    this.#tipoEmpleado = this.shadowRoot.querySelectorAll(
      'input[type="radio"][name="rb-empleado"]'
    )
  }

  //Este metodo se encarga de buscar los municipios relacionados con respecto al distrito seleccionado
  agregarMunicipiosByDistrito = async () => {
    //     this.#distrito.value = this.#api.user.id_distrito_judicial
    this.#distrito.value = this.#api.user.id_distrito_judicial
    //Si el distrito seleccionado es 0 se habilita el input municipio y se le asigna el valor 0
    if (this.#distrito.value === '0') {
      this.shadowRoot.getElementById('municipio').value = '0'
      this.shadowRoot.getElementById('municipio').disabled = true
    } else if (this.#distrito.value !== '0') {
      //Si el distrito seleccionado es diferente de 0 se habilita la busqueda de los municipios relacionados con el distrito seleccionado
      const id_distrito = this.#distrito.value
      // Llamada a la funcion que obtiene los municipios relacionados con el distrito seleccionado
      const municipios = await this.#api.getMunicipiosByDistrito(id_distrito)
      //Se limpia el input municipio
      this.shadowRoot.getElementById('municipio').innerHTML = ''
      this.shadowRoot.getElementById('municipio').disabled = false
      //Se limpia el select municipio
      municipios.forEach(municipio => {
        const option = document.createElement('option')
        option.value = municipio.id_municipio_distrito
        option.text = municipio.nombre_municipio
        this.#municipio.appendChild(option)
      })
    }

  }



  //Metodo que obtiene los valores de los inputs
  getValues() {
    const checkboxesMarcados = Array.from(this.#recibido).filter(
      checkbox => checkbox.checked
    )
    this.#recibidoValue = checkboxesMarcados.map(checkbox => {
      return {
        id_catalogo: Number(checkbox.value),
        descripcion_catalogo: checkbox.dataset.name,
      }
    })

    const radioSeleccionado = Array.from(this.#requisitos).find(
      radio => radio.checked
    )
    this.#requisitosValue = radioSeleccionado
      ? radioSeleccionado.value
      : undefined

    this.#tipoEmpleadoValue = Array.from(this.#tipoEmpleado).find(
      radio => radio.checked
    )?.value
  }

  //Metodo que valida los inputs
  validateInputs() {
    //Llamada a la funcion que obtiene los valores de los inputs como lo son los documentos recibidos, requisitos, tipo de empleado
    this.getValues()

    const inputs = [
      this.#tipoJuicio.value,
      this.#resumen.value,
      this.#conclusion.value,
      this.#recibidoValue.length,
      this.#requisitosValue,
    ]

    try {
      //Se valida si el tipo de empleado es asesor o defensor y si no se selecciona uno se muestra un mensaje de error
      if (
        (this.#tipoEmpleadoValue === 'asesor' && !this.#asesor.value) ||
        (this.#tipoEmpleadoValue === 'defensor' && !this.#defensor.value)
      ) {
        throw new ValidationError(
          'Es necesario seleccionar un asesor o defensor, por favor revise.'
        )
      }


      // Se valida si el tipo de juicio es seleccionado y si no se selecciona uno se muestra un mensaje de error
      if (this.#tipoJuicio.value === '') {
        throw new ValidationError('Selecciona un tipo de juicio, por favor.')
      }

      // Se valida si el distrito y municipio son seleccionados y si no se selecciona uno se muestra un mensaje de error
      if (this.#municipio.value === '' || this.#distrito.value === '') {
        throw new ValidationError('Selecciona un distrito y un municipio, por favor.')
      }


      // Se valida si el resumen es ingresado y si no se ingresa se muestra un mensaje de error, ademas se valida que no tenga mas de 250 caracteres
      if (this.#resumen.value === '') {
        throw new ValidationError('El resumen no puede estar vacío, por favor ingreselo.')
      } else if (this.#resumen.value.length > 500) {
        throw new ValidationError('El resumen no puede tener más de 500 caracteres, por favor revisa.')
      }

      // Se valida si la conclusion es ingresada y si no se ingresa se muestra un mensaje de error, ademas se valida que no tenga mas de 250 caracteres
      if (this.#conclusion.value === '') {
        throw new ValidationError('La conclusión no puede estar vacía, por favor ingresela.')
      } else if (this.#conclusion.value.length > 250) {
        throw new ValidationError('La conclusión no puede tener más de 250 caracteres, por favor revisa.')
      }

      // Se valida si los documentos recibidos son seleccionados y si no se selecciona uno se muestra un mensaje de error
      if (this.#recibidoValue.length === 0) {
        throw new ValidationError('Selecciona al menos un documento recibido, por favor.')
      }

      if (!this.#requisitosValue) {
        throw new ValidationError('Selecciona si cumple con los requisitos, por favor.')
      }

      return true
    } catch (error) {
      if (error instanceof ValidationError) {
        this.#showModal(error.message, 'Error de validación')
      } else {
        console.error(error)
        this.#showModal(
          'Error al registrar el turno, por favor intenta de nuevo',
          'Error'
        )
      }

      return false
    }
  }

  //Metodo que se ejecuta cuando se agrega el componente al DOM
  async campos() {
    //Boton de siguiente
    this.btnNext = this.shadowRoot.getElementById('btn-asesoria-next')

    // Mueve la creación de elementos del sombreado aquí
    const recibidoDiv = this.shadowRoot.getElementById('recibido');
    // Llamada a la funcion que obtiene los catalogos de los documentos recibidos esto con el fin de colocar en una lista de combox todos los documentos recibidos y seleccionar los que se necesiten
    this.#api.getCatalogos2().then(({ requisitosCatalogo }) => {
      requisitosCatalogo.forEach(requisito => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add('flex', 'items-center');

        const input = document.createElement('input');
        input.id = `cbx-${requisito.descripcion_catalogo.toLowerCase().replace(' ', '-')}`;
        input.type = 'checkbox';
        input.value = requisito.id_catalogo;
        input.name = 'recibido';
        input.dataset.name = requisito.descripcion_catalogo;
        input.classList.add('w-4', 'h-4', 'text-blue-600', 'bg-gray-100', 'border-gray-300', 'rounded', 'focus:ring-blue-500', 'focus:ring-2');

        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.classList.add('text-sm', 'text-black', 'ms-2');
        label.textContent = requisito.descripcion_catalogo;

        checkboxDiv.appendChild(input);
        checkboxDiv.appendChild(label);
        recibidoDiv.appendChild(checkboxDiv);
      });
      //Asignacion de las variables relacionados con los documentos recibos los cuales pueden ser varios y se asignan a un array
      this.#recibido = this.shadowRoot.querySelectorAll(
        '#recibido input[type="checkbox"]'
      )

    }).catch(error => {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      })
      modal.message = 'Error al cargar los documentos recibidos, por favor intenta de nuevo o verifique en el respectivo catálogo.'
      modal.title = 'Error'
      modal.open = true

    });

    // Seleccion de los radio buttons de empleado
    const radioButtons = this.shadowRoot.querySelectorAll(
      'input[name="rb-empleado"]'
    )
    // Contenedor de asesor y defensor para mostrar u ocultar segun el empleado seleccionado
    const asesorContainer = this.shadowRoot.getElementById('select-asesor')
    const defensorContainer = this.shadowRoot.getElementById('select-defensor')

    // Evento que se dispara cuando se selecciona un radio button de empleado y se muestra el contenedor correspondiente
    radioButtons.forEach(radioButton => {
      radioButton.addEventListener('change', event => {
        if (event.target.value === 'asesor') {
          asesorContainer.classList.remove('hidden')
          asesorContainer.classList.add('flex')
          defensorContainer.classList.add('hidden')
        } else {
          asesorContainer.classList.add('hidden')
          asesorContainer.classList.remove('flex')
          defensorContainer.classList.remove('hidden')
          defensorContainer.classList.add('flex')
        }
      })
    })

    //Evento encargado de la gestion de la pestaña actual y la siguiente
    this.btnNext.addEventListener('click', () => {
      if (!this.validateInputs()) return
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'detalles' },
      })
      this.dispatchEvent(event)
    })
    // Evento que se dispara cuando se cambia de pestaña
    document.addEventListener('tab-change', event => { })
  }

  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }

}

customElements.define('asesoria-tab', AsesoriaTab)
