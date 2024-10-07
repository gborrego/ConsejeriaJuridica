import { APIModel } from '../../models/api.model.js'



export class DomicilioTab extends HTMLElement {

  //Variables de clase privadas 
  #API
  #asesoria
  #domicilio
  #calle
  #numeroExt
  #numeroInt
  #cp
  #municipio
  #estado
  #ciudad
  #colonia
  #botonbuscar
  #editCbx


  //Metodo que se encarga de observar los cambios en los atributos del componente
  static get observedAttributes() {
    return ['id', 'data']
  }
  //Metodo que se encarga de obtener los valores de los atributos del componente
  get id() {
    return this.getAttribute('id')
  }

  //Metodo que se encarga de asignar valores a los atributos del componente
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que se encarga de obtener los valores de los atributos del componente
  get data() {
    return {
      calle: this.#calle.value,
      numeroExt: this.#numeroExt.value,
      numeroInt: this.#numeroInt.value,
      cp: this.#cp.value,
      estado: this.#estado.value,
      municipio: this.#municipio.value,
      ciudad: this.#ciudad.value,
      colonia: this.#colonia.value,
    }
  }

  //Metodo que se encarga de asignar valores a los atributos del componente
  set data(value) {
    this.setAttribute('data', value)
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Se crea una instancia de la clase APIModel
    this.#API = new APIModel()
    await this.campos();
    //Llamado al me todo que se encarga de manejar los campos del formulario
    this.manageFormFields()
    //Llamado al metodo que se encarga de manejar los datos requeridos en el formulario
    this.fillInputs()

    // Asingacion de la variable con respecto al formulario de busqueda de codigo postal
    this.formCP = this.shadowRoot.getElementById('buscar-cp')

    //Se agrega un evento al formulario de busqueda de codigo postal, y que se encarga de buscar el codigo postal y validar en caso de error
    this.formCP.addEventListener('click', (event) => {
      //Se evita que se recargue la pagina
      event.preventDefault();
      if (
        !this.#cp.value ||
        this.#cp.value.length !== 5 ||
        isNaN(this.#cp.value)
      ) {
        // Mensaje de error
        this.#showModal('El código postal debe tener 5 dígitos', 'Advertencia')
        return
      }
      //Busqueda del codigo Postal
      this.searchCP()
    })


  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/turnar/domicilio-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  //Constructor de la clase
  constructor() {
    super()
    //Esto es con respecto al manejo de pestanas
    this.id = 'domicilio'
    this.style.display = 'none'

    //Se obtienen los datos de la asesoria y del domicilio con respecto a la sesion storage 
    this.#asesoria = JSON.parse(sessionStorage.getItem('asesoria'))
    this.#domicilio = JSON.parse(sessionStorage.getItem('colonia'))
    this.init2()


  }

  //Metodo que se encarga de manejar los elementos del formulario
  manageFormFields() {
    this.#calle = this.shadowRoot.getElementById('calle')
    this.#numeroExt = this.shadowRoot.getElementById('numero-ext')
    this.#numeroInt = this.shadowRoot.getElementById('numero-int')
    this.#cp = this.shadowRoot.getElementById('codigo-postal')
    this.#municipio = this.shadowRoot.getElementById('municipio')
    this.#estado = this.shadowRoot.getElementById('estado')
    this.#ciudad = this.shadowRoot.getElementById('ciudad')
    this.#colonia = this.shadowRoot.getElementById('colonia')
    this.#botonbuscar = this.shadowRoot.getElementById('buscar-cp')
    this.#editCbx = this.shadowRoot.getElementById('cbx-editable-domicilio')
    //LLamado al metodo que se encarga de manejar la entrada de texto en tiempo real
    this.manejadorEntradaTexto();
  }

  //Metodo que se encarga de manejar la entrada de texto en tiempo real con eventos de entrada
  manejadorEntradaTexto() {
    var editableCbx = this.#editCbx;
    var calleInput = this.#calle;
    //Se valida que la calle no tenga mas de 75 caracteres
    calleInput.addEventListener('input', function () {
      if (editableCbx.checked) {
        if (calleInput.value !== '') {
          if (calleInput.value.length > 75) {
            const modal = document.querySelector('modal-warning');
            modal.setOnCloseCallback(() => {});
            modal.message = 'La calle no puede tener más de 75 caracteres, por favor ingresela correctamente.';
            modal.title = 'Error de validación';
            modal.open = true;
          }
        }
      }

    });


    var numeroExteriorInput = this.#numeroExt;
    var numeroInteriorInput = this.#numeroExt;

    var enterosPattern = /^\d+$/;

    //Se valida que el numero exterior no tenga mas de 10 caracteres y solo sean numeros

    numeroExteriorInput.addEventListener('input', function () {

      if (editableCbx.checked) {
        if (numeroExteriorInput.value !== '') {

          if (!enterosPattern.test(numeroExteriorInput.value)) {
            const modal = document.querySelector('modal-warning');
            modal.setOnCloseCallback(() => {});

            modal.message = 'El número exterior solo permite números, verifique su respuesta.';
            modal.title = 'Error de validación';
            modal.open = true;
          } else if (numeroExteriorInput.value.length > 10) {
            const modal = document.querySelector('modal-warning');
            modal.setOnCloseCallback(() => {});

            modal.message = 'El número exterior no debe tener más de 10 dígitos, por favor ingreselo correctamente.';
            modal.title = 'Error de validación';
            modal.open = true;
          }
        }
      }
    });

    //Se valida que el numero interior no tenga mas de 10 caracteres y solo sean numeros
    numeroInteriorInput.addEventListener('input', function () {
      if (editableCbx.checked) {

        if (numeroInteriorInput.value !== '') {
          if (!enterosPattern.test(numeroInteriorInput.value)) {
            const modal = document.querySelector('modal-warning');
            modal.setOnCloseCallback(() => {});

            modal.message = 'El número interior solo permite números, verifique su respuesta.';
            modal.title = 'Error de validación';
            modal.open = true;
          } else
            if (numeroInteriorInput.length > 10) {
              const modal = document.querySelector('modal-warning');
              modal.setOnCloseCallback(() => {});

              modal.message = 'El número interior no puede tener más de 10 caracteres, por favor ingreselo correctamente.';
              modal.title = 'Error de validación';
              modal.open = true;
            }
        }
      }
    });

  }

  //Rellenar los campos del formulario con los datos de la asesoria
  fillInputs() {
    this.#calle.value = this.#asesoria.persona.domicilio.calle_domicilio
    this.#numeroExt.value =
      this.#asesoria.persona.domicilio.numero_exterior_domicilio
    this.#numeroInt.value =
      this.#asesoria.persona.domicilio.numero_interior_domicilio
    this.#cp.value = this.#domicilio.codigo_postal.codigo_postal
    this.#municipio.value = this.#domicilio.municipio.nombre_municipio
    this.#estado.value = this.#domicilio.estado.nombre_estado
    this.#ciudad.value = this.#domicilio.ciudad.nombre_ciudad

    //Llamado al metodo que se encarga de llenar el select de colonias
    this.#API.getDomicilioByCP(this.#cp.value)
      .then(data => {
        const selectColonia = this.shadowRoot.getElementById('colonia'); // Aquí obtenemos la referencia al elemento <select>
        // Verificamos si selectColonia es válido
        if (selectColonia) {
          // Iteramos sobre los datos y agregamos las opciones al elemento <select>
          const coloniasArray = Array.from(data.colonias.colonias);

          // Iteramos sobre los datos y agregamos las opciones al elemento <select>
          coloniasArray.forEach(colonia => {
            const option = document.createElement('option');
            option.value = colonia.id_colonia;
            option.textContent = colonia.nombre_colonia;
            selectColonia.appendChild(option);
          });

          //console.log(    data   )
          selectColonia.value = this.#domicilio.colonia.id_colonia;

        } else {
          //   console.error('Elemento "colonia" no encontrado en el shadow DOM.');
        }
      })
      .catch(error => {
        // console.error('Error al obtener datos de la API:', error);
      });
  }


  //Conección con el callback de la clase y que se encarga de administrar los cambios en los atributos del componente
  async campos() {
    //Sboton de siguiente, y que se encarga de cambiar de pestaña
    this.btnNext = this.shadowRoot.getElementById('btn-domicilio-next')

    //checkbox de edicion, y que se encarga de habilitar o deshabilitar los campos del formulario
    this.editCbx = this.shadowRoot.getElementById('cbx-editable-domicilio')

    // Se agrega un evento al boton de siguiente, y que se encarga de cambiar de pestaña
    this.btnNext.addEventListener('click', () => {
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'turno' },
      })
      this.dispatchEvent(event)
    })

    //Metodo que se encarga de habilitar o deshabilitar los campos del formulario
    this.editCbx.addEventListener('change', () => {
      this.#toggleInputDisabled()
    })


  }

  //Metodo que se encarga de buscar el codigo postal y la iformacion relacionada como lo son el estado, municipio, ciudad y colonia etc para asi poder llenar los campos del formulario
  async searchCP() {
    try {
      //Llamado al metodo que se encarga de buscar el codigo postal
      const { colonias: data } = await this.#API.getDomicilioByCP(
        this.#cp.value
      )
      //Validacion de la respuesta
      if (!data || typeof data === 'string') {
        this.#showModal('No se encontró el código postal', 'Advertencia')
        return
      }
      //Llenado de los campos del formulario
      this.#estado.innerHTML = '';
      this.#estado.value = data.estado.nombre_estado
      this.#municipio.innerHTML = '';
      this.#municipio.value = data.municipio.nombre_municipio
      this.#ciudad.innerHTML = '';
      this.#ciudad.value = data.ciudad.nombre_ciudad
      this.#colonia.innerHTML = '';
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

  //Metodo que se encarga de mostrar un modal con un mensaje y un titulo
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }
  // Habilitar o deshabilitar inputs: calle, numeroExt, numeroInt
  #toggleInputDisabled() {
    this.#calle.disabled = !this.#calle.disabled
    this.#numeroExt.disabled = !this.#numeroExt.disabled
    this.#numeroInt.disabled = !this.#numeroInt.disabled
    this.#cp.disabled = !this.#cp.disabled
    this.#botonbuscar.disabled = !this.#botonbuscar.disabled
    this.#colonia.disabled = !this.#colonia.disabled
  }

}

customElements.define('domicilio-tab', DomicilioTab)
