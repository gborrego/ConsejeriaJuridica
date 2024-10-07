import { ControllerUtils } from '../lib/controllerUtils.js'
import { DataAsesoria } from '../components/asesoria/data-asesoria.js'

class ConsultaController {
  //Variables de la clase privada
  #pagina = 1
  #numeroPaginas

  //Este metodo se encarga de gestionar la paginacion de las asesorias
  buttonsEventListeners = () => {
    //Asignación de las variables correspondientes a los botones
    const prev = document.getElementById('anterior')
    const next = document.getElementById('siguiente')
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
      this.handleConsultarAsesorias()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina < this.#numeroPaginas) {
      //Incremento de la pagina
      this.#pagina++
      //Llamada al metodo de consultar asesorias
      this.handleConsultarAsesorias()
    }
  }

  //Metodo encargado de consultar el numero de paginas del sistema de asesorias 
  getNumeroPaginas = async () => {
    try {
      //Obtención del total de asesorias
      const numeroAsesorias = await this.model.getTotalAsesorias()
      //Variable correspondiente al total de asesorias
      const total = document.getElementById('total')
      //Asignación del total de asesorias
      total.innerHTML = ' :' + numeroAsesorias.totalAsesorias
      //Variable correspondiente al total de paginas
      this.#numeroPaginas = (numeroAsesorias.totalAsesorias) / 10
    } catch (error) {
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      });
      modal.message = 'Error al obtener el total de asesorias, intente de nuevo mas tarde o verifique el status del servidor';
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
    const table = document.getElementById('table-body')
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }


  //Metodo que se encarga de crear la row de la tabla de asesorias con respecto a cada asesoria
  crearRow = asesoria => {

    const row = document.createElement('tr')
    row.classList.add('bg-white', 'border-b', 'hover:bg-gray-50')
    row.innerHTML = `<td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                ${asesoria.datos_asesoria.id_asesoria}
            </td>
            <td class="px-6 py-4">
                ${asesoria.persona.nombre} ${asesoria.persona.apellido_paterno} ${asesoria.persona.apellido_materno}
            </td>
            <td class="px-6 py-4">
                ${asesoria.tipos_juicio.tipo_juicio}
            </td>
            <td class="px-6 py-4 ">
                          <textarea  class="flex flex-wrap w-500px resize-none border-none" rows="5" >${asesoria.datos_asesoria.resumen_asesoria}</textarea>
            </td>
            <td class="px-6 py-4">
                ${asesoria.datos_asesoria.usuario}
            </td>
            <td class="px-6 py-4">
            ${asesoria.datos_asesoria.fecha_registro}
        </td>
        <td class="px-6 py-4">
        ${asesoria.hasOwnProperty("defensor") ? asesoria.defensor.nombre_defensor : asesoria.asesor.nombre_asesor}
    </td>
    <td class="px-6 py-4">
    ${asesoria.distrito_judicial.nombre_distrito_judicial}
</td>
<td class="px-6 py-4">
${asesoria.municipio.nombre_municipio}
</td>
<td class="px-6 py-4">
${asesoria.datos_asesoria.estatus_asesoria}
</td>
<td class="px-6 py-4">
${asesoria.datos_asesoria.estatus_asesoria === 'NO_TURNADA' ? '' : asesoria.turno.defensor.nombre_defensor}
</td>
            <td class="px-6 py-4 text-right">
                <button href="#" class="consulta-button font-medium text-[#db2424] hover:underline" onclick="handleConsultarAsesoriasById(this.value)" value="${asesoria.datos_asesoria.id_asesoria}">Consultar</button>
            </td>`

    return row
  }

  #busquedaExitosa = false
  #actualDistrito = ""
  #actualZona = ""
  #fechaInicioActual = ""
  #fechaFinalActual = ""
  #fechaRegistroActual = ""


  //Constructor de la clase
  constructor(model) {
    //Establecer distritito con respecto al usuario
    this.model = model
    this.utils = new ControllerUtils(model.user)
    //Este metodo se encarga de gestionarlos eventos del listener  de la seccion de filtros
    this.CheckEventListeners()
    //Este metodo se encarga de gestionar los eventos del listener de los select
    this.ComboBoxEventListeners()
    //Este metodo se encarga de gestionar los eventos de los botones
    this.buttonsEventListeners()
  }
  #acceptablePermissions = ['ALL_SA', 'CONSULTA_ASESORIA_SA']
  // DOMContentLoaded
  handleDOMContentLoaded = () => {
    // add permissions
    const permiso = this.utils.validatePermissions({})
    if (permiso) {
      const userPermissions = this.model.user.permisos;
      const acceptablePermissions = this.#acceptablePermissions;
      const hasPermission = (userPermissions, acceptablePermissions) => {
        return userPermissions.some(permission => acceptablePermissions.includes(permission));
      };
      if (!hasPermission(userPermissions, acceptablePermissions)) {
        window.location.href = 'index.html';
      }
    }
    //Se obtiene el total de asesorias
    this.getNumeroPaginas()
    //Se obtiene las asesorias
    this.handleConsultarAsesorias()
    //Se agrega los municipios al select
    this.agregarMunicipios()
    //Se agrega los distritos al select
    this.agregarDistritios()
    //Se agrega las zonas al select
    this.agregarZonas()

    //Se agregar el evento de buscar asesorias 
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.handleFiltros();
    });

    //Se agrega el evento de limpiar filtros
    const deleteButton = document.getElementById('deleteButton');
    deleteButton.style.display = 'none';
    deleteButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.deleteFiltros();
    });

    //Se obtiene el boton de formulario de excel
    const excel = document.getElementById('filtros-excel');
    excel.style.display = 'none';

    //// se agrega el evento de mostrar el formulario de excel
    const dropdownbuttonexcell = document.getElementById('dropdown-button-excell');
    dropdownbuttonexcell.addEventListener('click', (event) => {
      event.preventDefault();
      //Llama al metodo de campos y descarga de excel
      this.filtrosexcel();
    });

    //Metodo que agregar el evento correspondiente al boton de de descargar el reporte
    const botonDescargar = document.getElementById('btnDescargarReporte');
    botonDescargar.addEventListener('click', (event) => {
      event.preventDefault();
      this.handleDescargarReporte();
    });
    // Metodo que realiza la busqueda de asesorias
    window.handleConsultarAsesoriasById = this.handleConsultarAsesoriasById
  }

  //Metodo que se encarga de gestionar los eventos correspondientes a los check box de los filtros
  CheckEventListeners = () => {

    //Asignar de los check box a las variables correspondientes
    const checkboxAsesor = document.getElementById('check-asesor')
    const checkboxMunicipio = document.getElementById('check-municipio')
    const checkboxZona = document.getElementById('check-zona')
    const checkboxDefensor = document.getElementById('check-defensor')
    const checkboxDistrito = document.getElementById('check-distrito')
    const checkboxSeleccion = document.getElementById('chkSeleccion');


    //Asignación de los eventos de los check box
    checkboxAsesor.addEventListener('change', this.handleCheckboxChange)
    checkboxMunicipio.addEventListener('change', this.handleCheckboxChange)
    checkboxZona.addEventListener('change', this.handleCheckboxChange)
    checkboxDefensor.addEventListener('change', this.handleCheckboxChange)
    checkboxDistrito.addEventListener('change', this.handleCheckboxChange)
    checkboxSeleccion.addEventListener('change', this.handleCheckboxChange)

  }

  //Metodo que se encarga de gestionar los eventos correspondientes a los select de los filtros
  ComboBoxEventListeners = () => {
    //Asignación de las variables correspondientes a los select
    const selectAsesor = document.getElementById('select-asesor')
    const selectMunicipio = document.getElementById('select-municipio')
    const selectZona = document.getElementById('select-zona')
    const selectDefensor = document.getElementById('select-defensor')
    const selectBusqueda = document.getElementById('select-fecha')
    const selectDistrito = document.getElementById('select-distrito')

    //Asignación de los eventos de los select y la llamada de los metodos correspondientes
    selectBusqueda.addEventListener('change', this.handleSelectChange)
    selectAsesor.addEventListener('change', this.handleSelectChange)
    selectMunicipio.addEventListener('change', this.handleSelectChange)
    selectZona.addEventListener('change', this.handleSelectChange)
    selectDefensor.addEventListener('change', this.handleSelectChange)
    selectDistrito.addEventListener('change', this.handleSelectChange)
  }

  //Metodo que se encarga de gestionar los cambios con respecto a los select
  handleSelectChange = () => {
    //Asignación de las variables correspondientes a los select
    const selectAsesor = document.getElementById('select-asesor')
    const selectZona = document.getElementById('select-zona')
    const selectDefensor = document.getElementById('select-defensor')
    const checkboxDefensor = document.getElementById('check-defensor')
    const checkboxAsesor = document.getElementById('check-asesor')
    const selectMunicipio = document.getElementById('select-municipio')
    const selectBusqueda = document.getElementById('select-fecha')

    //Zona actual 
    const zona = selectZona.value

    //Validación de los select en este caso el tipo de busqueda de fechas o de una sola fecha checar el html correspondiente.
    if (selectBusqueda.value === '0') {
      const busqueda1 = document.getElementById('busqueda1')
      busqueda1.style.display = 'block'
      const busqueda2 = document.getElementById('busqueda2')
      busqueda2.style.display = 'none'
    } else {
      const busqueda1 = document.getElementById('busqueda1')
      busqueda1.style.display = 'none'
      const busqueda2 = document.getElementById('busqueda2')
      busqueda2.style.display = 'block'
    }



    //Asingacion de las variables correspondientes a los select de  distritito y checkbox de distrito y municipio
    const checkboxDistrito = document.getElementById('check-distrito')
    const selectDistrito = document.getElementById('select-distrito')
    const checkboxMunicipio = document.getElementById('check-municipio')

    //Esto es con el fin de verificar si el el checkbox de distrito esta activado y el select de distrito es diferente de 0 y el select de municipio es igual a 0 y el distrito actual es igual a vacio
    //con el fin de agregar los municipios correspondientes al select que estan relacionados con el distrito seleccionado
    if (checkboxDistrito.checked && selectDistrito.value !== '0' && checkboxMunicipio.checked
      && selectMunicipio.value === '0' && this.#actualDistrito === "") {
      // Esta variable nos ayuda a identificar si se ha selecionado un districto o no esto con el fin de pasar a la segunda condicion y hacer las verificaciones
      //correspondientes por ejemplo si anteriormente se habia seleccionado un municipio 
      //y se desea seleccionar un distrito pues este esta relacionado con ciertos municipios por eso se hace el recorrido para conocer
      //si el municipio seleccionado anteriormente esta relacionado con el distrito seleccionado y asi poder selecion el municipio correspondiente en el select
      //osea para que aparezca la opcion por default.
      this.#actualDistrito = selectDistrito.value
      const municipioActual = selectMunicipio.value
      this.agregarMunicipiosByDistrito().then(() => {
        let municipioEncontrado = false
        for (let i = 0; i < selectMunicipio.options.length; i++) {
          if (selectMunicipio.options[i].value === municipioActual) {
            municipioEncontrado = true
            break;
          }
        }
        if (municipioEncontrado) {
          selectMunicipio.value = municipioActual
        }

      })
    }
    else
      // Esta condición es para verificar si el checkbox de distrito esta activado y el select de distrito es diferente de 0 y el distrito actual es diferente al distrito seleccionado
      // con el fin de agregar los municipios correspondientes al select que estan relacionados con el distrito seleccionado en caso de que el distrito seleccionado sea diferente al distrito actual
      //como se menciono anteriormente la variable de actual distrito nos ayuda a identificar si se ha seleccionado un distrito por ende cuando hay un cambio en el select se procede a cambiar los municipios
      if (checkboxDistrito.checked && selectDistrito.value !== '0' && selectDistrito.value !== this.#actualDistrito) {
        // Aqui se asigna la nueva variable de distrito seleccionado  y ya pues asignada se procede a recorrer el arrar
        // y de igual manera se verifica el municipio si este pertence a cierto distritito , pero creo que aqui el recorrido del array esta de mas jejeje
        this.#actualDistrito = selectDistrito.value
        const municipioActual = selectMunicipio.value
        this.agregarMunicipiosByDistrito().then(() => {
          let municipioEncontrado = false
          for (let i = 0; i < selectMunicipio.options.length; i++) {
            if (selectMunicipio.options[i].value === municipioActual) {
              municipioEncontrado = true
              break;
            }
          }
          if (municipioEncontrado) {
            selectMunicipio.value = municipioActual
          }

        })
      } else
        // Esta condición es para verificar si el select de distrito es igual a 0 y el select de municipio tiene un tamaño menor a 15 y mayor a 1
        // con el fin de agregar los municipios correspondientes al select  como el total de municios cuando el distrito seleccionado es igual a 1 y menor a 15 como maximo esto significa que cuando no se haya seleccionado un distrito 
        //se cargaran todos los municipios , osea se actualizaran los municipios a todos los municipios cuando el distritito sea igual a cero.
        if (selectDistrito.value === '0' && (selectMunicipio.options.length < 15 && selectMunicipio.options.length > 1)) {
          //Se limpia la variable de distrito actual
          this.#actualDistrito = ""
          //Se asigna el municipio actual
          const municipioActual = selectMunicipio.value
          //se recorren los municipios y se asignan al select
          this.agregarMunicipios().then(() => {
            selectMunicipio.value = municipioActual
          }
          )
        }

    //Asignacion  de la variable de checkbox de zona
    const checkboxZona = document.getElementById('check-zona')

    // Esta verificacion es con el fin de verificar cuando la zona sea diferente de cero osea norte,centro y sur y que la variable de actualzona sea cero para ais poder 
    // agregar los asesores y defensores correspondientes a la zona seleccionada y asignar a la variable de actual zona la zona seleccionada
    if (zona !== '0' && this.#actualZona === "") {
      //Asignación de la variable de actual zona esta variable nos ayuda para que el metodo de agregar asesores y defensores sepa si se ha seleccionado una zona o no
      this.#actualZona = zona
      //Limpia de los titulos de los select
      selectAsesor.title = ""
      selectDefensor.title = ""
      //Agrega los defensores y asesores correspondientes a la zona seleccionada
      this.agregarDefensores()
      this.agregarAsesores()
      //Habilita los select de asesor y defensor
      selectAsesor.disabled = false
      selectDefensor.disabled = false
      checkboxAsesor.disabled = false
      checkboxDefensor.disabled = false

    } else
      //Esto es con el fin de englobar o hacer una seperacion logica de , en teoria cuando ya se ha seleccionado una zona y esta no sea diferente de cero
      //se actualizan la variable de actual zona y se procede a agregar los asesores y defensores correspondientes a la zona seleccionada
      if (zona !== '0' && this.#actualZona !== zona) {
        this.#actualZona = zona
        this.agregarDefensores()
        this.agregarAsesores()
      } else
        //Cuando la zona sea igual a 0 se limpia la variable de actual zona y se deshabilitan los select de asesor y defensor ademas de 
        //eso se establecen los titulos de los select de asesor y defensor
        if (zona === '0') {
          this.#actualZona = ""
          selectAsesor.title = "Seleccione una zona para poder seleccionar un asesor"
          selectDefensor.title = "  Seleccione una zona para poder seleccionar un defensor"
          selectAsesor.disabled = true
          selectAsesor.value = 0
          selectDefensor.disabled = true
          selectDefensor.value = 0

          checkboxDefensor.checked = false
          checkboxAsesor.checked = false
          checkboxAsesor.disabled = true
          checkboxDefensor.disabled = true
        }
  }


  // Este  metodo es con el fin de verificar los cambios en los check box de los filtros 
  handleCheckboxChange = () => {
    //Asignación de las variables correspondientes a los check box  y select correspondientes a los asesores , municipios , zonas , defensores y distritos
    const checkboxAsesor = document.getElementById('check-asesor')
    const selectAsesor = document.getElementById('select-asesor')
    const checkboxMunicipio = document.getElementById('check-municipio')
    const selectMunicipio = document.getElementById('select-municipio')
    const checkboxZona = document.getElementById('check-zona')
    const selectZona = document.getElementById('select-zona')
    const checkboxDefensor = document.getElementById('check-defensor')
    const selectDefensor = document.getElementById('select-defensor')
    const checkboxDistrito = document.getElementById('check-distrito')
    const selectDistrito = document.getElementById('select-distrito')
    const zona = selectZona.value

    //Esta verificacion es con el fin de verificar si el checkbox de municipio esta activado o no y si esta activado se habilita el select de municipio
    if (checkboxMunicipio.checked) {
      selectMunicipio.disabled = false
    } else {
      selectMunicipio.disabled = true
      selectMunicipio.value = 0
    }

    //Esta verificacion es con el fin de verificar si el checkbox de zona esta activado o no y si esta activado se habilita el select de zona
    if (checkboxZona.checked) {
      selectZona.disabled = false
    } else {
      selectZona.disabled = true
      selectZona.value = 0

    }

    //Esta verificacion es con el fin de verificar si el checkbox de asesor esta activado o no y si esta activado se habilita el select de asesor
    if (checkboxDistrito.checked) {
      selectDistrito.disabled = false
    } else {
      selectDistrito.disabled = true
      selectDistrito.value = 0
    }

    //De igual manera aqui se verifica que el checkbox de asesor este activado
    //en caso de que este activado se verificara si este es diferente de cero y 
    //ademas se verificara el checkbox del municipio si este esta activado y el select de municipio es igual a cero
    // y que el actual distrito sea igual a vacio esto con el fin de agregar los municipios correspondientes al distrito seleccionado
    if (checkboxDistrito.checked && selectDistrito.value !== '0' && checkboxMunicipio.checked
      && selectMunicipio.value === '0' && this.#actualDistrito === "") {
      //Asingacion de la variable de distrito actual
      this.#actualDistrito = selectDistrito.value
      //Agregar los municipios correspondientes al distrito seleccionado
      this.agregarMunicipiosByDistrito();
    }
    else
      //Esta verificacion es con el fin de verificar si el checkbox de distrito esta activado y el select de distrito es diferente de 0 y el distrito actual es diferente al distrito seleccionado
      //ya que esto nos indica que se ha seleccionado un distrito y se procede a agregar los municipios correspondientes al nuevo distrito seleccionado
      if (checkboxDistrito.checked && selectDistrito.value !== '0' && selectDistrito.value !== this.#actualDistrito) {
        //Asignacion de la variable de distrito actual
        this.#actualDistrito = selectDistrito.value
        //Agregar los municipios correspondientes al distrito seleccionado el nuevo
        this.agregarMunicipiosByDistrito();
      } else
        //Esta verificacion es con el fin de verificar si el select de distrito es igual a 0 y el select de municipio tiene un tamaño menor a 15 y mayor a 1 esto nos indica que no se ha seleccionado un distrito
        //y se procede a agregar los municipios correspondientes al select  como el total de municios cuando el distrito seleccionado es igual a 1 y menor a 15 como maximo esto significa que cuando no se haya seleccionado un distrito
        if (selectDistrito.value === '0' && (selectMunicipio.options.length < 15 && selectMunicipio.options.length > 1)) {
          this.#actualDistrito = ""
          const municipioActual = selectMunicipio.value
          this.agregarMunicipios().then(() => {
            selectMunicipio.value = municipioActual
          }
          )
        }

    //Esto es con el fin de verificar si el el checkboz de la zona es igual a false
    //y el checkbox de asesor o defensor esta activado y el select de zona es igual a cero
    //esto con el fin de deshabilitar los select de asesor y defensor y limpiar los select de asesor y defensor
    if (!checkboxZona.checked && (checkboxAsesor.checked || checkboxDefensor.checked) && selectZona.value === '0') {
      selectAsesor.disabled = true
      selectAsesor.value = 0
      selectDefensor.disabled = true
      selectDefensor.value = 0

      checkboxDefensor.checked = false
      checkboxAsesor.checked = false
      checkboxAsesor.disabled = true
      checkboxDefensor.disabled = true
    }
    //Esta verificacion es con el fin de verificar si el checkbox de zona esta activado o no y si esta activado se habilita el select de zona
    if (zona !== '0' && this.#actualZona === "") {
      //Asignacion de la variable de actual zona
      this.#actualZona = zona
      //Limpia de los titulos de los select
      selectAsesor.title = ""
      selectDefensor.title = ""
      //Agrega los defensores y asesores correspondientes a la zona seleccionada
      this.agregarDefensores()
      this.agregarAsesores()
      //Habilita los select de asesor y defensor
      selectAsesor.disabled = false
      selectDefensor.disabled = false
      checkboxAsesor.disabled = false
      checkboxDefensor.disabled = false
    } else
      //Esta verificacion es con el fin de verificar si el checkbox de zona esta activado o no y si esta activado se habilita el select de zona
      if (zona !== '0' && this.#actualZona !== zona) {
        //Asignacion de la variable de actual zona
        this.#actualZona = zona
        //Agrega los defensores y asesores correspondientes a la zona seleccionada
        this.agregarDefensores()
        this.agregarAsesores()
      } else
        //Si la zona es igual a cero se limpia la variable de actual zona y se deshabilitan los select de asesor y defensor
        if (zona === '0') {
          //Limpia la variable de actual zona
          this.#actualZona = ""
          //Establece los titulos de los select de asesor y defensor
          selectAsesor.title = "Seleccione una zona para poder seleccionar un asesor"
          selectDefensor.title = "  Seleccione una zona para poder seleccionar un defensor"
          //Deshabilita los select de asesor y defensor
          selectAsesor.disabled = true
          selectAsesor.value = 0
          selectDefensor.disabled = true
          selectDefensor.value = 0

          checkboxDefensor.checked = false
          checkboxAsesor.checked = false
          checkboxAsesor.disabled = true
          checkboxDefensor.disabled = true
        }

    //Estos check box son con el fin de establecer los campos que se desean mostrar en el reporte de excel
    //en caso de que el checkbox de seleccion este activado se deshabilitan los demas check box y se seleccionan todos los check box
    //para que el usuario tenga la opcion de seleccionar todos los campos o solo los que desee
    const checkboxSeleccion = document.getElementById('chkSeleccion');
    const checkboxNombreEmpleado = document.getElementById('chkNombreEmpleado');
    const checkboxNombreAsesorado = document.getElementById('chkNombreAsesorado');
    const checkboxGenero = document.getElementById('chkGenero');
    const checkboxEstadoCivil = document.getElementById('chkEstadoCivil');
    const checkboxNumeroHijos = document.getElementById('chkNumeroHijos');
    const checkboxTelefono = document.getElementById('chkTelefono');
    const checkboxColonia = document.getElementById('chkColonia');
    const checkboxTrabaja = document.getElementById('chkTrabaja');
    const checkboxIngresoMensual = document.getElementById('chkIngresoMensual');
    const checkboxMotivo = document.getElementById('chkMotivo');
    const checkboxResumen = document.getElementById('chkResumen');
    const checkboxTipoJuicio = document.getElementById('chkTipoJuicio');
    const checkboxConclusion = document.getElementById('chkConclusion');
    const checkboxDocumentosRecibidos = document.getElementById('chkDocumentosRecibidos');
    const checkboxFechaRegistro = document.getElementById('chkFechaRegistro');
    const checkboxNombreUsuario = document.getElementById('chkNombreUsuario');


    //Condiciones para deshabilitar los check box
    if (checkboxSeleccion.checked) {
      //Deshabilitar los check box
      checkboxNombreEmpleado.disabled = true
      checkboxNombreAsesorado.disabled = true
      checkboxGenero.disabled = true
      checkboxEstadoCivil.disabled = true
      checkboxNumeroHijos.disabled = true
      checkboxTelefono.disabled = true
      checkboxColonia.disabled = true
      checkboxTrabaja.disabled = true
      checkboxIngresoMensual.disabled = true
      checkboxMotivo.disabled = true
      checkboxResumen.disabled = true
      checkboxTipoJuicio.disabled = true
      checkboxConclusion.disabled = true
      checkboxDocumentosRecibidos.disabled = true
      checkboxFechaRegistro.disabled = true
      checkboxNombreUsuario.disabled = true

      checkboxNombreEmpleado.checked = false
      checkboxNombreAsesorado.checked = false
      checkboxGenero.checked = false
      checkboxEstadoCivil.checked = false
      checkboxNumeroHijos.checked = false
      checkboxTelefono.checked = false
      checkboxColonia.checked = false
      checkboxTrabaja.checked = false
      checkboxIngresoMensual.checked = false
      checkboxMotivo.checked = false
      checkboxResumen.checked = false
      checkboxTipoJuicio.checked = false
      checkboxConclusion.checked = false
      checkboxDocumentosRecibidos.checked = false
      checkboxFechaRegistro.checked = false
      checkboxNombreUsuario.checked = false
    } else {
      //Habilitar los check box
      checkboxNombreEmpleado.disabled = false
      checkboxNombreAsesorado.disabled = false
      checkboxGenero.disabled = false
      checkboxEstadoCivil.disabled = false
      checkboxNumeroHijos.disabled = false
      checkboxTelefono.disabled = false
      checkboxColonia.disabled = false
      checkboxTrabaja.disabled = false
      checkboxIngresoMensual.disabled = false
      checkboxMotivo.disabled = false
      checkboxResumen.disabled = false
      checkboxTipoJuicio.disabled = false
      checkboxConclusion.disabled = false
      checkboxDocumentosRecibidos.disabled = false
      checkboxFechaRegistro.disabled = false
      checkboxNombreUsuario.disabled = false

      checkboxNombreEmpleado.checked = true
      checkboxNombreAsesorado.checked = true
      checkboxGenero.checked = true
      checkboxEstadoCivil.checked = true
      checkboxNumeroHijos.checked = true
      checkboxTelefono.checked = true
      checkboxColonia.checked = true
      checkboxTrabaja.checked = true
      checkboxIngresoMensual.checked = true
      checkboxMotivo.checked = true
      checkboxResumen.checked = true
      checkboxTipoJuicio.checked = true
      checkboxConclusion.checked = true
      checkboxDocumentosRecibidos.checked = true
      checkboxFechaRegistro.checked = true
      checkboxNombreUsuario.checked = true
    }
  }


  //Metodo que se encarga de desplegar la seccion del reporte de excel
  filtrosexcel = () => {
    //Asignación de la variable correspondiente al formulario de excel
    const excel = document.getElementById('filtros-excel');
    if (excel.style.display === 'block') {
      excel.style.display = 'none';
    } else {
      excel.style.display = 'block';
    }
  }
  //Metodo que se encarga de limpiar los filtros 
  limpiarFiltros = () => {
    //Llamada al metodo de activar filtros
    this.activiarFiltros()

    //Asignación de las variables correspondientes a los select y checkbox
    const checkboxAsesor = document.getElementById('check-asesor')
    const selectAsesor = document.getElementById('select-asesor')
    const checkboxMunicipio = document.getElementById('check-municipio')
    const selectMunicipio = document.getElementById('select-municipio')
    const checkboxZona = document.getElementById('check-zona')
    const selectZona = document.getElementById('select-zona')
    const checkboxDefensor = document.getElementById('check-defensor')
    const selectDefensor = document.getElementById('select-defensor')
    const fechaInicio = document.getElementById('fecha-inicio')
    const fechaFinal = document.getElementById('fecha-final')
    const fecha_registro = document.getElementById('fecha-registro')
    const selectBusqueda = document.getElementById('select-fecha')
    const selectDistrito = document.getElementById('select-distrito')
    const checkboxDistrito = document.getElementById('check-distrito')
    //Limpieza de los select y checkbox
    checkboxDistrito.checked = false
    selectDistrito.value = 0
    selectBusqueda.value = 0
    fecha_registro.value = ''
    fechaInicio.value = ''
    fechaFinal.value = ''
    checkboxAsesor.checked = false;
    checkboxMunicipio.checked = false;
    checkboxZona.checked = false;
    checkboxDefensor.checked = false;
    selectMunicipio.value = 0;
    selectZona.value = 0;
    selectAsesor.disabled = true
    selectDefensor.disabled = true
    selectAsesor.value = 0;
    selectDefensor.value = 0;
    checkboxAsesor.disabled = true
    checkboxDefensor.disabled = true
    //La variable de busuqeda exitosa se establece en false, esta variable nos ayuda para
    //que las consultas por ejemplo esta la consulta base que extrae todo las asesorias
    //sin embargo, como tenemos filtros si se selecciona un filtro y se realiza una busqueda
    //esta nos ayuda a englobar esa funcionalidad y saber si se ha realizado una busqueda o no con respecto a determinados filtros.
    this.#busquedaExitosa = false
    //Limpieza de la paginacion
    this.#pagina = 1
    //Obtencion del numero de paginas
    this.getNumeroPaginas()
    //Llamada al metodo de consultar asesorias he aqui donde se utiliza la variable de busqueda exitosa
    this.handleConsultarAsesorias()

    //Asignación de las variables correspondientes a los check box del reporte de excel
    const checkboxSeleccion = document.getElementById('chkSeleccion');
    const checkboxNombreEmpleado = document.getElementById('chkNombreEmpleado');
    const checkboxNombreAsesorado = document.getElementById('chkNombreAsesorado');
    const checkboxGenero = document.getElementById('chkGenero');
    const checkboxEstadoCivil = document.getElementById('chkEstadoCivil');
    const checkboxNumeroHijos = document.getElementById('chkNumeroHijos');
    const checkboxTelefono = document.getElementById('chkTelefono');
    const checkboxColonia = document.getElementById('chkColonia');
    const checkboxTrabaja = document.getElementById('chkTrabaja');
    const checkboxIngresoMensual = document.getElementById('chkIngresoMensual');
    const checkboxMotivo = document.getElementById('chkMotivo');
    const checkboxResumen = document.getElementById('chkResumen');
    const checkboxTipoJuicio = document.getElementById('chkTipoJuicio');
    const checkboxConclusion = document.getElementById('chkConclusion');
    const checkboxDocumentosRecibidos = document.getElementById('chkDocumentosRecibidos');
    const checkboxFechaRegistro = document.getElementById('chkFechaRegistro');
    const checkboxNombreUsuario = document.getElementById('chkNombreUsuario');

    //Deshabilitar los check box
    checkboxNombreEmpleado.disabled = true
    checkboxNombreAsesorado.disabled = true
    checkboxGenero.disabled = true
    checkboxEstadoCivil.disabled = true
    checkboxNumeroHijos.disabled = true
    checkboxTelefono.disabled = true
    checkboxColonia.disabled = true
    checkboxTrabaja.disabled = true
    checkboxIngresoMensual.disabled = true
    checkboxMotivo.disabled = true
    checkboxResumen.disabled = true
    checkboxTipoJuicio.disabled = true
    checkboxConclusion.disabled = true
    checkboxDocumentosRecibidos.disabled = true
    checkboxFechaRegistro.disabled = true
    checkboxNombreUsuario.disabled = true

    //Desmarcar los check box
    checkboxSeleccion.checked = true
    checkboxNombreEmpleado.checked = false
    checkboxNombreAsesorado.checked = false
    checkboxGenero.checked = false
    checkboxEstadoCivil.checked = false
    checkboxNumeroHijos.checked = false
    checkboxTelefono.checked = false
    checkboxColonia.checked = false
    checkboxTrabaja.checked = false
    checkboxIngresoMensual.checked = false
    checkboxMotivo.checked = false
    checkboxResumen.checked = false
    checkboxTipoJuicio.checked = false
    checkboxConclusion.checked = false
    checkboxDocumentosRecibidos.checked = false
    checkboxFechaRegistro.checked = false
    checkboxNombreUsuario.checked = false
    //Variables que nos ayudan a determinar las fechas ya sea en caso de haya selecionado el filtro de fechas para busqueda de fechas
    //entre fechas osea beetween o una sola fecha
    this.#fechaFinalActual = ""
    this.#fechaInicioActual = ""
    this.#fechaRegistroActual = ""
  }

  //Metodo que se encarga de borrar el boton de eliminar filtros es el boton gris que aparece
  deleteFiltros = () => {
    //Asignaición de la variable correspondiente al boton de eliminar filtros
    const deleteButton = document.getElementById('deleteButton');
    deleteButton.style.display = 'none';
    const table = document.getElementById('table-body')
    table.innerHTML = ''
    //Llamada al metodo de limpiar filtros
    this.limpiarFiltros()
    //Se establece la variable de busqueda exitosa en false esto con el fin de que la consulta base se realize y no la consulta con filtros y ademas se limpia la paginacion
    this.#pagina = 1
    this.#busquedaExitosa = false
    //Obtencion del numero de paginas
    this.getNumeroPaginas()
    //Llamada al metodo de consultar asesorias
    this.handleConsultarAsesorias()
  }

  //Este metodo se encarga de eliminar los asesores del select de asesores y agregar una opcion por default
  borrarAsesor = () => {
    const selectAsesor2 = document.getElementById('select-asesor')
    selectAsesor2.innerHTML = ''
    const option3 = document.createElement('option')
    option3.value = 0
    option3.text = "Selecciona una opcion"
    selectAsesor2.appendChild(option3)
  }

  //Este metodo se encarga de eliminar los defensores del select de defensores y agregar una opcion por default
  borrarDefensor = () => {
    const selectdefensor2 = document.getElementById('select-defensor')
    const option2 = document.createElement('option')
    selectdefensor2.innerHTML = ''
    option2.value = 0
    option2.text = "Selecciona una opcion"
    selectdefensor2.appendChild(option2)
  }

  //Este metodo se encarga de eliminar los municipios del select de municipios y agregar una opcion por default
  borrarMunicipio = () => {
    const selectMunicipio2 = document.getElementById('select-municipio')
    selectMunicipio2.innerHTML = ''
    const option = document.createElement('option')
    option.value = 0
    option.text = "Selecciona una opcion"
    selectMunicipio2.appendChild(option)
  }


  //Este metodo se encarga de la gestion de la descarga del reporte de excel
  handleDescargarReporte = async () => {
    try {
      //tecnicamente los siguientes check box quieres que avalues si estan en true y si estan en true 
      const checkboxNombreEmpleado = document.getElementById('chkNombreEmpleado');
      const checkboxNombreAsesorado = document.getElementById('chkNombreAsesorado');
      const checkboxGenero = document.getElementById('chkGenero');
      const checkboxEstadoCivil = document.getElementById('chkEstadoCivil');
      const checkboxNumeroHijos = document.getElementById('chkNumeroHijos');
      const checkboxTelefono = document.getElementById('chkTelefono');
      const checkboxColonia = document.getElementById('chkColonia');
      const checkboxTrabaja = document.getElementById('chkTrabaja');
      const checkboxIngresoMensual = document.getElementById('chkIngresoMensual');
      const checkboxMotivo = document.getElementById('chkMotivo');
      const checkboxResumen = document.getElementById('chkResumen');
      const checkboxTipoJuicio = document.getElementById('chkTipoJuicio');
      const checkboxConclusion = document.getElementById('chkConclusion');
      const checkboxDocumentosRecibidos = document.getElementById('chkDocumentosRecibidos');
      const checkboxFechaRegistro = document.getElementById('chkFechaRegistro');
      const checkboxNombreUsuario = document.getElementById('chkNombreUsuario');
      const checkboxSeleccion = document.getElementById('chkSeleccion');

      //Por default en el servicio que correspondiente a la descarga del excel existe un parametro que se llama campos
      //este parametro es un array que contiene los campos que se desean mostrar en el reporte de excel 
      //por lo tanto se procede a verificar si los check box estan activados o no y se agregan al array de campos
      let camposFiltros = [];
      if (checkboxNombreEmpleado.checked) {
        camposFiltros.push('nombre-empleado')
      }
      if (checkboxNombreAsesorado.checked) {
        camposFiltros.push('nombre-asesorado')
      }
      if (checkboxGenero.checked) {
        camposFiltros.push('genero')
      }
      if (checkboxEstadoCivil.checked) {
        camposFiltros.push('estado_civil')
      }
      if (checkboxNumeroHijos.checked) {
        camposFiltros.push('numero_hijos')
      }
      if (checkboxTelefono.checked) {
        camposFiltros.push('telefono')
      }
      if (checkboxColonia.checked) {
        camposFiltros.push('colonia')
      }
      if (checkboxTrabaja.checked) {
        camposFiltros.push('trabaja')
      }
      if (checkboxIngresoMensual.checked) {
        camposFiltros.push('ingreso_mensual')
      }
      if (checkboxMotivo.checked) {
        camposFiltros.push('motivo')
      }
      if (checkboxResumen.checked) {
        camposFiltros.push('resumen')
      }
      if (checkboxTipoJuicio.checked) {
        camposFiltros.push('tipo_juicio')
      }
      if (checkboxConclusion.checked) {
        camposFiltros.push('conclusion')
      }
      if (checkboxDocumentosRecibidos.checked) {
        camposFiltros.push('documentos-recibidos')
      }
      if (checkboxFechaRegistro.checked) {
        camposFiltros.push('fecha_registro')
      }
      if (checkboxNombreUsuario.checked) {
        camposFiltros.push('nombre-usuario')
      }


      //Esta condicion es para verificar si la busqueda es exitosa o no, como se menciono  anteriormente}
      //la busqueda exitosa nos ayuda a saber si se ha realizado una busqueda con filtros o no
      //en caso de que la busqueda sea exitosa se procede a realizar la descarga del reporte de excel
      //con filtros,caso contrario se procede a realizar la descarga del reporte de excel sin filtros

      //En este caso la busqueda exitosa es false lo que significa que solo se procedera a enviar los campos a requerir en el reporte de excel
      if (this.#busquedaExitosa === false) {
        try {
          //Esta con condicion es con el fin de verificar si el checkbox de seleccion esta activado o no, ya que este checkbox nos ayuda a determinar si 
          //se desean todos los campos o solo los campos seleccionados
          if (checkboxSeleccion.checked) {
            await this.model.getAsesoriasDescaga(null, null)
          } else {
            await this.model.getAsesoriasDescaga(null, camposFiltros)
          }

          const modal = document.querySelector('modal-warning');
          modal.message = 'La descarga del reporte ha sido exitosa';
          modal.open = 'true'
        }
        catch (error) {
          const modal = document.querySelector('modal-warning');
          modal.message = 'La descarga del reporte no ha sido exitosa,error en el servidor o no existen elementos.';
          modal.open = 'true'
        }

      } else {
        //caso contario la busqueda exitosa es true y se procede a realizar la descarga del reporte de excel con filtros

        const deleteButton = document.getElementById('deleteButton');
        deleteButton.style.display = 'block';



        const checkboxAsesor = document.getElementById('check-asesor')
        const checkboxMunicipio = document.getElementById('check-municipio')
        const checkboxZona = document.getElementById('check-zona')
        const checkboxDefensor = document.getElementById('check-defensor')

        const selectAsesor = document.getElementById('select-asesor')
        const selectMunicipio = document.getElementById('select-municipio')
        const selectZona = document.getElementById('select-zona')
        const selectDefensor = document.getElementById('select-defensor')

        const fechaInicio = document.getElementById('fecha-inicio')
        const fechaFinal = document.getElementById('fecha-final')
        const selectBusqueqda = document.getElementById('select-fecha')
        const selectDistrito = document.getElementById('select-distrito')
        const fechaRegistro = document.getElementById('fecha-registro')
        //Aqui se verifica si el select de busqueda es igual a 0 o 1 esto nos indica si se ha seleccionado una fecha de registro o no
        //dentro de estas condiciones donde nos indica el tipo de busqueda de fecha se procede a realizar la descarga del reporte de excel
        //con filtros o sin filtros de acuerdo a sus multiples condiciones o posibles estados
        if (selectBusqueqda.value === '0') {
          if (fechaInicio.value === '' || fechaFinal.value === '') {
            const modal = document.querySelector('modal-warning');
            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                this.#pagina = 1
                this.getNumeroPaginas()
                this.handleConsultarAsesorias()
              }
            });
            modal.message = 'Es requerido seleccionar una fecha de inicio y una fecha final para poder descargar el reporte';
            modal.open = 'true'

          }
          else
            //Aqui se verifica que la fecha de inicio no sea mayor a la fecha final
            if (fechaInicio.value > fechaFinal.value) {
              const modal = document.querySelector('modal-warning');
              modal.setOnCloseCallback(() => {
                if (modal.open === 'false') {
                  this.#pagina = 1
                  this.getNumeroPaginas()
                  this.handleConsultarAsesorias()
                }
              });
              modal.message = 'La Fecha Inicial No Puede Ser Mayor A La Fecha Final';
              modal.open = 'true'
            } else {
              //ya que se ha seleccionado una fecha de inicio y una fecha final se procede a realizar la descarga del reporte de excel
              const filtros = {
                fecha_inicio: fechaInicio.value,
                fecha_final: fechaFinal.value,
                id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
                id_zona: selectZona.value !== '0' ? selectZona.value : null,
                id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
                id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
                id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
                fecha_registro: null
              }
              try {
                //De igual manera se verifica si el checkbox de seleccion esta activado o no
                //esto nos indica si se desean todos los campos o solo los campos seleccionados
                //en caso de que el checkbox de seleccion este activado se procede a realizar la descarga del reporte de excel
                //sin filtros caso contrario se procede a realizar la descarga del reporte de excel con filtros y los campos 
                //seleccionados
                if (checkboxSeleccion.checked) {
                  await this.model.getAsesoriasDescaga(filtros, null)
                } else {
                  await this.model.getAsesoriasDescaga(filtros, camposFiltros)
                }

                const modal = document.querySelector('modal-warning');
                modal.message = 'La descarga del reporte ha sido exitosa';
                modal.open = 'true'
              }
              catch (error) {
                const modal = document.querySelector('modal-warning');
                modal.message = 'La descarga del reporte no ha sido exitosa, intente de nuevo mas tarde';
                modal.open = 'true'
              }
            }
        } else if (selectBusqueqda.value === '1') {
          const filtros = {
            fecha_inicio: null,
            fecha_final: null,
            id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
            id_zona: selectZona.value !== '0' ? selectZona.value : null,
            id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
            id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
            id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
            fecha_registro: fechaRegistro.value
          }
          try {
            //de igual manera se verifica si el checkbox de seleccion esta activado o no
            //esto nos indica si se desean todos los campos o solo los campos seleccionados
            //en caso de que el checkbox de seleccion este activado se procede a realizar la descarga del reporte de excel
            //sin filtros caso contrario se procede a realizar la descarga del reporte de excel con filtros y los campos
            if (checkboxSeleccion.checked) {
              await this.model.getAsesoriasDescaga(filtros, null)
            } else {
              await this.model.getAsesoriasDescaga(filtros, camposFiltros)
            }

            const modal = document.querySelector('modal-warning');
            modal.message = 'La descarga del reporte ha sido exitosa';
            modal.open = 'true'
          }
          catch (error) {
            const modal = document.querySelector('modal-warning');
            modal.message = 'La descarga del reporte no ha sido exitosa, intente de nuevo mas tarde';
            modal.open = 'true'
          }

        }


      }

    } catch (error) {
      console.error('Error:', error.message)
    }



  }

  //Este metodo se encarga de la consulta de las asesorias del sistema
  handleConsultarAsesorias = async () => {
    try {
      //Como se menciono anteriormente la busqueda exitosa nos ayuda a saber si se ha realizado una busqueda con filtros o no

      //En este caso la busqueda exitosa es false lo que significa que solo se procedera a realizar la consulta de las asesorias sin filtros
      if (this.#busquedaExitosa === false) {
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.style.display = 'none';
        try {
          //Busqueda de las asesorias
          const asesoriasResponse = await this.model.getAsesorias(this.#pagina)
          const asesorias = asesoriasResponse.asesorias
          const table = document.getElementById('table-body')
          //Recorrido de las asesorias y agregacion de las asesorias a la tabla
          const rowsTable = document.getElementById('table-body').rows.length
          if (this.validateRows(rowsTable)) {
            asesorias.forEach(asesoria => {
              table.appendChild(this.crearRow(asesoria))
            })
          }
        } catch (error) {
          const modal = document.querySelector('modal-warning');
          modal.message = 'Error al obtener las asesorias, intente de nuevo mas tarde';
          modal.title = 'Error'
          modal.open = 'true'

        }
      } else
        //En este caso la busqueda exitosa es true lo que significa que solo se procedera a realizar la consulta de las asesorias con filtros
        if (this.#busquedaExitosa === true) {
          const deleteButton = document.getElementById('deleteButton');
          deleteButton.style.display = 'block';


          const checkboxAsesor = document.getElementById('check-asesor')
          const checkboxMunicipio = document.getElementById('check-municipio')
          const checkboxZona = document.getElementById('check-zona')
          const checkboxDefensor = document.getElementById('check-defensor')

          const selectAsesor = document.getElementById('select-asesor')
          const selectMunicipio = document.getElementById('select-municipio')
          const selectZona = document.getElementById('select-zona')
          const selectDefensor = document.getElementById('select-defensor')

          const fechaInicio = document.getElementById('fecha-inicio')
          const fechaFinal = document.getElementById('fecha-final')
          const selectBusqueqda = document.getElementById('select-fecha')
          const selectDistrito = document.getElementById('select-distrito')
          const fechaRegistro = document.getElementById('fecha-registro')

          //EN este caso de igual manera se procede a verificar si el select de busqueda es igual a 0 o 1 esto nos indica si se ha seleccionado una fecha de registro o no
          //esto con respecto a la busqueda de fechas
          if (selectBusqueqda.value === '0') {
            //En este caso se verifica con resecto a las fechas de inicio y final
            const filtros = {
              fecha_inicio: fechaInicio.value,
              fecha_final: fechaFinal.value,
              id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
              id_zona: selectZona.value !== '0' ? selectZona.value : null,
              id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
              id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
              id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
              fecha_registro: null
            }
            // Se mandan los filtros a la consulta de las asesorias
            const asesoriasResponse = await this.model.getAsesoriasByFiltersPaginacion(this.#pagina, filtros)
            const asesorias = asesoriasResponse
            const table = document.getElementById('table-body')
            const rowsTable = document.getElementById('table-body').rows.length
            if (this.validateRows(rowsTable)) {
              asesorias.forEach(asesoria => {
                table.appendChild(this.crearRow(asesoria))
              })
            }
          } else {
            //En este caso se verifica con resecto a la fecha de registro
            const filtros = {
              fecha_inicio: null,
              fecha_final: null,
              id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
              id_zona: selectZona.value !== '0' ? selectZona.value : null,
              id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
              id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
              id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
              fecha_registro: fechaRegistro.value
            }
            // Se mandan los filtros a la consulta de las asesorias
            const asesoriasResponse = await this.model.getAsesoriasByFiltersPaginacion(this.#pagina, filtros)
            const asesorias = asesoriasResponse
            const table = document.getElementById('table-body')
            const rowsTable = document.getElementById('table-body').rows.length
            //Validacion de las filas de la tabla para la agregacion de las asesorias
            if (this.validateRows(rowsTable)) {
              asesorias.forEach(asesoria => {
                table.appendChild(this.crearRow(asesoria))
              })
            }

          }

        }

    } catch (error) {
      console.error('Error:', error.message)
    }
  }


  //Metodo que se encarga de consultar una asesoria por id y mostrar los datos de la asesoria en  su respectivo modal
  handleConsultarAsesoriasById = async id => {
    try {
      const button = document.querySelector('.consulta-button')
      button.disabled = true
      const asesoria = await this.model.getAsesoriaById(id)
      const persona = asesoria.asesoria.persona
      const domicilio = await this.model.getColoniaById(
        persona.domicilio.id_colonia
      )
      const modal = document.querySelector('modal-asesoria')
      //Creacion de la clase de datos de asesoria
      const dataAsesoria = new DataAsesoria(asesoria, domicilio)

      //Evento que se encarga de cerrar el modal
      const handleModalClose = () => {
        const modalContent = modal.shadowRoot.getElementById('modal-content')
        modalContent.innerHTML = ''
        button.disabled = false
      }
      //Se agrega el evento de cerrar el modal
      modal.addEventListener('onClose', handleModalClose)

      //Se agrega el contenido de la asesoria al modal
      const modalContent = modal.shadowRoot.getElementById('modal-content')
      modalContent.appendChild(dataAsesoria)

      //Se abre el modal
      modal.title = 'Datos Asesoría'
      modal.open = true
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  //Metodo que se encarga de consultar las asesorias con respecto a los filtros
  handleFiltros = async () => {

    const fechaInicio = document.getElementById('fecha-inicio')
    const fechaFinal = document.getElementById('fecha-final')
    const fechaRegistro = document.getElementById('fecha-registro')
    const selectBusqueda = document.getElementById('select-fecha')

    //Con el fin de evitar problemas con respecto a las busquedas con filtros
    //se procedio a que cuando se haya realizado una busqueda con filtros y que esta haya sido existosa
    //se procede a bloquear los filtros para evitar problemas 

    //En este caso se verifica si los filtros estan bloqueados o no
    if (fechaInicio.disabled === true || fechaFinal.disabled === true || fechaRegistro.disabled === true) {
      const modal = document.querySelector('modal-warning');

      modal.message = 'Es requerido borrar los filtros para realizar una nueva busqueda';
      modal.open = 'true'
    }
    else {

      //En este caso se verifica si el select de busqueda es igual a 0 o 1 esto nos indica si se ha seleccionado una fecha de registro o no
      //dentro de estas condiciones donde nos indica el tipo de busqueda de fecha se procede a realizar la consulta de las asesorias
      //con filtros o sin filtros de acuerdo a sus multiples condiciones o posibles estados
      if (selectBusqueda.value === '0') {
        //Se verifica que las fechas de inicio y final no esten vacias
        if (fechaInicio.value === '' || fechaFinal.value === '') {
          const modal = document.querySelector('modal-warning');

          modal.message = 'Es requerido seleccionar una fecha de inicio y una fecha final para poder descargar o consultar las asesorias';
          modal.open = 'true'

        } else
          //Se verifica que la fecha de inicio no sea mayor a la fecha final
          if (fechaInicio.value > fechaFinal.value) {
            const modal = document.querySelector('modal-warning');

            modal.message = 'La Fecha Inicial No Puede Ser Mayor A La Fecha Final';
            modal.open = 'true'
          } else {
            //Caso contrario se procede a realizar la consulta de las asesorias con filtros

            //Asignacion de las variables correspondientes a los checkbox y select
            const checkboxAsesor = document.getElementById('check-asesor')
            const checkboxMunicipio = document.getElementById('check-municipio')
            const checkboxZona = document.getElementById('check-zona')
            const checkboxDefensor = document.getElementById('check-defensor')

            const selectAsesor = document.getElementById('select-asesor')
            const selectMunicipio = document.getElementById('select-municipio')
            const selectZona = document.getElementById('select-zona')
            const selectDefensor = document.getElementById('select-defensor')

            const selectDistrito = document.getElementById('select-distrito')

            //Deacuerdo al tipo de busqueda por fechas se procede a realizar la consulta de las asesorias con filtros
            if (selectBusqueda.value === '0') {

              const filtros = {
                fecha_inicio: fechaInicio.value,
                fecha_final: fechaFinal.value,
                id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
                id_zona: selectZona.value !== '0' ? selectZona.value : null,
                id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
                id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
                id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
                fecha_registro: null
              }
              try {

                ///En este caso se procede a realizar la consulta de las asesorias con filtros

                const asesoriasResponse = await this.model.getAsesoriasByFilters(filtros)
                //Obtencion del numero de asesorias con respecto a los filtros
                const numeroAsesorias = await this.model.getTotalAsesoriasfiltro(filtros)
                //Asignacion del total de asesorias con respecto a los filtros
                const total = document.getElementById('total')
                total.innerHTML = ' :' + numeroAsesorias.totalAsesoriasFiltro


                //En caso de que no existan asesorias con respecto a los filtros se procede a mostrar un mensaje de advertencia
                if (asesoriasResponse.length === 0) {
                  const deleteButton = document.getElementById('deleteButton');
                  deleteButton.style.display = 'none';

                  const modal = document.querySelector('modal-warning');

                  modal.setOnCloseCallback(() => {
                    if (modal.open === 'false') {
                      this.#pagina = 1
                      this.getNumeroPaginas()
                      this.limpiarFiltros()
                      this.handleConsultarAsesorias()
                    }
                  });

                  modal.message = 'No Existen Coincidencias En La Búsqueda';
                  modal.open = 'true'

                }
                else {
                  //He aqui donde se bloquean los filtros para evitar problemas
                  this.bloquearFiltros()
                  const deleteButton = document.getElementById('deleteButton')

                  deleteButton.style.display = 'block';
                  //Se establece la busqueda exitosa en true la que nos ayuda a saber si se ha realizado una busqueda con filtros
                  this.#busquedaExitosa = true
                  //Se establece la paginacion en 1
                  this.#pagina = 1
                  //Se obtiene el numero de paginas
                  this.#numeroPaginas = (numeroAsesorias.totalAsesoriasFiltro) / 10
                  //Se procede a realizar la consulta de las asesorias con filtros
                  this.handleConsultarAsesorias()
                }


              } catch (error) {
                console.error('Error:', error.message)
              }

            }
            else {
              //En el caso de que el tipo de busqueda sea por fecha de registro se realizan las mismas acciones que en el caso anterior
              const filtros = {
                fecha_inicio: null,
                fecha_final: null,
                id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
                id_zona: selectZona.value !== '0' ? selectZona.value : null,
                id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
                id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
                id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
                fecha_registro: fechaRegistro.value
              }
              try {
                //Asignacion de las asesorias con respecto a los filtros
                const asesoriasResponse = await this.model.getAsesoriasByFilters(filtros)
                //Busqueda del total de asesorias con respecto a los filtros
                const numeroAsesorias = await this.model.getTotalAsesoriasfiltro(filtros)
                //Asignacion del total de asesorias con respecto a los filtros
                const total = document.getElementById('total')
                total.innerHTML = ' :' + numeroAsesorias.totalAsesoriasFiltro


                //En caso de que no existan asesorias con respecto a los filtros se procede a mostrar un mensaje de advertencia
                if (asesoriasResponse.length === 0) {
                  const deleteButton = document.getElementById('deleteButton');
                  deleteButton.style.display = 'none';

                  const modal = document.querySelector('modal-warning');

                  modal.setOnCloseCallback(() => {
                    if (modal.open === 'false') {
                      this.#pagina = 1
                      this.getNumeroPaginas()
                      this.limpiarFiltros()
                      this.handleConsultarAsesorias()
                    }
                  });

                  modal.message = 'No Existen Coincidencias En La Búsqueda';
                  modal.open = 'true'

                }
                else {
                  const deleteButton = document.getElementById('deleteButton');
                  deleteButton.style.display = 'block';
                  this.#busquedaExitosa = true
                  this.#pagina = 1
                  this.#numeroPaginas = (numeroAsesorias.totalAsesoriasFiltro) / 10
                  this.handleConsultarAsesorias()
                  this.bloquearFiltros()
                }


              } catch (error) {
                console.error('Error:', error.message)
              }
            }
          }

      } else {
        //En este caso se verifica si el select de busqueda es igual a 0 o 1 esto nos indica si se ha seleccionado una fecha de registro o no
        if (fechaRegistro.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.message = 'Es requerido seleccionar una fecha de registro para poder descargar o consultar las asesorias';
          modal.open = 'true'
        } else {
          //En este caso se procede a realizar la consulta de las asesorias con filtros

          // Asignacion de las variables correspondientes a los checkbox y select
          const checkboxAsesor = document.getElementById('check-asesor')
          const checkboxMunicipio = document.getElementById('check-municipio')
          const checkboxZona = document.getElementById('check-zona')
          const checkboxDefensor = document.getElementById('check-defensor')

          const selectAsesor = document.getElementById('select-asesor')
          const selectMunicipio = document.getElementById('select-municipio')
          const selectZona = document.getElementById('select-zona')
          const selectDefensor = document.getElementById('select-defensor')

          const selectDistrito = document.getElementById('select-distrito')

          //Deacuerdo al tipo de busqueda por fechas se procede a realizar la consulta de las asesorias con filtros

          if (selectBusqueda.value === '0') {

            //JSON con los filtros
            const filtros = {
              fecha_inicio: fechaInicio.value,
              fecha_final: fechaFinal.value,
              id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
              id_zona: selectZona.value !== '0' ? selectZona.value : null,
              id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
              id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
              id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
              fecha_registro: null
            }
            try {
              //Asignacion de las asesorias con respecto a los filtros
              const asesoriasResponse = await this.model.getAsesoriasByFilters(filtros)
              const numeroAsesorias = await this.model.getTotalAsesoriasfiltro(filtros)
              const total = document.getElementById('total')
              total.innerHTML = ' :' + numeroAsesorias.totalAsesoriasFiltro



              //En caso de que no existan asesorias con respecto a los filtros se procede a mostrar un mensaje de advertencia
              if (asesoriasResponse.length === 0) {
                const deleteButton = document.getElementById('deleteButton');
                deleteButton.style.display = 'none';

                const modal = document.querySelector('modal-warning');

                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    this.#pagina = 1
                    this.getNumeroPaginas()
                    this.limpiarFiltros()
                    this.handleConsultarAsesorias()
                  }
                });

                modal.message = 'No Existen Coincidencias En La Búsqueda';
                modal.open = 'true'

              }
              else {
                //He aqui donde se bloquean los filtros para evitar problemas
                this.bloquearFiltros()
                const deleteButton = document.getElementById('deleteButton')

                deleteButton.style.display = 'block';
                //Se establece la busqueda exitosa en true la que nos ayuda a saber si se ha realizado una busqueda con filtros
                this.#busquedaExitosa = true
                //Se establece la paginacion en 1
                this.#pagina = 1
                //Se obtiene el numero de paginas
                this.#numeroPaginas = (numeroAsesorias.totalAsesoriasFiltro) / 10
                //Se procede a realizar la consulta de las asesorias con filtros
                this.handleConsultarAsesorias()
              }


            } catch (error) {
              console.error('Error:', error.message)
            }

          }
          else {
            //JSON con los filtros
            const filtros = {
              fecha_inicio: null,
              fecha_final: null,
              id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
              id_zona: selectZona.value !== '0' ? selectZona.value : null,
              id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
              id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
              id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
              fecha_registro: fechaRegistro.value
            }
            try {
              //Asignacion de las asesorias con respecto a los filtros
              const asesoriasResponse = await this.model.getAsesoriasByFilters(filtros)
              const numeroAsesorias = await this.model.getTotalAsesoriasfiltro(filtros)
              const total = document.getElementById('total')
              total.innerHTML = ' :' + numeroAsesorias.totalAsesoriasFiltro


              //En caso de que no existan asesorias con respecto a los filtros se procede a mostrar un mensaje de advertencia
              if (asesoriasResponse.length === 0) {
                const deleteButton = document.getElementById('deleteButton');
                deleteButton.style.display = 'none';

                const modal = document.querySelector('modal-warning');

                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    this.#pagina = 1
                    this.getNumeroPaginas()
                    this.limpiarFiltros()
                    this.handleConsultarAsesorias()
                  }
                });

                modal.message = 'No Existen Coincidencias En La Búsqueda';
                modal.open = 'true'

              }
              else {
                //He aqui donde se bloquean los filtros para evitar problemas
                const deleteButton = document.getElementById('deleteButton');
                deleteButton.style.display = 'block';
                //Se establece la busqueda exitosa en true la que nos ayuda a saber si se ha realizado una busqueda con filtros
                this.#busquedaExitosa = true
                //Se establece la paginacion en 1
                this.#pagina = 1
                //Se obtiene el numero de paginas
                this.#numeroPaginas = (numeroAsesorias.totalAsesoriasFiltro) / 10
                //Se procede a realizar la consulta de las asesorias con filtros
                this.handleConsultarAsesorias()
                //Se bloquean los filtros para evitar problemas
                this.bloquearFiltros()
              }


            } catch (error) {
              console.error('Error:', error.message)
            }
          }
        }
      }
    }
  }

  //Metodo que se encarga de bloquear los filtros para evitar problemas
  bloquearFiltros = async () => {
    const fechaRegistro = document.getElementById('fecha-registro')
    const fechaInicio = document.getElementById('fecha-inicio')
    const fechaFinal = document.getElementById('fecha-final')

    fechaFinal.disabled = true
    fechaInicio.disabled = true
    fechaRegistro.disabled = true



    const select = document.getElementById('select-fecha')
    const selectZona = document.getElementById('select-zona')
    const selectDistrito = document.getElementById('select-distrito')
    const selectMunicipio = document.getElementById('select-municipio')
    const selectAsesor = document.getElementById('select-asesor')
    const selectDefensor = document.getElementById('select-defensor')

    selectZona.disabled = true
    selectDistrito.disabled = true
    selectMunicipio.disabled = true
    selectAsesor.disabled = true
    selectDefensor.disabled = true
    select.disabled = true




    const checkboxAsesor = document.getElementById('check-asesor')
    const checkboxMunicipio = document.getElementById('check-municipio')
    const checkboxZona = document.getElementById('check-zona')
    const checkboxDefensor = document.getElementById('check-defensor')
    const checkboxDistrito = document.getElementById('check-distrito')
    const checkboxSeleccion = document.getElementById('chkSeleccion');

    checkboxAsesor.disabled = true
    checkboxMunicipio.disabled = true
    checkboxZona.disabled = true
    checkboxDefensor.disabled = true
    checkboxDistrito.disabled = true
  }

  //Metodo que se encarga de activar los filtros cuando se han limpiado los filtros
  activiarFiltros = async () => {
    const fechaRegistro = document.getElementById('fecha-registro')
    const fechaInicio = document.getElementById('fecha-inicio')
    const fechaFinal = document.getElementById('fecha-final')

    fechaFinal.disabled = false
    fechaInicio.disabled = false
    fechaRegistro.disabled = false

    const select = document.getElementById('select-fecha')
    const selectZona = document.getElementById('select-zona')
    const selectDistrito = document.getElementById('select-distrito')
    const selectMunicipio = document.getElementById('select-municipio')
    const selectAsesor = document.getElementById('select-asesor')
    const selectDefensor = document.getElementById('select-defensor')

    selectZona.disabled = false
    selectDistrito.disabled = false
    selectMunicipio.disabled = false
    selectAsesor.disabled = false
    selectDefensor.disabled = false
    select.disabled = false

    const checkboxAsesor = document.getElementById('check-asesor')
    const checkboxMunicipio = document.getElementById('check-municipio')
    const checkboxZona = document.getElementById('check-zona')
    const checkboxDefensor = document.getElementById('check-defensor')
    const checkboxDistrito = document.getElementById('check-distrito')
    const checkboxSeleccion = document.getElementById('chkSeleccion');

    checkboxAsesor.disabled = false
    checkboxMunicipio.disabled = false
    checkboxZona.disabled = false
    checkboxDefensor.disabled = false
    checkboxDistrito.disabled = false

  }

  //Metodo que se encarga de agregar las zona al select de zona
  agregarZonas = async () => {
    const select = document.getElementById('select-zona')
    const zonas = await this.model.getZonas()
    zonas.forEach(zona => {
      const option = document.createElement('option')
      option.value = zona.id_zona
      option.text = zona.nombre_zona
      select.appendChild(option)
    })
  }

  //Metodo que se encarga de agregar los distritos al select de distrito
  agregarDistritios = async () => {
    const select = document.getElementById('select-distrito')
    const distritos = await this.model.getDistritos()
    distritos.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.text = distrito.nombre_distrito_judicial
      select.appendChild(option)
    })
  }


  //Metodo que se encarga de agregar los municipios al select de municipio
  agregarMunicipios = async () => {
    const municipios = await this.model.getMunicipios()
    const select = document.getElementById('select-municipio')
    this.borrarMunicipio()
    municipios.forEach(municipio => {
      const option = document.createElement('option')
      option.value = municipio.id_municipio
      option.text = municipio.nombre_municipio
      select.appendChild(option)
    })
  }
  //Metodo que se encarga de borrar los municipios del select de municipio y agregar los municipios al select de municipio que han sido buscar por distrito
  agregarMunicipiosByDistrito = async () => {
    const select = document.getElementById('select-municipio')
    const id_distrito = document.getElementById('select-distrito').value
    const municipios = await this.model.getMunicipiosByDistrito(id_distrito)
    this.borrarMunicipio()
    municipios.forEach(municipio => {
      const option = document.createElement('option')
      option.value = municipio.id_municipio_distrito
      option.text = municipio.nombre_municipio
      select.appendChild(option)
    })
  }


  //Metodo que se encarga de agregar los defensores al select de defensor 
  agregarDefensores = async () => {
    try {
      const select = document.getElementById('select-defensor')
      const id_zona = document.getElementById('select-zona').value

      const defensores = await this.model.getDefensoresByZona(id_zona)

      //En caso de que existan defensores se procede a borrar los defensores del select de defensor
      if (defensores.length !== 0) {
        this.borrarDefensor()
      }

      //Se procede a agregar los defensores al select de defensor
      defensores.forEach(defensor => {
        const option = document.createElement('option')
        option.value = defensor.id_defensor
        option.text = defensor.nombre_defensor
        select.appendChild(option)
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  //Metodo que se encarga de borrar los asesores del select de asesor y de agregar los asesores al select de asesor
  agregarAsesores = async () => {

    try {
      const select = document.getElementById('select-asesor')
      const id_zona = document.getElementById('select-zona').value
      const asesores = await this.model.getAsesoresByZona(id_zona)
      const option = document.createElement('option')

      //En caso de que existan asesores se procede a borrar los asesores del select de asesor
      if (asesores.length !== 0) {
        this.borrarAsesor()

      }

      //Se procede a agregar los asesores al select de asesor
      asesores.forEach(asesor => {
        const option = document.createElement('option')
        option.value = asesor.id_asesor
        option.text = asesor.nombre_asesor
        select.appendChild(option)
      })
    } catch (error) {
      console.error(error.message)
    }
  }

}
export { ConsultaController }
