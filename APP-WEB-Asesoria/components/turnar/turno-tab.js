/* eslint-disable indent */
import { ValidationError } from '../../lib/errors.js'
import { getDate, validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model.js'
 

export class TurnoTab extends HTMLElement {

  //Variables privadas de la clase
  #asesoria
  #asesores
  #defensores
  #usuario
  #api
  #resumen
  #nombreAsesor
  #nombreDefensor
  #responsableTurno
  #horaTurno
  #minutoTurno
  #turnadoPorAsesor

  //Metodo para observar los cambios en los atributos
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo que se encarga de obtener el id
  get id() {
    return this.getAttribute('id')
  }

  //Metodo que se encarga de setear el id
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que se encarga de obtener los datos
  get data() {
    const idEmpelado =  this.#defensores.find(
        defensor =>
          defensor.id_defensor === Number(this.#nombreDefensor.value)
      )
    return {
      resumen: this.#resumen.value,
      empleado: idEmpelado,
      responsableTurno: this.#usuario.name,
      horaTurno: this.#horaTurno.value,
      minutoTurno: this.#minutoTurno.value,
      turnadoPorAsesor: this.#turnadoPorAsesor.checked,
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
    this.#usuario = JSON.parse(sessionStorage.getItem('user'))

    //Se inicializan las variables en este caso API
    this.#api = new APIModel() 
    await this.campos()
    //Se inicializa la clase
    this.#initialize()
  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('../assets/turnar/turno-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  //Constructor de la clase
  constructor() {
    super()

    //Este id es con respecto a la pestaña actual
    this.id = 'turno'
    //Se esconde el tab
    this.style.display = 'none'
    this.init2()

  }


  //Metodo encargado de inicializar la clase
  async #initialize() {
    //Se obtienen los asesores y defensores
    await this.#fetchEmpleados()

    this.#manageFormFields()
    this.#fillInputs()
  }

  async #fetchEmpleados() {
    /*
    try {
      const data = await this.#api.getAsesores2()
      this.#asesores = data.asesores
    } catch (error) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      });
      modal.message = 'No se pudieron obtener los asesores, por favor intenta de nuevo o verifique la seccion administrativa de los datos'
      modal.title = 'Error'
      modal.open = true
    }
    */

    try {
      const defensores = await this.#api.getDefensoresByDistrito(this.#api.user.id_distrito_judicial)
      this.#defensores = defensores
    } catch (error) {
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      });
      modal.message = 'No se pudieron obtener los defensores, por favor intenta de nuevo o verifique la seccion administrativa de los datos'
      modal.title = 'Error'
      modal.open = true
    }
  }

  //Metodo encargado de manejar la asignacion de los campos
  #manageFormFields() {
    this.#resumen = this.shadowRoot.getElementById('resumen')
    this.#nombreAsesor = this.shadowRoot.getElementById('nombre-asesor')
    this.#nombreDefensor = this.shadowRoot.getElementById('nombre-defensor')
    this.#responsableTurno = this.shadowRoot.getElementById('responsable-turno')
    this.#horaTurno = this.shadowRoot.getElementById('hora-turno')
    this.#minutoTurno = this.shadowRoot.getElementById('minuto-turno')
    this.#turnadoPorAsesor =
      this.shadowRoot.getElementById('cbx-turnado-asesor')

    //Llamada al manejador de entrada de texto
    this.manejadorEntradaTexto()
  }

  //Metodo encargado de manejar la entrada de texto
  manejadorEntradaTexto() {

    //Asignacion de los inputs
    var resumenInput = this.#resumen;

    //Validar que el resumen no tenga más de 250 caracteres
    resumenInput.addEventListener('input', function () {
      if (resumenInput.value.length > 250) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'El resumen no puede tener más de 250 caracteres, por favor revisa.'
        modal.title = 'Error de validación'
        modal.open = true
      }

    });

    //Asignacion de los inputs
    var horaTurnoInput = this.#horaTurno;
    var minutoTurnoInput = this.#minutoTurno;


    // Validar la hora del turno y que cumpla con el formato de 24 horas
    horaTurnoInput.addEventListener('input', function () {

      //validar horas entre 0 y 23 sin regex valida que la entrada sea un numero
         if (horaTurnoInput.value ===  "e") {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'La hora del turno solo permite números, verifique su respuesta.'
        modal.title = 'Error de validación'
        modal.open = true
      } else

      if (isNaN(horaTurnoInput.value)) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'La hora del turno solo permite números, verifique su respuesta.'
        modal.title = 'Error de validación'
        modal.open = true
      } else
    
       
      if (horaTurnoInput.value > 23) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'La hora del turno no es válida, por favor ingrese un valor válido.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (horaTurnoInput.value < 0) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'La hora del turno no es válida, por favor ingrese un valor válido.'
        modal.title = 'Error de validación'
        modal.open = true
      }
     

    });




    // Validar los minutos del turno y que cumpla con el formato de minutos (0 a 59)
    minutoTurnoInput.addEventListener('input', function () {
    if (minutoTurnoInput.value ===  "e") {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'El minuto del turno solo permite números, verifique su respuesta.'
        modal.title = 'Error de validación'
        modal.open = true
      } else
      
 if(isNaN(minutoTurnoInput.value)){

  const modal = document.querySelector('modal-warning')
  modal.setOnCloseCallback(() => { });
  modal.message = 'Los minutos del turno solo permite números, verifique su respuesta.'
  modal.title = 'Error de validación'
  modal.open = true
  }
  else 
      //   validar minutos (0 a 59) sin regex 
      if (minutoTurnoInput.value > 59) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'Los minutos del turno no son válidos, por favor ingrese un valor válido.'
        modal.title = 'Error de validación'
        modal.open = true
      } else  if (minutoTurnoInput.value < 0) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'Los minutos del turno no son válidos, por favor ingrese un valor válido.'
        modal.title = 'Error de validación'
        modal.open = true
      }
            
    });
  }



  //Encargado de llenar los inputs y select
  #fillInputs() {
    this.#resumen.value = this.#asesoria.datos_asesoria.resumen_asesoria
/*
    // fill select
    this.#asesores.forEach(asesor => {
      const option = document.createElement('option')
      option.value = asesor.id_asesor
      option.textContent = `${asesor.nombre_asesor}`
      this.#nombreAsesor.appendChild(option)
    })

    */
    this.#defensores.forEach(defensor => {
      const option = document.createElement('option')
      option.value = defensor.id_defensor
      option.textContent = `${defensor.nombre_defensor}`
      this.#nombreDefensor.appendChild(option)
    })

    this.#turnadoPorAsesor.checked = Boolean(this.#asesoria.turno)
    this.#responsableTurno.value = this.#usuario.name

    const [hora, minuto] = this.#asesoria?.turno?.hora_turno?.split(':') ?? []
    this.#horaTurno.value = hora ?? ''
    this.#minutoTurno.value = minuto ?? ''
  }

 async campos() {
    //Asignacion de las variables de los botones
    this.btnTurnar = this.shadowRoot.getElementById('btn-registrar-turno')
    //Obtencion de los datos de los tabs
    this.domicilioTab = document.querySelector('domicilio-tab')
    this.asesoradoTab = document.querySelector('asesorado-tab')

    //Manejo de los eventos de los botones
    this.btnTurnar.addEventListener('click', async () => {

      //Obtencion de los datos de los tabs
      const turnoData = this.data
      const domicilioData = this.domicilioTab.data
      const asesoradoData = this.asesoradoTab.data


      try {
        // Obtencion de los datos del asesorado
        var nombre = asesoradoData.nombre;
        var apellidoPaterno = asesoradoData.apellido_paterno;
        var apellidoMaterno = asesoradoData.apellido_materno;
        var edad = asesoradoData.edad;
        var sexo = asesoradoData.genero;


        // Expresión regular para validar nombres
        var nombrePattern2 = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

        // Expresión regular para validar enteros
        var enterosPattern = /^\d+$/;

        // Validar los campos del asesorado ,en este caso que no esten vacios , que solo sean letras y que no tengan más de 50 caracteres
        if (nombre === '') {
          throw new ValidationError('El nombre no puede estar vacío, por favor ingreselo.')
        }
        else if (!nombrePattern2.test(nombre)) {
          throw new ValidationError('El nombre solo permite letras, verifique su respuesta.')
        } else if (nombre.length > 50) {
          throw new ValidationError('El nombre no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
        }



        //Validar los campos del asesorado ,en este caso que no esten vacios , que solo sean letras y que no tengan más de 50 caracteres
        if (apellidoPaterno === '') {
          throw new ValidationError('El apellido paterno no puede estar vacío, por favor ingreselo.')
        }
        else if (!nombrePattern2.test(apellidoPaterno)) {
          throw new ValidationError('El apellido paterno solo permite letras, verifique su respuesta.')
        } else if (apellidoPaterno.length > 50) {
          throw new ValidationError('El apellido paterno no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
        }


        // validar los campos del asesorado ,en este caso que no esten vacios , que solo sean letras y que no tengan más de 50 caracteres
        if (apellidoMaterno === '') {
          throw new ValidationError('El apellido materno no puede estar vacío, por favor ingreselo.')
        }
        else if (!nombrePattern2.test(apellidoMaterno)) {
          throw new ValidationError('El apellido materno solo permite letras, verifique su respuesta.')
        } else if (apellidoMaterno.length > 50) {
          throw new ValidationError('El apellido materno no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
        }



        //Validar la edad del asesorado ,en este caso que no este vacia , que solo sean numeros y que no tenga más de 200 años
        if (!enterosPattern.test(edad)) {
          if (edad === 0) {
            throw new ValidationError('La edad no puede estar vacía o ser cero, por favor ingresela.')
          } else {
            throw new ValidationError('La edad solo permite números, verifique su respuesta.')
          }
        }
        else if (edad > 200) {
          throw new ValidationError('La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.')
        }


        //Obtencion de los datos del domicilio

        var calle = domicilioData.calle;
        var ciudad = domicilioData.ciudad;
        var colonia = domicilioData.colonia;
        var cp = domicilioData.cp;
        var estado = domicilioData.estado;
        var municipio = domicilioData.municipio;
        var numeroExt = domicilioData.numeroExt;
        var numeroInt = domicilioData.numeroInt;


        // Validar los campos del domicilio ,en este caso que no esten vacios , que solo sean letras y que no tengan más de 75 caracteres

        if (calle === '') {
          throw new ValidationError('La calle no puede estar vacía, por favor ingresela.')
        } else if (calle.length > 75) {
          throw new ValidationError('La calle no puede tener más de 75 caracteres, por favor ingresela correctamente.')
        }


        // Validar los campos del domicilio ,en este caso que no esten vacios , que solo sean letras y que no tengan más de 75 caracteres
        if (numeroExt === '') {
          throw new ValidationError('El número exterior no puede estar vacío, por favor ingreselo.')
        } else if (!enterosPattern.test(numeroExt)) {
          throw new ValidationError('El número exterior solo permite números, verifique su respuesta.')
        } else if (numeroExt.length > 10) {
          throw new ValidationError('El número exterior no debe tener más de 10 dígitos, por favor ingreselo correctamente.')
        }

        // Validar los campos del domicilio ,en este caso que solo sean letras y que no tengan más de 10 caracteres
        if (numeroInt !== '') {
          if (!enterosPattern.test(numeroInt)) {
            throw new ValidationError('El número interior solo permite números, verifique su respuesta.')
          } else
            if (numeroInt.length > 10) {
              throw new ValidationError('El número interior no puede tener más de 10 caracteres, por favor ingreselo correctamente.')
            }
        }

        //Validar que se haya seleccionado una colonia
        if (colonia === '') {
          throw new ValidationError('La colonia es obligatoria, por favor busque una con el codigo postal.')
        }


        //Validar el resumen de la asesoria ,en este caso que no este vacio y que no tenga más de 250 caracteres
        if (this.#resumen.value === '') {
          throw new ValidationError('El resumen no puede estar vacío, por favor ingreselo.')
        } else if (this.#resumen.value.length > 500) {
          throw new ValidationError('El resumen no puede tener más de 500 caracteres, por favor revisa.')
        }


        //Validar que se haya seleccionado un defensor
        if (this.#nombreDefensor.value === '') {
          throw new ValidationError('Debe de seleccionar un defensor, por favor seleccione uno.')
        }
       
        // Validar la hora del turno
        if (turnoData.horaTurno === '') {
          throw new ValidationError('La hora del turno no puede estar vacía, por favor ingrésela.');
        } else { 
         //Validar que la hora sea un valor entre 0 y 23 sin regex  porfavor
          if (turnoData.horaTurno > 23) {
            throw new ValidationError('La hora del turno no es válida, por favor ingrese un valor válido.');
          }
          else if (turnoData.horaTurno < 0) {
            throw new ValidationError('La hora del turno no es válida, por favor ingrese un valor válido.');
          }
       
        }

        // Validar los minutos del turno
        if (turnoData.minutoTurno === '') {
          throw new ValidationError('Los minutos del turno no pueden estar vacíos, por favor ingréselos.');
        } else {
          // validar que los minutos sean un valor entre 0 y 59
          if (turnoData.minutoTurno > 59) {
            throw new ValidationError('Los minutos del turno no son válidos, por favor ingrese un valor válido.');
          }
          else if (turnoData.minutoTurno < 0) {
            throw new ValidationError('Los minutos del turno no son válidos, por favor ingrese un valor válido.');
          }
        }


        //Preparacion de los datos para el registro del turno
        this.#asesoria.persona.nombre = nombre;
        this.#asesoria.persona.apellido_paterno = apellidoPaterno;
        this.#asesoria.persona.apellido_materno = apellidoMaterno;
        this.#asesoria.persona.edad = edad;
        this.#asesoria.persona.genero = sexo;



        this.#asesoria.persona.domicilio.calle_domicilio = calle;
        this.#asesoria.persona.domicilio.numero_exterior_domicilio = numeroExt;
        this.#asesoria.persona.domicilio.numero_interior_domicilio = numeroInt;
        this.#asesoria.persona.domicilio.id_colonia = colonia;

        this.#asesoria.datos_asesoria.resumen_asesoria = this.#resumen.value;
        this.#asesoria.datos_asesoria.estatus_asesoria = 'TURNADA';


        //Armado de los datos del turno
        this.#asesoria.turno = {
          fecha_turno: getDate(),
          hora_turno: `${turnoData.horaTurno}:${turnoData.minutoTurno}`,
          id_defensor: Number(this.#nombreDefensor.value),
          id_asesoria: this.#asesoria.datos_asesoria.id_asesoria,
          estatus_general:"NO_SEGUIMIENTO"
        }
        delete this.#asesoria.asesorado;
        delete this.#asesoria.recibidos;
        /*
            delete this.#asesoria.defensor;
         delete this.#asesoria.asesor;
         antes de eliminarlo verifica que existan con hasOwnProperty y ademas agregale a this.#asesoria.datos_asesoria.id_empleado ya sea el id del asesor o del defensor el que exita
        */
        try {
          //Validar que exista el asesor
          if (this.#asesoria.hasOwnProperty('asesor')) {
            this.#asesoria.datos_asesoria.id_empleado = this.#asesoria.asesor.id_asesor
            delete this.#asesoria.asesor;
          }
          //Validar que exista el defensor
          if (this.#asesoria.hasOwnProperty('defensor')) {
            this.#asesoria.datos_asesoria.id_empleado = this.#asesoria.defensor.id_defensor
            delete this.#asesoria.defensor;
          }
        } catch (error) {
          console.error(error)
        }
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
        //Registro del turno
        await this.#api.putAsesoria({
          id: this.#asesoria.datos_asesoria.id_asesoria,
          data: this.#asesoria,
        })


        //Mensaje de exito
        this.#showModal('Turno registrado con éxito', 'Registrar turno', () => {
          location.href = '/'
        })
        */
          const modal = document.querySelector('modal-warning')
          modal.message = 'Si esta seguro de registrar el turno presione aceptar, de lo contrario presione x para cancelar.'
          modal.title = '¿Confirmacion de registrar turno?'

          modal.setOnCloseCallback(() => {
            if (modal.open === 'false') {
              if (modal.respuesta === true) {
                modal.respuesta = false
                //Registro del turno
                this.#api.putAsesoria({
                  id: this.#asesoria.datos_asesoria.id_asesoria,
                  data: this.#asesoria,
                }).then(response => {
                  if (response) {
                    this.#showModal('Turno registrado con éxito', 'Registrar turno', () => {
                      location.href = '/'
                    })
                  }
                }).catch(error => {
                  console.error('Error al registrar el turno:', error)
                  this.#showModal(
                    'Error al registrar el turno, por favor intenta de nuevo',
                    'Error'
                  )
                })
              }
            }
          });

          modal.open = true
         
      } catch (error) {
        //mensaje de error
        if (error instanceof ValidationError) {
          this.#showModal(error.message, 'Error de validación')
        } else {
          console.error(error)
          this.#showModal(
            'Error al registrar el turno, por favor intenta de nuevo',
            'Error'
          )
        }
      }
    })
  }

  //Metodo encargado de mostrar el modal
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }


}

customElements.define('turno-tab', TurnoTab)
