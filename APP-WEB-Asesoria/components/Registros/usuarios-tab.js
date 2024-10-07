//const template = document.createElement('template');
//import { ControllerUtils } from '......./lib/controllerUtils';
import { APIModel } from '../../models/api.model.js'
import { ValidationError } from '../../lib/errors.js'




class UsuariosTab extends HTMLElement {
  //  Variables de clase para el manejo de la API y el id de selección
  #api
  #idSeleccion
  #empleadoTipo
  #asesores
  #defensores
  #distritos
  #asesor
  #defensor
  #distrito
  #distrito2
  //#asesorRadio
  //#defensorRadio
  #bloqueOpciones
  #bloqueDistrito
  #bloqueAsesor
  #bloqueDefensor
  #nombre
  #correo
  #password
  #estatusUsuario
  #usuarios
  #distrito3
  #bloqueGeneral

  //Permisos
  #permiso_1
  #permiso_2
  #permiso_3
  #permiso_4
  #permiso_5
  #permiso_6
  #permiso_7
  #permiso_8
  #permiso_9
  #permiso_10
  #permiso_11
  #permiso_12
  #permiso_13
  #permiso_14
  #permiso_15
  #permiso_16
  #permiso_17
  #permiso_18
  #permiso_19
  #permiso_20
  #permiso_21
  #permiso_22

  #bloqueBusqueda
  #botonActivarBusqueda

  #correoFiltro
  #distritoFiltro
  #botonBuscar
  #total

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
      this.mostrarUsuarios()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina < this.#numeroPaginas) {
      //Incremento de la pagina
      this.#pagina++
      //Llamada al metodo de consultar asesorias
      this.mostrarUsuarios()
    }
  }

  getNumeroPaginas = async () => {
    try {
      const bloqueBusqueda = this.#bloqueBusqueda
      if (bloqueBusqueda.classList.contains('hidden')) {
        const { totalUsuarios } = await this.#api.getUsuariosBusqueda(undefined, undefined, true, 1)
        const total = this.#total
        total.innerHTML = ''
        total.innerHTML = 'Total :' + totalUsuarios
        this.#numeroPaginas = (totalUsuarios) / 10
      }
      else {
        const correo = this.#correoFiltro.value
        const id_distrito_judicial = this.#distritoFiltro.value
        const { totalUsuarios } = await this.#api.getUsuariosBusqueda(correo === undefined ? undefined : correo, id_distrito_judicial === '0' ? undefined : id_distrito_judicial, true, 1)
        const total = this.#total
        total.innerHTML = ''
        total.innerHTML = 'Total :' + totalUsuarios
        this.#numeroPaginas = (totalUsuarios) / 10
      }

    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de usuarios, intente de nuevo mas tarde o verifique el status del servidor';
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
    const table = this.#usuarios
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }


  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/Registros/usuarios-tab.html')).text();
    template.innerHTML = html;
    return template;
  }
  //  Constructor de la clase
  constructor() {
    super();
    //Llamada a la función init 
    this.init();
  }
  async obtenerCheckboxesSeleccionados() {
    // Obtener todos los checkboxes con el nombre "permisos"
    const checkboxes = this.shadowRoot.querySelectorAll('input[name="permisos"]:checked');

    // Crear un array para almacenar los valores seleccionados
    let permisosSeleccionados = [];

    // Recorrer todos los checkboxes seleccionados y añadir sus valores al array
    checkboxes.forEach((checkbox) => {
      permisosSeleccionados.push(checkbox.value);
    });

    // Devolver el array con los valores seleccionados
    return permisosSeleccionados;
  }
  //Funcion encargada de inicializar las variables de la clase y de llenar los campos de la tabla, etc
  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Inicialización de las variables de la clase
    this.#api = new APIModel();
    //Inicialización de la variable de selección de usuario
    this.#idSeleccion = null;

    //Llamada a la funcion de asignación de campos
    this.manageFormFields();
    this.deshabilitarPermisosAsesorias();
    this.deshabilitarPermisosDemandas();
    //Llamada a la función de llenado de campos
    this.fillInputs();
    try {
      const asesores = await this.#api.getAsesoresByDistrito(this.#api.user.id_distrito_judicial)

      this.#asesores = asesores;
    }
    catch (error) {
      console.error('Error al obtener los asesores:', error.message);
      /*
      console.error('Error al obtener los asesores:', error);
      const modal = document.querySelector('modal-warning')
      modal.message = 'No se pudo obtener la información de los asesores, por favor intente más tarde o verifique el status del servidor'
      modal.title = 'Error de conexión'
      modal.open = true
      */
    }
    try {
      const defensores = await this.#api.getDefensoresByDistrito(this.#api.user.id_distrito_judicial)
      this.#defensores = defensores;
    } catch (error) {
      console.error('Error al obtener los defensores:', error.message);
      /*
      console.error('Error al obtener los defensores:', error);
      const modal = document.querySelector('modal-warning')
      modal.message = 'No se pudo obtener la información de los defensores, por favor intente más tarde o verifique el status del servidor'
      modal.title = 'Error de conexión'
      modal.open = true 
      */
    }

    //Llamada a la función que obtiene los distritos judiciales
    const distritos = await this.#api.getDistritos();

    //Asignación de los distritos judiciales a la variable de clase
    this.#distritos = distritos;

    //Llenado del select de distritos judiciales
    if (this.#asesores) {
      const asesores = this.#asesores
      for (let i = 0; i < asesores.length; i++) {
        const asesor = asesores[i];
        const option = document.createElement('option');
        const jsonValue = JSON.stringify({
          id_asesor: asesor.id_asesor,
          id_distrito_judicial: asesor.empleado.id_distrito_judicial
        });
        option.value = jsonValue;
        option.textContent = asesor.nombre_asesor;
        this.#asesor.appendChild(option);
      }

    }

    if (this.#defensores) {
      const defensores = this.#defensores
      for (let i = 0; i < defensores.length; i++) {
        const defensor = defensores[i];
        const option = document.createElement('option');
        const jsonValue = JSON.stringify({
          id_defensor: defensor.id_defensor,
          id_distrito_judicial: defensor.empleado.id_distrito_judicial
        });
        option.value = jsonValue;
        option.textContent = defensor.nombre_defensor;
        this.#defensor.appendChild(option);
      }
    }

    //Llenado del select de distritos judiciales con respecto al select de distritios judiciales del defensor verificar html del asset si tiene duda
    this.#distritos.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.textContent = distrito.nombre_distrito_judicial
      this.#distrito.appendChild(option)
    })

    //Empleado General
    this.#distritos.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.textContent = distrito.nombre_distrito_judicial
      this.#distrito3.appendChild(option)
    })


    this.#distritos.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.textContent = distrito.nombre_distrito_judicial
      this.#distritoFiltro.appendChild(option)
    })



    //Llenado del select de distritos judiciales con respecto al select de distritios judiciales del asesor verificar html del asset si tiene duda
    this.#distritos.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.textContent = distrito.nombre_distrito_judicial
      this.#distrito2.appendChild(option)
    })





    //Lladma a la funcion de manejo de eventos de radio
    this.eventosRadiosSelect();
    //Asignación de eventos a el radio de asesor
    this.#asesor.addEventListener('change', this.handleAsesorChange);
    //Asignación de eventos a el radio de defensor
    this.#defensor.addEventListener('change', this.handleDefensorChange);


  }
  //Metodo que se encarga de seleccionar el distrito judicial de un asesor
  handleAsesorChange = () => {
    const asesor = JSON.parse(this.#asesor.value);
    this.#distrito2.value = asesor.id_distrito_judicial;
  }

  //Metodo que se encarga de seleccionar el distrito judicial de un defensor
  handleDefensorChange = () => {
    const defensor = JSON.parse(this.#defensor.value);
    this.#distrito2.value = defensor.id_distrito_judicial;
  }
  funcionBuscar = async () => {
    this.getNumeroPaginas().then(() => {
      this.mostrarUsuarios()
    })
  }
  funcionBusqueda = () => {
    const bloqueBusqueda = this.#bloqueBusqueda
    if (bloqueBusqueda.classList.contains('hidden')) {
      bloqueBusqueda.classList.remove('hidden')
    } else {
      bloqueBusqueda.classList.add('hidden')
    }
    this.getNumeroPaginas().then(() => {
      this.mostrarUsuarios()
    })
  }
  //Manejador de variables con respecto a los campos del formulario
  manageFormFields() {
    //Asignación de variables con respecto a los campos del formulario
    this.#total = this.shadowRoot.getElementById('total')
    this.#correoFiltro = this.shadowRoot.getElementById('correo-filtro')
    this.#distritoFiltro = this.shadowRoot.getElementById('distrito-judicial-filtro')
    this.#botonBuscar = this.shadowRoot.getElementById('buscar-usuario')
    this.#botonBuscar.addEventListener('click', this.funcionBuscar)
    this.#bloqueBusqueda = this.shadowRoot.getElementById('bloque-busqueda')
    this.#botonActivarBusqueda = this.shadowRoot.getElementById('activar-busqueda')
    this.#botonActivarBusqueda.addEventListener('click', this.funcionBusqueda)



    this.#empleadoTipo = this.shadowRoot.getElementById('asociacion');
    this.#bloqueGeneral = this.shadowRoot.getElementById('bloque-general');

    //Encargado de distritito
    this.#distrito = this.shadowRoot.getElementById('distrito-judicial');
    this.#bloqueDistrito = this.shadowRoot.getElementById('bloque-distrito');


    //Usuario General
    this.#distrito3 = this.shadowRoot.getElementById('distrito-judicial-general');


    //Distrito judicial del asesor o defensor
    this.#distrito2 = this.shadowRoot.getElementById('distrito-judicial2');
    // this.#asesorRadio = this.shadowRoot.getElementById('asesor-option');
    // this.#defensorRadio = this.shadowRoot.getElementById('defensor-option');
    this.#bloqueOpciones = this.shadowRoot.getElementById('bloque-opciones');
    this.#bloqueAsesor = this.shadowRoot.getElementById('bloque-asesor');
    this.#bloqueDefensor = this.shadowRoot.getElementById('bloque-defensor');
    this.#asesor = this.shadowRoot.getElementById('asesor');
    this.#defensor = this.shadowRoot.getElementById('defensor');


    this.#nombre = this.shadowRoot.getElementById('nombre');
    this.#correo = this.shadowRoot.getElementById('correo-electronico');
    this.#password = this.shadowRoot.getElementById('password');
    this.#estatusUsuario = this.shadowRoot.getElementById('estatus-usuario');

    this.#usuarios = this.shadowRoot.getElementById('table-usuario');

    //Permisos
    //Asesorias
    this.#permiso_1 = this.shadowRoot.getElementById('permiso_1');
    this.#permiso_2 = this.shadowRoot.getElementById('permiso_2');
    this.#permiso_3 = this.shadowRoot.getElementById('permiso_3');
    this.#permiso_4 = this.shadowRoot.getElementById('permiso_4');
    this.#permiso_5 = this.shadowRoot.getElementById('permiso_5');
    this.#permiso_6 = this.shadowRoot.getElementById('permiso_6');
    this.#permiso_7 = this.shadowRoot.getElementById('permiso_7');
    this.#permiso_8 = this.shadowRoot.getElementById('permiso_8');
    this.#permiso_9 = this.shadowRoot.getElementById('permiso_9');
    this.#permiso_10 = this.shadowRoot.getElementById('permiso_10');
    this.#permiso_11 = this.shadowRoot.getElementById('permiso_11');
    this.#permiso_12 = this.shadowRoot.getElementById('permiso_12');
    this.#permiso_20 = this.shadowRoot.getElementById('permiso_20');
    this.#permiso_21 = this.shadowRoot.getElementById('permiso_21');

    //Demandas
    this.#permiso_13 = this.shadowRoot.getElementById('permiso_13');
    this.#permiso_14 = this.shadowRoot.getElementById('permiso_14');
    this.#permiso_15 = this.shadowRoot.getElementById('permiso_15');
    this.#permiso_16 = this.shadowRoot.getElementById('permiso_16');
    this.#permiso_17 = this.shadowRoot.getElementById('permiso_17');
    this.#permiso_18 = this.shadowRoot.getElementById('permiso_18');
    this.#permiso_19 = this.shadowRoot.getElementById('permiso_19');
    this.#permiso_22 = this.shadowRoot.getElementById('permiso_22');

  }

  deshabilitarPermisosAsesorias() {
    //Que no se pueden usar disable
    this.#permiso_2.disabled = true;
    this.#permiso_3.disabled = true;
    this.#permiso_4.disabled = true;
    this.#permiso_5.disabled = true;
    this.#permiso_6.disabled = true;
    this.#permiso_7.disabled = true;
    this.#permiso_8.disabled = true;
    this.#permiso_9.disabled = true;
    this.#permiso_10.disabled = true;
    this.#permiso_11.disabled = true;
    this.#permiso_12.disabled = true;
    this.#permiso_20.disabled = true;
    this.#permiso_21.disabled = true;
  }

  deshabilitarPermisosDemandas() {
    //Que no se pueden usar disable
    this.#permiso_14.disabled = true;
    this.#permiso_15.disabled = true;
    this.#permiso_16.disabled = true;
    this.#permiso_17.disabled = true;
    this.#permiso_18.disabled = true;
    this.#permiso_19.disabled = true;
    this.#permiso_22.disabled = true;
  }


  habilitarPermisosAsesorias() {
    //Que no se pueden usar disable
    this.#permiso_2.disabled = false;
    this.#permiso_3.disabled = false;
    this.#permiso_4.disabled = false;
    this.#permiso_5.disabled = false;
    this.#permiso_6.disabled = false;
    this.#permiso_7.disabled = false;
    this.#permiso_8.disabled = false;
    this.#permiso_9.disabled = false;
    this.#permiso_10.disabled = false;
    this.#permiso_11.disabled = false;
    this.#permiso_12.disabled = false;
    this.#permiso_20.disabled = false;
    this.#permiso_21.disabled = false;
  }

  habilitarPermisosDemandas() {
    //Que no se pueden usar disable
    this.#permiso_14.disabled = false;
    this.#permiso_15.disabled = false;
    this.#permiso_16.disabled = false;
    this.#permiso_17.disabled = false;
    this.#permiso_18.disabled = false;
    this.#permiso_19.disabled = false;
    this.#permiso_22.disabled = false;
  }


  chequearPermisosAsesoria() {
    this.#permiso_2.checked = true;
    this.#permiso_3.checked = true;
    this.#permiso_4.checked = true;
    this.#permiso_5.checked = true;
    this.#permiso_6.checked = true;
    this.#permiso_7.checked = true;
    this.#permiso_8.checked = true;
    this.#permiso_9.checked = true;
    this.#permiso_10.checked = true;
    this.#permiso_11.checked = true;
    this.#permiso_12.checked = true;
    this.#permiso_20.checked = true;
    this.#permiso_21.checked = true;
  }

  chequearPermisosDemandas() {
    this.#permiso_14.checked = true;
    this.#permiso_15.checked = true;
    this.#permiso_16.checked = true;
    this.#permiso_17.checked = true;
    this.#permiso_18.checked = true;
    this.#permiso_19.checked = true;
    this.#permiso_22.checked = true;
  }

  deschequearPermisosAsesoria() {
    this.#permiso_2.checked = false;
    this.#permiso_3.checked = false;
    this.#permiso_4.checked = false;
    this.#permiso_5.checked = false;
    this.#permiso_6.checked = false;
    this.#permiso_7.checked = false;
    this.#permiso_8.checked = false;
    this.#permiso_9.checked = false;
    this.#permiso_10.checked = false;
    this.#permiso_11.checked = false;
    this.#permiso_12.checked = false;
    this.#permiso_20.checked = false;
    this.#permiso_21.checked = false;
  }

  deschequearPermisosDemandas() {
    this.#permiso_14.checked = false;
    this.#permiso_15.checked = false;
    this.#permiso_16.checked = false;
    this.#permiso_17.checked = false;
    this.#permiso_18.checked = false;
    this.#permiso_19.checked = false;
    this.#permiso_22.checked = false;
  }


  //Metodo encargado de validar las entradas de texto de los campos del formulario
  manejadorEntradaTexto() {
    //Asignacion de variables para proceder con los eventos de los campos de texto
    var nombreInput = this.#nombre;
    var correoInput = this.#correo;
    var passwordInput = this.#password;

    //Evento de input en el campo de nombre y validación de longitud
    nombreInput.addEventListener('input', function () {
      if (nombreInput.value.length > 45) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'El campo de nombre no puede contener más de 45 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });



    //Evento de input en el campo de correo y validación de longitud
    correoInput.addEventListener('input', function () {
      if (correoInput.value.length > 45) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'El campo de correo electrónico no puede contener más de 45 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });

    //Evento de input en el campo de contraseña y validación de longitud
    passwordInput.addEventListener('input', function () {
      if (passwordInput.value.length > 65) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => { });
        modal.message = 'El campo de contraseña no puede contener más de 65 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });

  }

  //Funcion encargada de mandar a llamar a la API para obtener los usuarios y mostrarlos en la tabla y de agregar los eventos a los botones
  fillInputs() {
    //Llamada a la función de mostrar usuarios
    this.agregarEventosBotones();
    this.getNumeroPaginas()
    this.buttonsEventListeners()
    //Llamada a la función de agregar eventos a los botones
    this.mostrarUsuarios();
  }




  //Manejador de eventos con resecto a los radio buttonsy select
  eventosRadiosSelect() {
    //Encaje de verificar si 
    //Agregar un evento de cambio al select empleadoTipo pero tambien se le debe de agregar change no sera otro
    this.#empleadoTipo.addEventListener('change', this.handleSelectChange);

    this.#permiso_1.addEventListener('change', this.checkBoxChange);
    this.#permiso_2.addEventListener('change', this.checkBoxChange);
    this.#permiso_3.addEventListener('change', this.checkBoxChange);
    this.#permiso_4.addEventListener('change', this.checkBoxChange);
    this.#permiso_5.addEventListener('change', this.checkBoxChange);
    this.#permiso_6.addEventListener('change', this.checkBoxChange);
    this.#permiso_7.addEventListener('change', this.checkBoxChange);
    this.#permiso_8.addEventListener('change', this.checkBoxChange);
    this.#permiso_9.addEventListener('change', this.checkBoxChange);
    this.#permiso_10.addEventListener('change', this.checkBoxChange);
    this.#permiso_11.addEventListener('change', this.checkBoxChange);
    this.#permiso_12.addEventListener('change', this.checkBoxChange);
    this.#permiso_13.addEventListener('change', this.checkBoxChange);
    this.#permiso_14.addEventListener('change', this.checkBoxChange);
    this.#permiso_15.addEventListener('change', this.checkBoxChange);
    this.#permiso_16.addEventListener('change', this.checkBoxChange);
    this.#permiso_17.addEventListener('change', this.checkBoxChange);
    this.#permiso_18.addEventListener('change', this.checkBoxChange);
    this.#permiso_19.addEventListener('change', this.checkBoxChange);
    this.#permiso_20.addEventListener('change', this.checkBoxChange);
    this.#permiso_21.addEventListener('change', this.checkBoxChange);
    this.#permiso_22.addEventListener('change', this.checkBoxChange);




    //this.#asesorRadio.addEventListener('change', this.handleRadioChange2);
    // this.#defensorRadio.addEventListener('change', this.handleRadioChange2);
  }
  /*
  handleRadioChange2 = () => {
    // Hide or show fields based on selected radio button
    if (this.#empleadoTipo.value === '2' || this.#empleadoTipo.value === '3') {
      if (this.#asesorRadio.checked) {
        this.#bloqueAsesor.classList.remove('hidden');
        this.#bloqueDefensor.classList.add('hidden');
      } else if (this.#defensorRadio.checked) {
        this.#bloqueDefensor.classList.remove('hidden');
        this.#bloqueAsesor.classList.add('hidden');
      }

    }
  }
    */

  checkBoxChange = () => {
    //Quiero que verifiques osea que por ejemplo por default esta seleccionado el permiso 1 y 13 porque 
    //esto hace referencia a que son todos los permisos, sin embargo, cuando 
    if (!this.#permiso_1.checked) {
      this.desabilitarPermiso1();
      this.habilitarPermisosAsesorias();
    }
    if (!this.#permiso_13.checked) {
      this.desabilitarPermiso13();
      this.habilitarPermisosDemandas();
    }



    if (this.#permiso_2.checked && this.#permiso_3.checked && this.#permiso_4.checked &&
      this.#permiso_5.checked && this.#permiso_6.checked && this.#permiso_7.checked &&
      this.#permiso_8.checked && this.#permiso_9.checked && this.#permiso_10.checked && this.#permiso_12.checked) {
      this.#permiso_1.checked = true;
      this.habilitarPermiso1();
      this.deshabilitarPermisosAsesorias();
      this.deschequearPermisosAsesoria();
    }

    if (this.#permiso_14.checked && this.#permiso_15.checked && this.#permiso_16.checked
      && this.#permiso_17.checked && this.#permiso_18.checked && this.#permiso_19.checked && this.#permiso_22.checked) {
      this.#permiso_13.checked = true;
      this.habilitarPermiso13();
      this.deshabilitarPermisosDemandas();
      this.deschequearPermisosDemandas();
    }

  }

  desabilitarPermiso1() {
    this.#permiso_1.disabled = true;
  }
  desabilitarPermiso13() {
    this.#permiso_13.disabled = true;
  }

  habilitarPermiso1() {
    this.#permiso_1.disabled = false;
  }
  habilitarPermiso13() {
    this.#permiso_13.disabled = false;
  }

  liberarPermisos() {
    this.habilitarPermiso1();
    this.habilitarPermiso13();
    this.deshabilitarPermisosDemandas();
    this.deshabilitarPermisosAsesorias();
    this.deschequearPermisosAsesoria();
    this.deschequearPermisosDemandas();
    this.#permiso_1.checked = true;
    this.#permiso_13.checked = true;
    this.#empleadoTipo.value = '1';
  }

  handleSelectChange = () => {
    // Hide or show fields based on selected radio button
    if (this.#empleadoTipo.value === '1') {
      this.#bloqueOpciones.classList.add('hidden');
      this.#bloqueDistrito.classList.remove('hidden');
      this.#bloqueGeneral.classList.add('hidden');
      this.#permiso_1.checked = true;
      this.#permiso_13.checked = true;
      this.deshabilitarPermisosDemandas();
      this.deshabilitarPermisosAsesorias();
      this.deschequearPermisosAsesoria();
      this.deschequearPermisosDemandas();
    } else if (this.#empleadoTipo.value === '2' || this.#empleadoTipo.value === '3') {
      this.#bloqueOpciones.classList.remove('hidden');
      this.#bloqueDistrito.classList.add('hidden');
      this.#bloqueGeneral.classList.add('hidden');

      if (this.#empleadoTipo.value === '2') {

        this.#bloqueAsesor.classList.remove('hidden');
        this.#bloqueDefensor.classList.add('hidden');

        this.#permiso_13.checked = false;
        this.#permiso_1.checked = true;
        this.deshabilitarPermisosAsesorias();
        this.deshabilitarPermisosDemandas();
        this.deschequearPermisosAsesoria();
        this.deschequearPermisosDemandas();
        this.habilitarPermisosDemandas();

      }
      else if (this.#empleadoTipo.value === '3') {
        this.#bloqueDefensor.classList.remove('hidden');
        this.#bloqueAsesor.classList.add('hidden');

        this.#permiso_1.checked = false;
        this.#permiso_13.checked = true;
        this.deshabilitarPermisosDemandas();
        this.deshabilitarPermisosAsesorias();
        this.deschequearPermisosAsesoria();
        this.deschequearPermisosDemandas();
        this.habilitarPermisosAsesorias();
      }

    }
    else if (this.#empleadoTipo.value === '4') {
      this.#bloqueOpciones.classList.add('hidden');
      this.#bloqueDistrito.classList.add('hidden');
      this.#bloqueGeneral.classList.remove('hidden');
      this.#permiso_1.checked = true;
      this.#permiso_13.checked = true;
      this.deshabilitarPermisosDemandas();
      this.deshabilitarPermisosAsesorias();
      this.deschequearPermisosAsesoria();
      this.deschequearPermisosDemandas();
    }
  };
  //Funcion encargada 
  agregarEventosBotones = () => {
    //Variable que contiene el boton de agregar usuario
    const agregarUsuarioBtn = this.shadowRoot.getElementById('agregar-usuario');
    //Evento de click en el boton de agregar usuario
    agregarUsuarioBtn.addEventListener('click', this.agregarUsuario);

    //Variable que contiene el boton de editar usuario
    const editarUsuarioBtn = this.shadowRoot.getElementById('editar-usuario');
    //Evento de click en el boton de editar usuario
    editarUsuarioBtn.addEventListener('click', this.editarUsuario);

    //Variable del boton de seleccionar usuario
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-usuario');
    //Iteración de los botones de seleccionar usuario
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const usuarioId = boton.value;
        this.#idSeleccion = usuarioId;
        //Llamada a la función de activar boton seleccionar
        this.activarBotonSeleccionar(usuarioId);
      });
    });

    //Funcion que manda a llamar el metodo de activar boton seleccionar
    const llamarActivarBotonSeleccionar = (usuarioId) => {
      this.activarBotonSeleccionar(usuarioId);
    }

    //Variable que contiene la redireccion del boton de seleccionar usuario
    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;

  }


  //Funcion encargada de agregar un nuevo usuario
  agregarUsuario = async () => {

    //Variable que contiene el id de seleccion de usuario y que nos sirve para verificar si previamente se ha seleccionado un usuario
    const usuarioID = this.#idSeleccion;

    //Validación de si previamente se ha seleccionado un usuario
    if (usuarioID === null) {
      //Obtención de los valores de los campos del formulario
      const nombreInput = this.#nombre.value;
      const correoInput = this.#correo.value;
      const passwordInput = this.#password.value;
      const estatusUsuarioInput = this.#estatusUsuario.value;

      try {

        //Validacion del nombre del usuario si esta vacio se mostrara un modal de error
        if (nombreInput === '') {
          //Mensaje de error
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El campo de nombre es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }


        //Validacion del correo del usuario si esta vacio se mostrara un modal de error
        if (correoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El campo de correo electrónico es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Validacion de la contraseña del usuario si esta vacio se mostrara un modal de error
        if (passwordInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El campo de contraseña es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Validacion del estatus del usuario si esta vacio se mostrara un modal de error
        if (estatusUsuarioInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El campo de estatus de usuario es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //En caso de que los campos no esten vacios se procede a realizar las validaciones de longitud y formato
        if (nombreInput !== '' && correoInput !== '' && passwordInput !== '' && estatusUsuarioInput !== '0') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          //Validacion de la longitud del nombre del usuario si es mayor a 45 caracteres se mostrara un modal de error
          if (nombreInput.length > 45) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => { });
            modal.message = 'El campo de nombre no puede contener más de 45 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else

            //Validacion de la longitud del correo del usuario si es mayor a 45 caracteres se mostrara un modal de error
            if (correoInput.length > 45) {
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => { });
              modal.message = 'El campo de correo electrónico no puede contener más de 45 caracteres.'
              modal.title = 'Error de validación'
              modal.open = true
            }
            else
              //Validacion del formato del correo del usuario si no cumple con el formato se mostrara un modal de error
              if (!emailRegex.test(correoInput)) {
                const modal = document.querySelector('modal-warning')
                modal.setOnCloseCallback(() => { });
                modal.message = 'El correo electrónico no es válido.'
                modal.title = 'Error de validación'
                modal.open = true

              }
              else
                //Validacion de la longitud de la contraseña del usuario si es mayor a 65 caracteres se mostrara un modal de error
                if (passwordInput.length > 65) {
                  const modal = document.querySelector('modal-warning')
                  modal.setOnCloseCallback(() => { });
                  modal.message = 'El campo de contraseña no puede contener más de 65 caracteres.'
                  modal.title = 'Error de validación'
                  modal.open = true
                }
                else {

                  // Esto es con el fin de verificar si has sido selecionado la opcion de empleado o encargado de distritito y asi asociar el usuario
                  if (this.#empleadoTipo.value === '2' || this.#empleadoTipo.value === '3') {
                    //En caso de que se haya seleccionado la opcion de asesor
                    if (this.#empleadoTipo.value === '2') {
                      //Validacion de si se ha seleccionado un asesor, se verifica si es igual a 0 se mostrara un modal de error
                      if (this.#asesor.value === '0') {
                        const modal = document.querySelector('modal-warning')
                        modal.setOnCloseCallback(() => { });
                        modal.message = 'Debe seleccionar un asesor para poder agregar un usuario.'
                        modal.title = 'Error de validación'
                        modal.open = true
                      }

                      else {
                        //Ahora se verifica si se ha seleccionado un distrito judicial, se verifica si es igual a 0 se mostrara un modal de error
                        if (this.#distrito2.value === '0') {
                          const modal = document.querySelector('modal-warning')
                          modal.setOnCloseCallback(() => { });
                          modal.message = 'Debe seleccionar un distrito judicial para poder agregar un usuario.'
                          modal.title = 'Error de validación'
                          modal.open = true
                          this.resetRadioAndSelect();

                        } else {

                          const nombre_asesor_select = await this.#api.getAsesorID(JSON.parse(this.#asesor.value).id_asesor);
                          // Construye la expresión regular para el nombre completo del asesor
                          const nombreCompletoRegex = new RegExp(
                            `${nombreInput}`
                          );
                          //El nombre del asesor seleccionado no coincide con el nombre ingresado se mostrara un modal de error
                          if (!nombreCompletoRegex.test(nombre_asesor_select.asesor.nombre_asesor)) {
                            const modal = document.querySelector('modal-warning');
                            modal.setOnCloseCallback(() => { });
                            modal.message = 'El nombre del asesor seleccionado no coincide con el nombre ingresado.';
                            modal.title = 'Error de validación';
                            modal.open = true;
                          } else {
                            // Resto del código si la validación pasa
                            const permisos = await this.obtenerCheckboxesSeleccionados();

                            const usuario = {
                              nombre: nombreInput,
                              correo: correoInput,
                              password: passwordInput,
                              id_distrito_judicial: this.#distrito2.value,
                              id_empleado: JSON.parse(this.#asesor.value).id_asesor,
                              estatus_general: estatusUsuarioInput.toUpperCase(),
                              id_tipouser: 2,
                              permisos: permisos
                            };
                            try {
                              /*
                              const response = await this.#api.postUsuario(usuario);
                              // console.log(usuario)
                              //const response = false;
                              if (response) {
                                this.#nombre.value = '';
                                this.#correo.value = '';
                                this.#password.value = '';
                                this.#estatusUsuario.value = '0';
                                //Llamada a la función de mostrar usuarios
                                this.mostrarUsuarios();
                                //Llamada a la función de reseteo de radio y select
                                this.resetRadioAndSelect();
                                this.liberarPermisos();
                              }
                              */
                              const modal = document.querySelector('modal-warning')

                              modal.message = 'Si esta seguro de agregar el usuario presione aceptar, de lo contrario presione x para cancelar.'

                              modal.title = '¿Confirmacion de agregar usuario?'

                              modal.setOnCloseCallback(() => {
                                if (modal.open === 'false') {
                                  if (modal.respuesta === true) {
                                    modal.respuesta = false
                                     this.#api.postUsuario(usuario).then((response) => {
                                      if (response) {
                                        this.#nombre.value = '';
                                        this.#correo.value = '';
                                        this.#password.value = '';
                                        this.#estatusUsuario.value = '0';
                                        this.getNumeroPaginas()
                                        this.mostrarUsuarios();
                                        this.resetRadioAndSelect();
                                        this.liberarPermisos();
                                      }
                                    }
                                    )
                                    .catch((error) => {
                                      console.error('Error al agregar un nuevo usuario:', error);
                                      const modal = document.querySelector('modal-warning')
                                      modal.setOnCloseCallback(() => { });
                                      modal.message = 'No se pudo agregar el usuario, por favor intente más tarde o verifique el status del servidor'
                                      modal.title = 'Error de conexión'
                                      modal.open = true
                                    });
                                    
                                  }
                                }
                              });

                              modal.open = true
                            } catch (error) {
                              console.error('Error al agregar un nuevo usuario:', error);
                              const modal = document.querySelector('modal-warning')
                              modal.setOnCloseCallback(() => { });
                              modal.message = 'No se pudo agregar el usuario, por favor intente más tarde o verifique el status del servidor'
                              modal.title = 'Error de conexión'
                              modal.open = true
                            }
                          }
                        }
                      }
                    }
                    //En caso de que se haya seleccionado la opcion de defensor
                    else if (this.#empleadoTipo.value === '3') {
                      //Validacion de si se ha seleccionado un defensor, se verifica si es igual a 0 se mostrara un modal de error
                      if (this.#defensor.value === '0') {
                        const modal = document.querySelector('modal-warning')
                        modal.setOnCloseCallback(() => { });
                        modal.message = 'Debe seleccionar un defensor para poder agregar un usuario.'
                        modal.title = 'Error de validación'
                        modal.open = true
                      } else {
                        //Ahora se verifica si se ha seleccionado un distrito judicial, se verifica si es igual a 0 se mostrara un modal de error
                        if (this.#distrito2.value === '0') {
                          const modal = document.querySelector('modal-warning')
                          modal.setOnCloseCallback(() => { });
                          modal.message = 'Debe seleccionar un distrito judicial para poder agregar un usuario.'
                          modal.title = 'Error de validación'
                          modal.open = true
                          //Se llama a la funcion de reseteo de radio y select
                          this.resetRadioAndSelect();
                        } else {
                          const nombre_defensor_select = await this.#api.getDefensorID(JSON.parse(this.#defensor.value).id_defensor);


                          const nombreCompletoRegex = new RegExp(
                            `${nombreInput}`
                          );

                          // Se verifica si el nombre del defensor seleccionado no coincide con el nombre ingresado se mostrara un modal de error
                          if (!nombreCompletoRegex.test(nombre_defensor_select.defensor.nombre_defensor)) {
                            const modal = document.querySelector('modal-warning');
                            modal.setOnCloseCallback(() => { });
                            modal.message = 'El nombre del defensor seleccionado no coincide con el nombre ingresado.';
                            modal.title = 'Error de validación';
                            modal.open = true;
                          } else {
                            // Resto del código si la validación pasa
                            const permisos = await this.obtenerCheckboxesSeleccionados();

                            const usuario = {
                              nombre: nombreInput,
                              correo: correoInput,
                              password: passwordInput,
                              id_distrito_judicial: this.#distrito2.value,
                              id_empleado: JSON.parse(this.#defensor.value).id_defensor,
                              estatus_general: estatusUsuarioInput.toUpperCase(),
                              id_tipouser: 3,
                              permisos: permisos
                            };
                            try {
                              /*
                              const response = await this.#api.postUsuario(usuario);
                              // console.log(usuario)
                              // const response = false;
                              if (response) {
                                this.#nombre.value = '';
                                this.#correo.value = '';
                                this.#password.value = '';
                                this.#estatusUsuario.value = '0';
                                this.mostrarUsuarios();
                                this.resetRadioAndSelect();

                              }
                                */
                              const modal = document.querySelector('modal-warning')

                              modal.message = 'Si esta seguro de agregar el usuario presione aceptar, de lo contrario presione x para cancelar.'

                              modal.title = '¿Confirmacion de agregar usuario?'

                              modal.setOnCloseCallback(() => {
                                if (modal.open === 'false') {
                                  if (modal.respuesta === true) {
                                    modal.respuesta = false
                                   this.#api.postUsuario(usuario).then((response) => {
                                      if (response) {
                                        this.#nombre.value = '';
                                        this.#correo.value = '';
                                        this.#password.value = '';
                                        this.#estatusUsuario.value = '0';
                                        this.getNumeroPaginas()
                                        this.mostrarUsuarios();
                                        this.resetRadioAndSelect();
                                      }
                                    }
                                    )
                                    .catch((error) => {
                                      console.error('Error al agregar un nuevo usuario:', error);
                                      const modal = document.querySelector('modal-warning')
                                      modal.setOnCloseCallback(() => { });
                                      modal.message = 'No se pudo agregar el usuario, por favor intente más tarde o verifique el status del servidor'
                                      modal.title = 'Error de conexión'
                                      modal.open = true
                                    });
                                 
                                  }}});
                              modal.open = true


                            } catch (error) {
                              console.error('Error al agregar un nuevo usuario:', error);
                              const modal = document.querySelector('modal-warning')
                              modal.setOnCloseCallback(() => { });
                              modal.message = 'No se pudo agregar el usuario, por favor intente más tarde o verifique el status del servidor'
                              modal.title = 'Error de conexión'
                              modal.open = true

                            }
                          }
                        }
                      }
                    }
                  }
                  //En caso de que se haya seleccionado la opcion de distrito judicial 
                  else if (this.#empleadoTipo.value === '1') {
                    //Validacion de si se ha seleccionado un distrito judicial, se verifica si es igual a 0 se mostrara un modal de error
                    if (this.#distrito.value === '0') {
                      const modal = document.querySelector('modal-warning')
                      modal.setOnCloseCallback(() => { });
                      modal.message = 'Debe seleccionar un distrito judicial para poder agregar un usuario.'
                      modal.title = 'Error de validación'
                      modal.open = true
                      //Se llama a la funcion de reseteo de radio y select
                      this.resetRadioAndSelect();
                    } else {
                      //Resto del código si la validación pasa
                      const permisos = await this.obtenerCheckboxesSeleccionados();

                      const usuario = {
                        nombre: nombreInput,
                        correo: correoInput,
                        password: passwordInput,
                        id_distrito_judicial: this.#distrito.value,
                        estatus_general: estatusUsuarioInput.toUpperCase(),
                        id_tipouser: 1,
                        permisos: permisos
                      };
                      try {
                        /*
                        const response = await this.#api.postUsuario(usuario);
                        //  console.log(usuario)
                        //  const response = false;
                        if (response) {
                          this.#nombre.value = '';
                          this.#correo.value = '';
                          this.#password.value = '';
                          this.#estatusUsuario.value = '0';
                          this.mostrarUsuarios();
                          this.resetRadioAndSelect();
                        }
                          */
                        const modal = document.querySelector('modal-warning')

                        modal.message = 'Si esta seguro de agregar el usuario presione aceptar, de lo contrario presione x para cancelar.'
                        modal.title = '¿Confirmacion de agregar usuario?'

                        modal.setOnCloseCallback(() => {
                          if (modal.open === 'false') {
                            if (modal.respuesta === true) {
                              modal.respuesta = false
                               this.#api.postUsuario(usuario).then((response) => {
                                if (response) {
                                  this.#nombre.value = '';
                                  this.#correo.value = '';
                                  this.#password.value = '';
                                  this.#estatusUsuario.value = '0';
                                  this.getNumeroPaginas()
                                  this.mostrarUsuarios();
                                  this.resetRadioAndSelect();
                                }
                              } 
                              )
                              .catch((error) => {
                                console.error('Error al agregar un nuevo usuario:', error);
                                const modal = document.querySelector('modal-warning')
                                modal.setOnCloseCallback(() => { });
                                modal.message = 'No se pudo agregar el usuario, por favor intente más tarde o verifique el status del servidor'
                                modal.title = 'Error de conexión'
                                modal.open = true
                              });

                          
                            }
                          }
                        });

                        modal.open = true

                      } catch (error) {
                        console.error('Error al agregar un nuevo usuario:', error);
                        const modal = document.querySelector('modal-warning')
                        modal.setOnCloseCallback(() => { });
                        modal.message = 'No se pudo agregar el usuario, por favor intente más tarde o verifique el status del servidor'
                        modal.title = 'Error de conexión'
                        modal.open = true
                      }
                    }
                  }
                  else if (this.#empleadoTipo.value === '4') {
                    //Validacion de si se ha seleccionado un distrito judicial, se verifica si es igual a 0 se mostrara un modal de error
                    if (this.#distrito3.value === '0') {
                      const modal = document.querySelector('modal-warning')
                      modal.setOnCloseCallback(() => { });
                      modal.message = 'Debe seleccionar un distrito judicial para poder agregar un usuario.'
                      modal.title = 'Error de validación'
                      modal.open = true
                      //Se llama a la funcion de reseteo de radio y select
                      this.resetRadioAndSelect();
                    } else {
                      //Resto del código si la validación pasa
                      const permisos = await this.obtenerCheckboxesSeleccionados();
                      const usuario = {
                        nombre: nombreInput,
                        correo: correoInput,
                        password: passwordInput,
                        id_distrito_judicial: this.#distrito3.value,
                        estatus_general: estatusUsuarioInput.toUpperCase(),
                        id_tipouser: 4,
                        permisos: permisos
                      };
                      try {
                        /*
                            const modal = document.querySelector('modal-warning')
              modal.message = 'Si esta seguro de agregar el catalogo presione aceptar, de lo contrario presione x para cancelar.'
              modal.title = '¿Confirmacion de agregar catalogo?'

              modal.setOnCloseCallback(() => {
                if (modal.open === 'false') {
                  if (modal.respuesta === true) {
                    modal.respuesta = false

                    this.#api.postCatalogos(nuevoCatalogo).then(response => {
                      if (response) {
                        this.#catalogo.value = '';
                        this.#estatusCatalogo.value = '0';
                        this.#idSeleccion = null;
                        this.#pagina = 1
                        this.getNumeroPaginas()
                        this.mostrarCatalogos();
                      }
                    }).catch(error => {
                      console.error('Error al agregar un nuevo catalogo:', error);
                      const modal = document.querySelector('modal-warning')
                      modal.setOnCloseCallback(() => {});

                      modal.message = 'Error al agregar un nuevo catalogo, intente de nuevo o verifique el status del servidor.'
                      modal.title = 'Error de validación'
                      modal.open = true
                    });
                  }
                }
              });
              modal.open = true
                        */
                        /*
                        const response = await this.#api.postUsuario(usuario);
                        //   console.log(usuario)
                        //     const response = false;
                        if (response) {
                          this.#nombre.value = '';
                          this.#correo.value = '';
                          this.#password.value = '';
                          this.#estatusUsuario.value = '0';
                          this.mostrarUsuarios();
                          this.resetRadioAndSelect();
                        }
                          */
                        const modal = document.querySelector('modal-warning')
                        modal.message = 'Si esta seguro de agregar el usuario presione aceptar, de lo contrario presione x para cancelar.'
                        modal.title = '¿Confirmacion de agregar usuario?'

                        modal.setOnCloseCallback(() => {
                          if (modal.open === 'false') {
                            if (modal.respuesta === true) {
                              modal.respuesta = false
                               this.#api.postUsuario(usuario).then((response) => {
                                if (response) {
                                  this.#nombre.value = '';
                                  this.#correo.value = '';
                                  this.#password.value = '';
                                  this.#estatusUsuario.value = '0';
                                  this.getNumeroPaginas()
                                  this.mostrarUsuarios();
                                  this.resetRadioAndSelect();
                                }
                              } 
                              )
                              .catch((error) => {
                                console.error('Error al agregar un nuevo usuario:', error);
                                const modal = document.querySelector('modal-warning')
                                modal.setOnCloseCallback(() => { });
                                modal.message = 'No se pudo agregar el usuario, por favor intente más tarde o verifique el status del servidor'
                                modal.title = 'Error de conexión'
                                modal.open = true
                              });
                            
                            }
                          }
                        });
                        modal.open = true

                      } catch (error) {
                        console.error('Error al agregar un nuevo usuario:', error);
                        const modal = document.querySelector('modal-warning')
                        modal.setOnCloseCallback(() => { });
                        modal.message = 'No se pudo agregar el usuario, por favor intente más tarde o verifique el status del servidor'
                        modal.title = 'Error de conexión'
                        modal.open = true
                      }
                    }
                  }
                }

        }

      } catch (error) {
        console.error('Error al agregar un nuevo usuario:', error);
      }
    } else {
      //Mensaje de error en caso de que se haya seleccionado un usuario previamente
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });
      modal.message = 'No se puede agregar un nuevo usuario si ya se ha seleccionado uno, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#nombre.value = '';
      this.#correo.value = '';
      this.#password.value = '';
      this.#estatusUsuario.value = '0';
      this.#idSeleccion = null;
      this.getNumeroPaginas()

      this.mostrarUsuarios();
      this.resetRadioAndSelect();
      this.liberarRadioAndSelect();

    }
  }

  // Metodo que se encarga de bloquear los radio select y listas con el fin de que no se puedan modificar cuando estos se editen
  bloquearRadioAndSelect = () => {
    this.#empleadoTipo.disabled = true;
    // this.#asesorRadio.disabled = true;
    // this.#defensorRadio.disabled = true;
    this.#distrito.disabled = true;
    this.#asesor.disabled = true;
    this.#defensor.disabled = true;
    this.#distrito2.disabled = true;
    this.#distrito3.disabled = true;

  }
  // Metodo que se encarga de liberar los radio select y listas con el fin de que se puedan modificar cuando estos se editen
  liberarRadioAndSelect = () => {
    this.#empleadoTipo.disabled = false;
    // this.#asesorRadio.disabled = false;
    //this.#defensorRadio.disabled = false;
    this.#distrito.disabled = false;
    this.#asesor.disabled = false;
    this.#defensor.disabled = false;
    this.#distrito2.disabled = false;
    this.#distrito3.disabled = false;

  }

  //Funcion encargada de activar a su estado los radio y select cuando se agrega o actualiza un usuario
  resetRadioAndSelect = () => {
    this.#empleadoTipo.value = '1';
    //this.#asesorRadio.checked = false;
    // this.#defensorRadio.checked = false;
    this.#distrito.value = '0';
    this.#asesor.value = '0';
    this.#defensor.value = '0';
    this.#distrito2.value = '0';

    this.#bloqueOpciones.classList.add('hidden');
    this.#bloqueDistrito.classList.add('hidden');
    this.#bloqueAsesor.classList.add('hidden');
    this.#bloqueDefensor.classList.add('hidden');
    this.#bloqueGeneral.classList.add('hidden');

    this.#bloqueDistrito.classList.remove('hidden');

    this.#empleadoTipo.value = '1';
    // this.#asesorRadio.checked = true;

    this.liberarPermisos();

  }

  //Metodo encargado de editar un usuario 
  editarUsuario = async () => {
    //Variable que contiene el id de seleccion de usuario y que nos sirve para verificar si previamente se ha seleccionado un usuario
    const usuarioID = this.#idSeleccion;
    const validarPermisosIguales = async (permisos_usuario, permisos_seleccionados) => {
      // Verifica si ambas listas tienen la misma longitud
      if (permisos_usuario.length !== permisos_seleccionados.length) {
        return false;
      }

      // Ordena ambas listas
      permisos_usuario.sort();
      permisos_seleccionados.sort();

      // Compara los elementos de las listas ordenadas
      for (let i = 0; i < permisos_usuario.length; i++) {
        if (permisos_usuario[i] !== permisos_seleccionados[i]) {
          return false;
        }
      }

      // Si todos los elementos son iguales, retorna true
      return true;
    }

    if (usuarioID === null) {
      //Mensaje de error en caso de que no se haya seleccionado un usuario previamente
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });
      modal.message = 'Debe seleccionar un usuario para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //  console.log("Paso validaciones 1")
      //Variables que contienen los valores de los campos del formulario
      const nombreInput = this.#nombre.value;
      const correoInput = this.#correo.value;
      const passwordInput = this.#password.value;
      const estatusUsuarioInput = this.#estatusUsuario.value;

      try {
        //Validacion del nombre del usuario si esta vacio se mostrara un modal de error
        if (nombreInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El campo de nombre es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }


        //Validacion del correo del usuario si esta vacio se mostrara un modal de error
        if (correoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El campo de correo electrónico es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }


        //Validacion del estatus del usuario si esta vacio se mostrara un modal de error
        if (estatusUsuarioInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => { });
          modal.message = 'El campo de estatus de usuario es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }
        //   console.log("Paso validaciones 2")

        //En caso de que los campos no esten vacios se procede a realizar las validaciones de longitud y formato
        if (nombreInput !== '' && correoInput !== '' && estatusUsuarioInput !== '0') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          //    console.log("Paso validaciones 3")
          //Validacion de la longitud del nombre del usuario si es mayor a 45 caracteres se mostrara un modal de error
          if (nombreInput.length > 45) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => { });
            modal.message = 'El campo de nombre no puede contener más de 45 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else

            //Validacion de la longitud del correo del usuario si es mayor a 45 caracteres se mostrara un modal de error
            if (correoInput.length > 45) {
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => { });
              modal.message = 'El campo de correo electrónico no puede contener más de 45 caracteres.'
              modal.title = 'Error de validación'
              modal.open = true
            }
            else
              //Validacion del formato del correo del usuario si no cumple con el formato se mostrara un modal de error
              if (!emailRegex.test(correoInput)) {
                const modal = document.querySelector('modal-warning')
                modal.setOnCloseCallback(() => { });
                modal.message = 'El correo electrónico no es válido.'
                modal.title = 'Error de validación'
                modal.open = true

              }
              else {
                // console.log("Paso validaciones 4")
                //En caso de que se haya seleccionado la opcion de empleado se procedara a realizar las validaciones correspondientes
                if (this.#empleadoTipo.value === '2' || this.#empleadoTipo.value === '3') {
                  //En caso de que se haya seleccionado la opcion de asesor
                  if (this.#empleadoTipo.value === '2') {

                    //Validacion de si se ha seleccionado un asesor, se verifica si es igual a 0 se mostrara un modal de error
                    if (this.#asesor.value === '0') {
                      const modal = document.querySelector('modal-warning')
                      modal.setOnCloseCallback(() => { });
                      modal.message = 'Debe seleccionar un asesor para poder editar un usuario.'
                      modal.title = 'Error de validación'
                      modal.open = true
                    }

                    else {
                      //  console.log("Paso validaciones 5")
                      //Ahora se verifica si se ha seleccionado un distrito judicial, se verifica si es igual a 0 se mostrara un modal de error
                      if (this.#distrito2.value === '0') {
                        const modal = document.querySelector('modal-warning')
                        modal.setOnCloseCallback(() => { });
                        modal.message = 'Debe seleccionar un distrito judicial para poder editar un usuario.'
                        modal.title = 'Error de validación'
                        modal.open = true

                      } else {
                        //Datos del usuario a editar
                        const permisos = await this.obtenerCheckboxesSeleccionados();

                        const usuario = {
                          id_usuario: usuarioID,
                          nombre: nombreInput,
                          correo: correoInput,
                          id_distrito_judicial: parseInt(this.#distrito2.value),
                          id_empleado: JSON.parse(this.#asesor.value).id_asesor,
                          estatus_general: estatusUsuarioInput.toUpperCase(),
                          id_tipouser: 2,
                          permisos: permisos
                        };
                        const nombre_asesor_select = await this.#api.getAsesorID(JSON.parse(this.#asesor.value).id_asesor);
                        // Construye la expresión regular para el nombre completo del asesor
                        const nombreCompletoRegex = new RegExp(
                          `${nombreInput}`
                        );

                        //El nombre del asesor seleccionado no coincide con el nombre ingresado se mostrara un modal de error
                        if (!nombreCompletoRegex.test(nombre_asesor_select.asesor.nombre_asesor)) {
                          const modal = document.querySelector('modal-warning');
                          modal.setOnCloseCallback(() => { });
                          modal.message = 'El nombre del asesor seleccionado no coincide con el nombre ingresado.';
                          modal.title = 'Error de validación';
                          modal.open = true;
                        } else {
                          //   console.log("Paso validaciones 6")
                          const usuario_pre = await this.#api.getUsuarioByID(usuarioID);
                          const usuario_objet_find = usuario_pre.usuario;

                          //Validacion de si los datos del usuario son iguales a los actuales se mostrara un modal de error
                          if (usuario.nombre === usuario_objet_find.nombre &&
                            usuario.correo === usuario_objet_find.correo &&
                            usuario.id_distrito_judicial === usuario_objet_find.id_distrito_judicial &&
                            usuario.id_empleado === usuario_objet_find.id_empleado
                            && usuario.estatus_general === usuario_objet_find.estatus_general
                            && usuario.id_tipouser === usuario_objet_find.tipo_user.id_tipouser
                            && await validarPermisosIguales(usuario.permisos, usuario_objet_find.permisos) === true) {

                            const modal = document.querySelector('modal-warning')
                            modal.setOnCloseCallback(() => { });
                            modal.message = 'No se ha realizado ningún cambio en el usuario,. ya que los datos son iguales a los actuales, se eliminaran los campos.'
                            modal.title = 'Error de validación'
                            modal.open = true
                            this.#nombre.value = '';
                            this.#correo.value = '';
                            this.#password.value = '';
                            this.#estatusUsuario.value = '0';
                            this.liberarRadioAndSelect();
                            this.resetRadioAndSelect();
                          }
                          else {

                            //   console.log("Paso validaciones 7")
                            try {
                              /*const response = await this.#api.putUsuario(this.#idSeleccion, usuario);
                             //    console.log(usuario)
                             //  const response = false;
                             if (response) {
                               this.#nombre.value = '';
                               this.#correo.value = '';
                               this.#password.value = '';
                               this.#estatusUsuario.value = '0';
                               this.mostrarUsuarios();
                               this.liberarRadioAndSelect();
                               this.resetRadioAndSelect();
                             }
                               */
                              const modal = document.querySelector('modal-warning')
                              modal.message = 'Si esta seguro de editar el usuario presione aceptar, de lo contrario presione x para cancelar.'
                              modal.title = '¿Confirmacion de editar usuario?'

                              modal.setOnCloseCallback(() => {
                                if (modal.open === 'false') {

                                  if (modal.respuesta === true) {
                                    modal.respuesta = false
                                    try {
                                      this.#api.putUsuario(this.#idSeleccion, usuario).then((response) => {
                                        if (response) {
                                          this.#nombre.value = '';
                                          this.#correo.value = '';
                                          this.#password.value = '';
                                          this.#estatusUsuario.value = '0'; this.getNumeroPaginas()
  
                                          this.mostrarUsuarios();
                                          this.liberarRadioAndSelect();
                                          this.resetRadioAndSelect();
                                        }
                                      }
                                      )
                                      .catch((error) => {
                                        console.error('Error al editar un usuario:', error);
                                        const modal = document.querySelector('modal-warning')
                                        modal.setOnCloseCallback(() => { });
                                        modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                                        modal.title = 'Error de conexión'
                                        modal.open = true
                                      });
                                     
                                    } catch (error) {
                                      console.error('Error al editar un usuario:', error);
                                      const modal = document.querySelector('modal-warning')
                                      modal.setOnCloseCallback(() => { });
                                      modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                                      modal.title = 'Error de conexión'
                                      modal.open = true

                                    }
                                  }
                                }
                              }
                              );
                              modal.open = true
                            } catch (error) {
                              console.error('Error al editar un usuario:', error);
                              const modal = document.querySelector('modal-warning')
                              modal.setOnCloseCallback(() => { });
                              modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                              modal.title = 'Error de conexión'
                              modal.open = true

                            }
                          }
                        }

                      }

                    }
                  }
                  else
                    //En caso de que se haya seleccionado la opcion de defensor
                    if (this.#empleadoTipo.value === '3') {
                      //Validacion de si se ha seleccionado un defensor, se verifica si es igual a 0 se mostrara un modal de error
                      if (this.#defensor.value === '0') {
                        const modal = document.querySelector('modal-warning')
                        modal.message = 'Debe seleccionar un defensor para poder editar un usuario.'
                        modal.title = 'Error de validación'
                        modal.open = true
                      } else {
                        //Ahora se verifica si se ha seleccionado un distrito judicial, se verifica si es igual a 0 se mostrara un modal de error
                        if (this.#distrito2.value === '0') {
                          //Mensaje de error
                          const modal = document.querySelector('modal-warning')
                          modal.setOnCloseCallback(() => { });
                          modal.message = 'Debe seleccionar un distrito judicial para poder editar un usuario.'
                          modal.title = 'Error de validación'
                          modal.open = true
                        } else {
                          //Datos del usuario a editar
                          const permisos = await this.obtenerCheckboxesSeleccionados();

                          const usuario = {
                            id_usuario: usuarioID,
                            nombre: nombreInput,
                            correo: correoInput,
                            id_distrito_judicial: parseInt(this.#distrito2.value),
                            id_empleado: JSON.parse(this.#defensor.value).id_defensor,
                            estatus_general: estatusUsuarioInput.toUpperCase(),
                            id_tipouser: 3,
                            permisos: permisos
                          };

                          const nombre_defensor_select = await this.#api.getDefensorID(JSON.parse(this.#defensor.value).id_defensor);


                          const nombreCompletoRegex = new RegExp(
                            `${nombreInput}`
                          );

                          //El nombre del defensor seleccionado no coincide con el nombre ingresado se mostrara un modal de error
                          if (!nombreCompletoRegex.test(nombre_defensor_select.defensor.nombre_defensor)) {
                            const modal = document.querySelector('modal-warning');
                            modal.setOnCloseCallback(() => { });
                            modal.message = 'El nombre del defensor seleccionado no coincide con el nombre ingresado.';
                            modal.title = 'Error de validación';
                            modal.open = true;
                          } else {
                            const usuario_pre = await this.#api.getUsuarioByID(usuarioID);
                            const usuario_objet_find = usuario_pre.usuario;

                            //Validacion de si los datos del usuario son iguales a los actuales se mostrara un modal de error
                            if (usuario.nombre === usuario_objet_find.nombre && usuario.correo === usuario_objet_find.correo
                              && usuario.id_distrito_judicial === usuario_objet_find.id_distrito_judicial
                              && usuario.id_empleado === usuario_objet_find.id_empleado
                              && usuario.estatus_general === usuario_objet_find.estatus_general
                              && usuario.id_tipouser === usuario_objet_find.tipo_user.id_tipouser
                              && await validarPermisosIguales(usuario.permisos, usuario_objet_find.permisos) === true) {
                              const modal = document.querySelector('modal-warning')
                              modal.setOnCloseCallback(() => { });
                              modal.message = 'No se ha realizado ningún cambio en el usuario,. ya que los datos son iguales a los actuales, se eliminaran los campos.'
                              modal.title = 'Error de validación'
                              modal.open = true
                              this.#nombre.value = '';
                              this.#correo.value = '';
                              this.#password.value = '';
                              this.#estatusUsuario.value = '0';
                              this.liberarRadioAndSelect();
                              this.resetRadioAndSelect();
                            }
                            else {
                              try {
                                /*Llamada a la funcion de editar usuario del api
                                const response = await this.#api.putUsuario(this.#idSeleccion, usuario);
                                // console.log(usuario)
                                // const response = false;
                                if (response) {
                                  this.#nombre.value = '';
                                  this.#correo.value = '';
                                  this.#password.value = '';
                                  this.#estatusUsuario.value = '0';
                                  this.mostrarUsuarios();
                                  this.liberarRadioAndSelect();
                                  this.resetRadioAndSelect();

                                }
                                */
                                const modal = document.querySelector('modal-warning')
                                modal.message = 'Si esta seguro de editar el usuario presione aceptar, de lo contrario presione x para cancelar.'
                                modal.title = '¿Confirmacion de editar usuario?'

                                modal.setOnCloseCallback(() => {
                                  if (modal.open === 'false') {

                                    if (modal.respuesta === true) {
                                      modal.respuesta = false
                                      try {
                                         this.#api.putUsuario(this.#idSeleccion, usuario).then((response) => {
                                          if (response) {
                                            this.#nombre.value = '';
                                            this.#correo.value = '';
                                            this.#password.value = '';
                                            this.#estatusUsuario.value = '0'; this.getNumeroPaginas()

                                            this.mostrarUsuarios();
                                            this.liberarRadioAndSelect();
                                            this.resetRadioAndSelect();
                                          }
                                        }
                                        )
                                        .catch((error) => {
                                          console.error('Error al editar un usuario:', error);
                                          const modal = document.querySelector('modal-warning')
                                          modal.setOnCloseCallback(() => { });
                                          modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                                          modal.title = 'Error de conexión'
                                          modal.open = true
                                        });
                                      } catch (error) {
                                        console.error('Error al editar un usuario:', error);
                                        const modal = document.querySelector('modal-warning')
                                        modal.setOnCloseCallback(() => { });
                                        modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                                        modal.title = 'Error de conexión'
                                        modal.open = true
                                      }
                                    }
                                  }
                                }
                                );

                                modal.open = true
                              } catch (error) {
                                console.error('Error al editar un usuario:', error);
                                const modal = document.querySelector('modal-warning')
                                modal.setOnCloseCallback(() => { });
                                modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                                modal.title = 'Error de conexión'
                                modal.open = true


                              }
                            }
                          }
                        }
                      }
                    }

                } else
                  //En caso de que se haya seleccionado la opcion de distrito judicial
                  if (this.#empleadoTipo.value === '1') {
                    //Validacion de si se ha seleccionado un distrito judicial, se verifica si es igual a 0 se mostrara un modal de error
                    if (this.#distrito.value === '0') {
                      const modal = document.querySelector('modal-warning')
                      modal.setOnCloseCallback(() => { });
                      modal.message = 'Debe seleccionar un distrito judicial para poder editar un usuario.'
                      modal.title = 'Error de validación'
                      modal.open = true
                      this.liberarRadioAndSelect();
                      this.resetRadioAndSelect();
                    } else {
                      //Datos del usuario a editar
                      const permisos = await this.obtenerCheckboxesSeleccionados();

                      const usuario = {
                        id_usuario: usuarioID,
                        nombre: nombreInput,
                        correo: correoInput,
                        id_distrito_judicial: parseInt(this.#distrito.value),
                        estatus_general: estatusUsuarioInput.toUpperCase(),
                        id_tipouser: 1,
                        permisos: permisos
                      };
                      const usuario_pre = await this.#api.getUsuarioByID(usuarioID);
                      const usuario_objet_find = usuario_pre.usuario;

                      //Validacion de si los datos del usuario son iguales a los actuales se mostrara un modal de error
                      if (usuario.nombre === usuario_objet_find.nombre && usuario.correo === usuario_objet_find.correo &&
                        usuario.id_distrito_judicial === usuario_objet_find.id_distrito_judicial &&
                        usuario.estatus_general === usuario_objet_find.estatus_general &&
                        usuario.id_tipouser === usuario_objet_find.tipo_user.id_tipouser
                        && await validarPermisosIguales(usuario.permisos, usuario_objet_find.permisos) === true) {

                        const modal = document.querySelector('modal-warning')
                        modal.setOnCloseCallback(() => { });
                        modal.message = 'No se ha realizado ningún cambio en el usuario,. ya que los datos son iguales a los actuales, se eliminaran los campos.'
                        modal.title = 'Error de validación'
                        modal.open = true
                        this.#nombre.value = '';
                        this.#correo.value = '';
                        this.#password.value = '';
                        this.#estatusUsuario.value = '0';
                        this.liberarRadioAndSelect();
                        this.resetRadioAndSelect();
                      }
                      else {
                        try {
                          /*
                          const response = await this.#api.putUsuario(this.#idSeleccion, usuario);
                          //  console.log(usuario)
                          //  const response = false;

                          if (response) {
                            this.#nombre.value = '';
                            this.#correo.value = '';
                            this.#password.value = '';
                            this.#estatusUsuario.value = '0';
                            this.mostrarUsuarios();
                            this.liberarRadioAndSelect();
                            this.resetRadioAndSelect();
                          }
                          */
                          const modal = document.querySelector('modal-warning')
                          modal.message = 'Si esta seguro de editar el usuario presione aceptar, de lo contrario presione x para cancelar.'
                          modal.title = '¿Confirmacion de editar usuario?'

                          modal.setOnCloseCallback(() => {
                            if (modal.open === 'false') {
                              if (modal.respuesta === true) {
                                modal.respuesta = false
                                try {
                                   this.#api.putUsuario(this.#idSeleccion, usuario).then((response) => {
                                  if (response) {
                                    this.#nombre.value = '';
                                    this.#correo.value = '';
                                    this.#password.value = '';
                                    this.#estatusUsuario.value = '0'; this.getNumeroPaginas()
                                    this.mostrarUsuarios();
                                    this.liberarRadioAndSelect();
                                    this.resetRadioAndSelect();
                                  }
                                }
                                )
                                .catch((error) => {
                                  console.error('Error al editar un usuario:', error);
                                  const modal = document.querySelector('modal-warning')
                                  modal.setOnCloseCallback(() => { });
                                  modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                                  modal.title = 'Error de conexión'
                                  modal.open = true
                                });
                                } catch (error) {
                                  console.error('Error al editar un usuario:', error);
                                  const modal = document.querySelector('modal-warning')
                                  modal.setOnCloseCallback(() => { });
                                  modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                                  modal.title = 'Error de conexión'
                                  modal.open = true
                                }
                              }
                            }
                          }
                          );

                          modal.open = true
                        } catch (error) {
                          console.error('Error al editar un usuario:', error);
                          const modal = document.querySelector('modal-warning')
                          modal.setOnCloseCallback(() => { });
                          modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                          modal.title = 'Error de conexión'
                          modal.open = true
                        }
                      }
                    }
                  }
                  else
                    //En caso de que se haya seleccionado la opcion de distrito judicial
                    if (this.#empleadoTipo.value === '4') {
                      //Validacion de si se ha seleccionado un distrito judicial, se verifica si es igual a 0 se mostrara un modal de error
                      if (this.#distrito3.value === '0') {
                        const modal = document.querySelector('modal-warning')
                        modal.setOnCloseCallback(() => { });
                        modal.message = 'Debe seleccionar un distrito judicial para poder editar un usuario.'
                        modal.title = 'Error de validación'
                        modal.open = true
                        this.liberarRadioAndSelect();
                        this.resetRadioAndSelect();
                      } else {
                        //Datos del usuario a editar
                        const permisos = await this.obtenerCheckboxesSeleccionados();

                        const usuario = {
                          id_usuario: usuarioID,
                          nombre: nombreInput,
                          correo: correoInput,
                          id_distrito_judicial: parseInt(this.#distrito3.value),
                          estatus_general: estatusUsuarioInput.toUpperCase(),
                          id_tipouser: 4,
                          permisos: permisos
                        };

                        const usuario_pre = await this.#api.getUsuarioByID(usuarioID);
                        const usuario_objet_find = usuario_pre.usuario;

                        //Validacion de si los datos del usuario son iguales a los actuales se mostrara un modal de error
                        if (usuario.nombre === usuario_objet_find.nombre && usuario.correo === usuario_objet_find.correo &&
                          usuario.id_distrito_judicial === usuario_objet_find.id_distrito_judicial &&
                          usuario.estatus_general === usuario_objet_find.estatus_general &&
                          usuario.id_tipouser === usuario_objet_find.tipo_user.id_tipouser
                          && await validarPermisosIguales(usuario.permisos, usuario_objet_find.permisos) === true) {
                          const modal = document.querySelector('modal-warning')
                          modal.setOnCloseCallback(() => { });
                          modal.message = 'No se ha realizado ningún cambio en el usuario,. ya que los datos son iguales a los actuales, se eliminaran los campos.'
                          modal.title = 'Error de validación'
                          modal.open = true
                          this.#nombre.value = '';
                          this.#correo.value = '';
                          this.#password.value = '';
                          this.#estatusUsuario.value = '0';
                          this.liberarRadioAndSelect();
                          this.resetRadioAndSelect();
                        }
                        else {
                          try {
                            /*
                            const modal = document.querySelector('modal-warning')
              modal.message = 'Si esta seguro de agregar el empleado presione aceptar, de lo contrario presione x para cancelar.'
              modal.title = '¿Confirmacion de agregar empleado?'

              modal.setOnCloseCallback(() => {
                if (modal.open === 'false') {
                  if (modal.respuesta === true) {
                    modal.respuesta = false

                    this.#api.postEmpleado(nuevoEmpleado).then(response => {
                      if (response) {
                        this.#nombre.value = '';
                        this.#tipoUsuario.value = '0';
                        this.#estatusUsuario.value = '0';
                        this.#distritoJudicial.value = '0';
                        this.#idSeleccion = null;
                        this.#distritoJudicial.value = this.#api.user.id_distrito_judicial;
                        this.mostrarEmpleados();
                      }
                    }).catch(error => {
                      console.error('Error al agregar un nuevo empleado:', error);
                      const modal = document.querySelector('modal-warning')
                      modal.setOnCloseCallback(() => {});

                      modal.message = 'Error al agregar un nuevo empleado, por favor intente de nuevo, o verifique el status del servidor.'
                      modal.title = 'Error al agregar empleado'
                      modal.open = true
                    });
                  }
                }
              }
              );

              modal.open = true
                            */
                            /*
                             const response = await this.#api.putUsuario(this.#idSeleccion, usuario);
                             // console.log(usuario)
                             // const response = false;
 
                             if (response) {
                               this.#nombre.value = '';
                               this.#correo.value = '';
                               this.#password.value = '';
                               this.#estatusUsuario.value = '0';
                               this.mostrarUsuarios();
                               this.liberarRadioAndSelect();
                               this.resetRadioAndSelect();
                             }
                               */
                            const modal = document.querySelector('modal-warning')
                            modal.message = 'Si esta seguro de editar el usuario presione aceptar, de lo contrario presione x para cancelar.'
                            modal.title = '¿Confirmacion de editar usuario?'

                            modal.setOnCloseCallback(() => {
                              if (modal.open === 'false') {
                                if (modal.respuesta === true) {
                                  modal.respuesta = false
                                  try {
                                      this.#api.putUsuario(this.#idSeleccion, usuario).then((response) => {
                                      if (response) {
                                        this.#nombre.value = '';
                                        this.#correo.value = '';
                                        this.#password.value = '';
                                        this.#estatusUsuario.value = '0'; this.getNumeroPaginas()
                                        this.mostrarUsuarios();
                                        this.liberarRadioAndSelect();
                                        this.resetRadioAndSelect();
                                      }
                                    }
                                    )
                                    .catch((error) => {
                                      console.error('Error al editar un usuario:', error);
                                      const modal = document.querySelector('modal-warning')
                                      modal.setOnCloseCallback(() => { });
                                      modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                                      modal.title = 'Error de conexión'
                                      modal.open = true
                                    });
                                  } catch (error) {
                                    console.error('Error al editar un usuario:', error);
                                    const modal = document.querySelector('modal-warning')
                                    modal.setOnCloseCallback(() => { });
                                    modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                                    modal.title = 'Error de conexión'
                                    modal.open = true
                                  }
                                }
                              }
                            }
                            );

                            modal.open = true

                          } catch (error) {
                            console.error('Error al editar un usuario:', error);
                            const modal = document.querySelector('modal-warning')
                            modal.setOnCloseCallback(() => { });
                            modal.message = 'No se pudo editar el usuario, por favor intente más tarde o verifique el status del servidor'
                            modal.title = 'Error de conexión'
                            modal.open = true
                          }
                        }
                      }
                    }
              }

        }

      } catch (error) {
        console.error('Error al editar un usuario:', error);
      }
    }

  }



  //Metodo encargado de mostrar los usuarios en la tabla
  mostrarUsuarios = async () => {
  
    try {
      const bloqueBusqueda = this.#bloqueBusqueda;

      if (bloqueBusqueda.classList.contains('hidden')) {
        const usuarios = await this.#api.getUsuariosBusqueda(undefined, undefined, false, this.#pagina);
        const lista = usuarios.usuarios;
        const rowsTable = this.#usuarios.rows.length
        if (this.validateRows(rowsTable)) {
          lista.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <tr id="usuario-${usuario.id_usuario}">
            <td class="px-6 py-4 whitespace-nowrap">${usuario.id_usuario}</td>
            <td class="px-6 py-4 whitespace-nowrap">${usuario.nombre}</td>
            <td class="px-6 py-4 whitespace-nowrap">${usuario.tipo_user.tipo_usuario}</td>
            <td class="px-6 py-4 whitespace-nowrap">${usuario.id_distrito_judicial}</td>
            <td class="px-6 py-4 whitespace-nowrap">${usuario.estatus_general}</td>
               <td class="px-6 py-4 whitespace-nowrap">${usuario.correo}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-usuario" onclick="llamarActivarBotonSeleccionar(this.value)" value="${usuario.id_usuario}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `;
            this.#usuarios.appendChild(row);
          })

        }
      }
      else {
        const correo = this.#correoFiltro.value;
        const id_distrito_judicial = this.#distritoFiltro.value;
        const usuarios = await this.#api.getUsuariosBusqueda(correo === undefined ? undefined : correo, id_distrito_judicial === '0' ? undefined : id_distrito_judicial, false, this.#pagina)
        const lista = usuarios.usuarios;
        const rowsTable = this.#usuarios.rows.length
        if (this.validateRows(rowsTable)) {
          lista.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <tr id="usuario-${usuario.id_usuario}">
            <td class="px-6 py-4 whitespace-nowrap">${usuario.id_usuario}</td>
            <td class="px-6 py-4 whitespace-nowrap">${usuario.nombre}</td>
            <td class="px-6 py-4 whitespace-nowrap">${usuario.tipo_user.tipo_usuario}</td>
            <td class="px-6 py-4 whitespace-nowrap">${usuario.id_distrito_judicial}</td>
            <td class="px-6 py-4 whitespace-nowrap">${usuario.estatus_general}</td>
                           <td class="px-6 py-4 whitespace-nowrap">${usuario.correo}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-usuario" onclick="llamarActivarBotonSeleccionar(this.value)" value="${usuario.id_usuario}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `;
            this.#usuarios.appendChild(row);
          })

        }

      }
    } catch (error) {
      console.error('Error al obtener los motivos:', error);
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener los usuarios, intente de nuevo o verifique el status del servidor.'
      modal.title = 'Error de validación'
      modal.open = true
    }

  }

  //Metodo encargado de activar el boton de seleccionar usuario, y bloquear o esconder los radio y select correspondientes con respecto al usuario seleccionado
  activarBotonSeleccionar = async usuarioId => {

    try {

      //Llamada a la funcion de obtener usuario por id del api
      const usuarioID = await this.#api.getUsuarioByID(usuarioId);

      let permisos = usuarioID.usuario.permisos;

      let verificar_sa = 0;
      let verificar_sd = 0;

      for (let i = 0; i < permisos.length; i++) {
        let permiso = permisos[i].slice((permisos[i].length - 2), permisos[i].length);
        if (permiso === 'SA') {
          verificar_sa++;
        }
        if (permiso === 'SD') {
          verificar_sd++;
        }
      }
      if (verificar_sa > 2) {
        this.habilitarPermisosAsesorias();
        this.desabilitarPermiso1();
      }
      if (verificar_sd > 2) {
        this.habilitarPermisosDemandas();
        this.desabilitarPermiso13();
      }
      if (usuarioID.usuario.permisos.length === 0) {
        this.habilitarPermisosAsesorias();
        this.desabilitarPermiso1();
        this.habilitarPermisosDemandas();
        this.desabilitarPermiso13();
      }

      await this.marcarCheckboxes(usuarioID.usuario.permisos);

      if (usuarioID) {

        //Se asigna el id de seleccion de usuario
        this.#idSeleccion = usuarioID.usuario.id_usuario;
        this.#nombre.value = usuarioID.usuario.nombre;
        this.#correo.value = usuarioID.usuario.correo;
        this.#estatusUsuario.value = usuarioID.usuario.estatus_general;
        //Se verifica el tipo de usuario para activar los radio y select correspondientes con respecto al asesor
        if (usuarioID.usuario.tipo_user.tipo_usuario === 'asesor') {
          this.#empleadoTipo.value = '2';
          this.#distrito2.value = usuarioID.usuario.id_distrito_judicial;
          const options = this.#asesor.options;
          //Esto con el fin de obtener o verificar el asesor seleccionado previamente
          for (let i = 0; i < options.length; i++) {
            if (i !== 0) {
              const optionValue = JSON.parse(options[i].value);
              if (optionValue.id_asesor === usuarioID.usuario.id_empleado) {
                this.#asesor.selectedIndex = i;
                break;
              }
            }
          }
          this.#bloqueOpciones.classList.remove('hidden');
          this.#bloqueDistrito.classList.add('hidden');
          this.#bloqueAsesor.classList.remove('hidden');
          this.#bloqueDefensor.classList.add('hidden');
          this.#bloqueGeneral.classList.add('hidden');
        } else
          //Se verifica el tipo de usuario para activar los radio y select correspondientes con respecto al defensor
          if (usuarioID.usuario.tipo_user.tipo_usuario === 'defensor') {
            this.#empleadoTipo.value = '3';
            this.#distrito2.value = usuarioID.usuario.id_distrito_judicial;
            const options = this.#defensor.options;
            //Esto con el fin de obtener o verificar el defensor seleccionado previamente
            for (let i = 0; i < options.length; i++) {
              if (i !== 0) {
                const optionValue = JSON.parse(options[i].value);
                if (optionValue.id_defensor === usuarioID.usuario.id_empleado) {
                  this.#defensor.selectedIndex = i;
                  break;
                }
              }
            }
            this.#bloqueOpciones.classList.remove('hidden');
            this.#bloqueDistrito.classList.add('hidden');
            this.#bloqueAsesor.classList.add('hidden');
            this.#bloqueDefensor.classList.remove('hidden');
            this.#bloqueGeneral.classList.add('hidden');


          } else
            //Se verifica el tipo de usuario para activar los radio y select correspondientes con respecto al distrito judicial
            if (usuarioID.usuario.tipo_user.tipo_usuario === 'supervisor') {
              this.#empleadoTipo.value = '1';
              this.#distrito.value = usuarioID.usuario.id_distrito_judicial;
              this.#bloqueOpciones.classList.add('hidden');
              this.#bloqueDistrito.classList.remove('hidden');
              this.#bloqueAsesor.classList.add('hidden');
              this.#bloqueDefensor.classList.add('hidden');
              this.#bloqueGeneral.classList.add('hidden');


            } else if (usuarioID.usuario.tipo_user.tipo_usuario === 'general') {
              this.#empleadoTipo.value = '4';
              this.#distrito3.value = usuarioID.usuario.id_distrito_judicial;
              this.#bloqueOpciones.classList.add('hidden');
              this.#bloqueDistrito.classList.add('hidden');
              this.#bloqueAsesor.classList.add('hidden');
              this.#bloqueDefensor.classList.add('hidden');
              this.#bloqueGeneral.classList.remove('hidden');
            }
        //Se bloquean los radio y select para que no se puedan modificar
        this.bloquearRadioAndSelect();

      } else {
        console.error('El usuario con el ID proporcionado no existe.');
      }
    } catch (error) {
      console.error('Error al obtener el usuario por ID:', error);
    }
  }

  async marcarCheckboxes(permisos) {
    const checkboxes = this.shadowRoot.querySelectorAll('input[name="permisos"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = permisos.includes(checkbox.value);
    });
  }



}

customElements.define('usuarios-tab', UsuariosTab);

