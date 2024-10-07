import { APIModel } from '../../models/api.model.js'

export class AsesoradoTab extends HTMLElement {

  //Variables privadas  
  #asesoria
  #api
  #generos
  #nombre
  #apellidoPaterno
  #apellidoMaterno
  #edad
  #sexo
  #ediatableCbx
  #generoActual


  //Metodo para observar los cambios en los atributos
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo que se encarga de observar los cambios en los atributos
  get id() {
    return this.getAttribute('id')
  }

  //Metodo que se encarga de setear los cambios en los atributos
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que se encarga de obtener los datos
  get data() {
    return {
      nombre: this.#nombre.value,
      apellido_paterno: this.#apellidoPaterno.value,
      apellido_materno: this.#apellidoMaterno.value,
      edad: Number(this.#edad.value),
      genero: this.#generos.find(
        genero => genero.id_genero === Number(this.#sexo.value)
      ),
    }
  }

  //Metodo que se encarga de setear los datos
  set data(value) {
    this.setAttribute('data', value)
  }
  async init2() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));

    //Se obtiene la asesoria de la sesion esto es con respecto a la busqueda
    this.#asesoria = JSON.parse(sessionStorage.getItem('asesoria'))



    // Se obtiene la informacion de la API
    this.#api = new APIModel()
    await this.campos()
    await this.generos()
    this.manageFormFields()
    this.fillInputs()
    await this.generoActual()

  }

   async generoActual(){
      //Obtencion del genero actual
      try {
        const { genero } = await this.#api.getGeneroByID(this.#asesoria.persona.genero.id_genero)
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
   }

  async generos() {
    try {
      const { generos } = await this.#api.getGeneros2()
      this.#generos = generos
    }
    catch (error) {
      console.error(error)
    }
  }



  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/turnar/asesorado-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  //Constructor de la clase
  constructor() {
    super()
    //Este id es con respecto a la pestaña actual
    this.id = 'asesorado'
    this.init2()


  }

  //Rellenar los inputs con los datos de la asesoria
  fillInputs() {
    //Se obtienen los inputs
    this.#nombre.value = this.#asesoria.persona.nombre
    this.#apellidoPaterno.value = this.#asesoria.persona.apellido_paterno
    this.#apellidoMaterno.value = this.#asesoria.persona.apellido_materno
    this.#edad.value = this.#asesoria.persona.edad
 try{
    //Se rellena el select con los generos
    this.#generos.forEach(genero => {
      const option = document.createElement('option')
      option.value = genero.id_genero
      option.text = genero.descripcion_genero
      this.#sexo.appendChild(option)
    })
  }catch(error){
    console.error(error)
  }
/*
    const option = document.createElement('option')
    option.value = this.#generoActual.id_genero
    option.text = this.#generoActual.descripcion_genero
    this.#sexo.appendChild(option)

    this.#sexo.value = this.#generoActual.id_genero
   */
  }


  //Metodo que se encarga de manejar los campos del formulario
  manageFormFields() {
    //Asignacion de los inputs
    this.#nombre = this.shadowRoot.getElementById('nombre')
    this.#apellidoPaterno = this.shadowRoot.getElementById('apellido-paterno')
    this.#apellidoMaterno = this.shadowRoot.getElementById('apellido-materno')
    this.#edad = this.shadowRoot.getElementById('edad')
    this.#sexo = this.shadowRoot.getElementById('sexo')
    this.#ediatableCbx = this.shadowRoot.getElementById('cbx-editable-asesorado')

    //Llamada al manejador de entrada de texto
    this.manejadorEntradaTexto()

  }

  //Manejador de entrada de texto para validar los campos
  manejadorEntradaTexto() {
    var nombreInput = this.#nombre;
    var apellidoPaternoInput = this.#apellidoPaterno;
    var apellidoMaternoInput = this.#apellidoMaterno;
    var editableCbx = this.#ediatableCbx;
    // Agregar un evento 'input' al campo de entrada para validar en tiempo real

    nombreInput.addEventListener('input', function () {
      //console.log(editableCbx.value) 

      if (editableCbx.checked) {

        var nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

        if (nombreInput.value !== '') {

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

        }
      }
    });

    //Encarga de validar el apellido paterno en tiempo real con respecto a la entrada de texto y validar si cumple con solo letras y no tiene mas de 50 caracteres
    apellidoPaternoInput.addEventListener('input', function () {

      if (editableCbx.checked) {



        var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
        if (apellidoPaternoInput.value !== '') {
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
        }
      }

    });

    //Encarga de validar el apellido materno en tiempo real con respecto a la entrada de texto y validar si cumple con solo letras y no tiene mas de 50 caracteres
    apellidoMaternoInput.addEventListener('input', function () {

      if (editableCbx.checked) {



        var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

        if (apellidoMaternoInput.value !== '') {
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

      }
    });

    var edadInput = this.#edad;

    //Encarga de validar la edad en tiempo real con respecto a la entrada de texto y validar si cumple con solo numeros y no tiene mas de 200 años
    edadInput.addEventListener('input', function () {

      if (editableCbx.checked) {


        var edadPattern = /^\d+$/;
        if (edadInput.value !== '') {
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
        }

      }

    });

  }


  //Metodo encargado de activar los eventos del boton y el checkbox
  async campos() {
    // Se obtienen los elementos del DOM
    this.btnNext = this.shadowRoot.getElementById('btn-asesorado-next')
    this.editCbx = this.shadowRoot.getElementById('cbx-editable-asesorado')

    //Activación del evento de click en el boton
    this.btnNext.addEventListener('click', () => {
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'domicilio' },
      })
      this.dispatchEvent(event)
    })

    //Activación del evento de cambio en el checkbox
    this.editCbx.addEventListener('change', () => {
      const inputs = this.shadowRoot.querySelectorAll('input, select')
      inputs.forEach(input => {
        if (input !== this.editCbx) {
          input.disabled = !input.disabled
        }
      })
    })

    // Escucha el evento de cambio de pestaña
    document.addEventListener('tab-change', event => {
      if (event.detail.tabId === 'asesorado') {
        // clg
      }
    })
  }

}

customElements.define('asesorado-tab', AsesoradoTab)
