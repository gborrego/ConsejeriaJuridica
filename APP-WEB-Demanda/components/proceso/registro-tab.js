import { ValidationError } from '../../lib/errors.js'
import { validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model'
//import '../codigo-postal/codigo-postal.js'



export class RegistroTab extends HTMLElement {

  //Varianbles de clase
  #api
  #defensor
  #defensores
  #idAsesoria
  #turnos
  #turnosTable
  #turno = null

  //Metodo get que establece los atributos observados y los retorna
  static get observedAttributes() {
    return ['id', 'data']
  }

  //Metodo get que retorna el valor del atributo id
  get id() {
    return this.getAttribute('id')
  }

  //Metodo get que retorna el valor del atributo data
  set id(value) {
    this.setAttribute('id', value)
  }

  //Metodo que se encarga de verificar si el componente esta completo
  get isComplete() {
    return this.validateInputs()
  }

  //Metodo que devuelve el turno seleccionado
  get turno() {
    return this.#turno
  }

  //Metodo que devuelve el valor del atributo data
  get data() {

    const turno = this.#turno
    return {
      turno
    }
  }

  //Metodo que establece el valor del atributo data
  set data(value) {
    this.setAttribute('data', value)
  }
  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/proceso/registro-tab.html')).text();
    template.innerHTML = html;
    return template;
  }

  #pagina = 1
  #numeroPaginas

  //Este metodo se encarga de gestionar la paginacion de las asesorias
  buttonsEventListeners = () => {
    //Asignación de las variables correspondientes a los botones
    const prev = this.shadowRoot.getElementById('anterior')
    const next = this.shadowRoot.getElementById('siguiente')
    //Asignación de los eventos de los botones y la llamada de los metodos correspondientes en este caso la paginacion metodos de next y prev
    prev.addEventListener('click', this.handlePrevPage)
    next.addEventListener('click', this.handleNextPage)
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion previa
  handlePrevPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina > 1) {
      //Decremento de la pagina
      this.#pagina--
      //Llamada al metodo de consultar asesorias
      this.verificadorEstado()
    }
  }

  verificadorEstado = async () => {
    if (this.#rol === 1 || this.#rol === 2 || this.#rol === 4) {
      if (this.#defensor.value !== '0') {
        const { turnos } = await this.#api.getTurnosBusqueda(this.#defensor.value, null, false, this.#pagina)
        this.#turnos = turnos
        this.getNumeroPaginas(this.#defensor.value)
        this.fillTabla()
      }
      else {
        const { turnos } = await this.#api.getTurnosBusqueda(null, this.#api.user.id_distrito_judicial, false, this.#pagina)
        this.#turnos = turnos
        this.getNumeroPaginas(null)
        this.fillTabla()
      }

    } else if (this.#rol === 3) {
      this.getNumeroPaginas(this.#api.user.id_empleado)
      const { turnos } = await this.#api.getTurnosBusqueda(this.#idEmpleado, null, false, this.#pagina)
      this.#turnos = turnos
      this.fillTabla()
    }
  }
  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina < this.#numeroPaginas) {
      //Incremento de la pagina
      this.#pagina++
      //Llamada al metodo de consultar asesorias
      this.verificadorEstado()
    }
  }

  getNumeroPaginas = async (id_defensor) => {
    try {
      const id_distrito_judicial = this.#api.user.id_distrito_judicial
      const { totalTurnos } = await this.#api.getTurnosBusqueda(id_defensor || null, id_defensor === null ? id_distrito_judicial : null, true, 1);
      const total = this.shadowRoot.getElementById('total')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + totalTurnos
      this.#numeroPaginas = (totalTurnos) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de turnos, intente de nuevo mas tarde o verifique el status del servidor';
      modal.title = 'Error'
      modal.open = 'true'
    }
  }

  //Este metodo se encarga de verificar la cantidad de filas de la tabla y asi poder limpiar la tabla
  //y regesar true en caso de que la tabla tenga filas o regresar false en caso de que la tabla no tenga filas
  validateRows = rowsTable => {
    if (rowsTable > 0) {
      this.cleanTable(rowsTable);
      return true
    } else { return true }
  }

  //Este metodo se encarga de limpiar la tabla
  cleanTable = rowsTable => {
    const table = this.#turnosTable
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }
  //Constructor de la clase
  constructor() {
    super()
    //Id que nos ayuda a identificar el componente
    this.id = 'registro'
    this.style.display = 'block'
    //Llamada al metodo init
    this.init()
  }


  //MEtodo que inicializa las variables de la clase etc
  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    this.#api = new APIModel()
    await this.campos()
    //Llamada al metodo que obtiene los datos de la API
    await this.obtencionDatos()

  }

  //Metodo que se encarga de obtener los datos de la API
  async obtencionDatos() {
    //Llamada a los metodos que se encargan de agregar eventos a los botones, manejar los campos del formulario y llenar los inputs
    //Metodo que se encarga de agregar eventos a los botones
    this.agregarEventosBotones()
    //Lllamda al metodo que se encarga de manejar los campos del formulario
    this.manageFormFields()

    /*
    {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjo0LCJub21icmUiOiJEUFMgVXN1YXJpbyBDdWF0cm8iLCJjb3JyZW8iOiJkZWZlbnNvcmlhLnRlc3RpbmcudXN1YXJpbzRAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkaEtoQ1pBNzVKT0NJajBadVZCZkZqZXBzQnQvZzB0TVptenJPUDZ3LldGTGlKMzNSUUhhMy4iLCJpZF90aXBvdXNlciI6MSwiaWRfZGlzdHJpdG9fanVkaWNpYWwiOjQsImlkX2VtcGxlYWRvIjpudWxsLCJlc3RhdHVzX2dlbmVyYWwiOiJBQ1RJVk8iLCJwZXJtaXNvcyI6WyJBTExfU0EiLCJBTExfU0QiXSwiaWF0IjoxNzE4NTYyNjAzLCJleHAiOjE3MTg1OTE0MDN9.XebMrD3Z0AQFPEoW2UaR_dBlyzbsZupmZsdbmanUNWM",
    "name": "DPS Usuario Cuatro",
    "id_distrito_judicial": 4,
    "id_tipouser": 1,
    "id_usuario": 4,
    "permisos": [
        "ALL_SA",
        "ALL_SD"
    ]
}
    */
    const { id_usuario, id_tipouser, id_distrito_judicial, id_empleado } = this.#api.user
    this.#rol = id_tipouser
    this.#idEmpleado = id_empleado
    this.#idDistritoJudicial = id_distrito_judicial
    this.#idUsuario = id_usuario



    if (this.#rol === 1 || this.#rol === 2 || this.#rol === 4) {
      try {
        const defensores = await this.#api.getDefensoresByDistrito2(this.#api.user.id_distrito_judicial)
        this.#defensores = defensores
        try {
          const { turnos } = await this.#api.getTurnosBusqueda(null, this.#api.user.id_distrito_judicial, false, 1)
          this.#turnos = turnos
          this.fillInputs()
          this.getNumeroPaginas(null)
          this.fillTabla()
          this.#defensor.addEventListener('change', async () => {
            if (this.#defensor.value !== '0') {
              try {
                const { turnos } = await this.#api.getTurnosBusqueda(this.#defensor.value, null, false, 1);
                this.#turnos = turnos;
                this.getNumeroPaginas(this.#defensor.value);
                this.fillTabla();
              } catch (error) {
                console.error('Error fetching turnos:', error.message);
                const modal = document.querySelector('modal-warning')
                modal.setOnCloseCallback(() => { });
  
                modal.message = 'No hay turnos para el defensor seleccionado.'
                modal.title = 'Sin turnos'
                modal.open = true
                this.#defensor.value = '0'
                this.#pagina = 1
                const { turnos } = await this.#api.getTurnosBusqueda(null, this.#api.user.id_distrito_judicial, false, 1)
                this.#turnos = turnos
                this.getNumeroPaginas(null)
                this.fillTabla()
              }
            }
          });
        } catch (error) {
          console.error('Error fetching turnos:', error.message);
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {
            if (modal.open === 'false') {
              window.location = '/index.html'
            }
          })
          modal.message = 'No hay turnos asignados en el distrito .'
          modal.title = 'Sin turnos'
          modal.open = true
        }
  
      } catch (error) {
        console.error('Error fetching defensores:', error.message);
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {
          if (modal.open === 'false') {
            window.location = '/index.html'
          }
        })
        modal.message = 'No hay defensores asignados en el distrito.'
        modal.title = 'Sin defensores'
        modal.open = true
      }

   
    } else if (this.#rol === 3) {
      this.#bloqueDefensor.style.display = 'none'
      try {
        const { turnos } = await this.#api.getTurnosBusqueda(this.#api.user.id_empleado, null, false, 1);
        this.#turnos = turnos
        this.getNumeroPaginas(this.#api.user.id_empleado)
        const defensores = await this.#api.getDefensoresByDistrito2(this.#api.user.id_distrito_judicial)
        this.#defensores = defensores
        this.fillInputs()
        this.fillTabla()

      } catch (error) {
        console.error('Error fetching turnos:', error.message);
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {
          if (modal.open === 'false') {
            window.location = '/index.html'
          }
        })
        modal.message = 'No hay turnos asignados para el defensor.'
        modal.title = 'Sin turnos'
        modal.open = true
      }
    }

    this.buttonsEventListeners()

  }
  #idEmpleado
  #rol
  #idDistritoJudicial
  #idUsuario
  #bloqueDefensor
  //Metodo que se encarga de manejar los campos del formulario
  manageFormFields() {
    this.#bloqueDefensor = this.shadowRoot.getElementById('bloque-defensor')
    this.#turnosTable = this.shadowRoot.getElementById('table-turnos')
    this.#idAsesoria = this.shadowRoot.getElementById('asesoria-seleccionada')
    this.#defensor = this.shadowRoot.getElementById('defensor')
    //Aqui se agrega el evento de change correspondiente al select de defensor



  }
  //Metodo que se encarga de llenar la tabla con los turnos del defensor seleccionado
  fillTablleWithTurnosDefensor = async () => {
    try {
      //Obtencion de los turnos por defensor
      const { turnos } = await this.#api.getTurnosByDefensor(this.#defensor.value)
      //Validacion de si hay turnos para el defensor seleccionado
      if (turnos === undefined || turnos.length === 0) {
        //Mensaje de advertencia
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });

        modal.message = 'No hay turnos para el defensor seleccionado.'
        modal.title = 'Sin turnos'
        modal.open = true
        const { turnos } = await this.#api.getTurnos()
        this.#turnos = turnos
        this.fillTabla()
      }
      else {
        //Si hay turnos para el defensor seleccionado se llenara la tabla con los turnos
        this.#turnos = turnos
        this.fillTabla()

      }
    } catch (error) {
      console.error('Error al obtener los turnos por defensor:', error.message)
    }
  }

  //Metodo que se encarga de llenar la tabla con los turnos
  fillTabla() {

    /*
    try {
      const tableBody = this.#turnosTable;
      tableBody.innerHTML = '';
      const lista = this.#turnos;
      lista.forEach(turno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <tr id="turno-${turno.id_turno}">
            <td class="px-6 py-4 whitespace-nowrap">${turno.id_turno}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.defensor.nombre_defensor}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.fecha_turno}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.hora_turno}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.asesoria.datos_asesoria.estatus_asesoria}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.asesoria.tipos_juicio.tipo_juicio}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.estatus_general}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" title="Al seleccionar de nuevo un turno, el progreso se perdera" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-turno" onclick="llamarActivarBotonSeleccionar(this.value)" value="${turno.id_turno}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error al obtener los tipos de juicio:', error.message);
    }
      Pero  haz que lo segundo sea parecido a lo primero;
      */
    try {
      const turnos = this.#turnos;
      const lista = turnos;
      const table = this.#turnosTable;

      const rowsTable = table.rows.length;

      if (this.validateRows(rowsTable)) {
        lista.forEach(turno => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <tr id="turno-${turno.id_turno}">
            <td class="px-6 py-4 whitespace-nowrap">${turno.id_turno}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.defensor.nombre_defensor}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.fecha_turno}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.hora_turno}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.asesoria.datos_asesoria.estatus_asesoria}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.asesoria.tipos_juicio.tipo_juicio}</td>
            <td class="px-6 py-4 whitespace-nowrap">${turno.estatus_general}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" title="Al seleccionar de nuevo un turno, el progreso se perdera" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-turno" onclick="llamarActivarBotonSeleccionar(this.value)" value="${turno.id_turno}">
            Seleccionar
          </button>
        
            </td>

        </tr>
            `;
          table.appendChild(row);

        });

      }

    }
    catch (error) {
      console.error('Error al obtener los turnos:', error.message);
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener los turnos, intente de nuevo o verifique el status del servidor.'
      modal.title = 'Error de validación'
      modal.open = true
    }

  }

  //Metodo que se encarga de llenar los inputs
  fillInputs() {
    // Eliminar todos los hijos del elemento #defensor
    this.#defensor.innerHTML = '';

    // Agregar el primer hijo deseado
    const firstOption = document.createElement('option');
    firstOption.value = '0';
    firstOption.text = 'Selecciona un defensor';
    firstOption.disabled = true;
    firstOption.selected = true;
    this.#defensor.appendChild(firstOption);

    // Agregar los demás hijos
    this.#defensores.forEach(defensor => {
      const option = document.createElement('option');
      option.value = defensor.id_defensor;
      option.text = defensor.nombre_defensor;
      this.#defensor.appendChild(option);
    });

    //  this.fillTabla();
  }


  //Metodo que se encarga de agregar eventos a los botones , muy similar a las seccion de administraciones de campos
  agregarEventosBotones = () => {

    // Seleccionar todos los botones con la clase .seleccionar-turno esto es en la creacion de la tabla
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-turno');

    // Agregar un evento click a cada botón
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const turnoId = boton.dataset.id;
        this.#idAsesoria = turnoId;
        //Llamar a la función que activa el botón de seleccionar
        this.activarBotonSeleccionar(turnoId);
      });
    });

    // Definir la función que activa el botón de seleccionar
    const llamarActivarBotonSeleccionar = (turnoId) => {
      this.activarBotonSeleccionar(turnoId);
    };

    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;
  }

  //Metodo que se encarga de activar el boton de seleccionar y rellenar el input de asesoria seleccionada
  activarBotonSeleccionar = async turnoId => {
    try {
      // Obtener el turno por ID
      const { turno } = await this.#api.getTurnoById(turnoId);
      if (this.#turno !== null) {
        //Si el turno seleccionado es diferente al turno actual se mostrara un mensaje de advertencia y se preguntara si se desea cambiar de turno
        if (this.#turno.id_turno !== turno.id_turno) {
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => {
            if (modal.open === 'false') {
              if (modal.respuesta === true) {
                modal.respuesta = false;
                this.#turno = turno;
                this.#idAsesoria.innerHTML = turno.asesoria.datos_asesoria.id_asesoria;
              }
            }
          });
          modal.message = 'Ya has seleccionado un turno. Si eliges otro, se perderá el progreso actual.';
          modal.title = 'Advertencia';
          modal.open = 'true'
        }

      }
      else
        //Si el turno seleccionado es igual al turno actual se rellenara el input de asesoria seleccionada
        if (this.#turno === null) {
          this.#turno = turno;
          this.#idAsesoria.innerHTML = turno.asesoria.datos_asesoria.id_asesoria;
        }


    } catch (error) {
      console.error('Error al obtener el turno por ID:', error);
    }
  }




  //Metodo que se encarga de validar los inputs
  validateInputs() {

    try {

      //Validacion de si el turno es nulo o indefinido
      if (this.#turno === undefined || this.#turno === null) {
        throw new ValidationError('Selecciona un turno para continuar.')
      }


      return true
    } catch (error) {
      if (error instanceof ValidationError) {
        this.#showModal(error.message, 'Error de validación')
      } else {
        console.error(error)
        this.#showModal(
          'Error al seleccionar el turno, por favor intenta de nuevo',
          'Error'
        )
      } return false
    }
  }


  //Se conecta el callback de la clase e inicializa el boton de next
  async campos() {
    //Asignacon de la variable btnNext 
    this.btnNext = this.shadowRoot.getElementById('btn-registro-next')


    //Evento click del boton next
    this.btnNext.addEventListener('click', () => {
      if (!this.validateInputs()) return
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'promovente' },
      })
      this.dispatchEvent(event)
    })
  }

  //Metodo que se encarga de mostrar el modal de advertencia
  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.setOnCloseCallback(() => { });
    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }


}

customElements.define('registro-full-tab', RegistroTab)
