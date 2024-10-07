import { ControllerUtils } from '../lib/controllerUtils'
import { DataAsesoria } from '../components/consultaProceso/data-asesoria'
import { DataPrueba } from '../components/consultaProceso/data-prueba'
import { DataDemandado } from '../components/consultaProceso/data-demandado'
import { DataPromovente } from '../components/consultaProceso/data-promovente'
import { DataEstadosProcesales } from '../components/consultaProceso/data-estados-procesales'

class ConsultaProcesoController {
  //Variables privadas
  #busquedaExitosa = false
  #defensores

  //Constructor de la clase
  constructor(model) {
    this.model = model
    this.utils = new ControllerUtils(model.user)
    // this.buttonsEventListeners()
  }
  #acceptablePermissions = ['ALL_SD', 'CONSULTA_PROCESO_JUDICIAL_SD']
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
    this.eventos()
    this.manageFormFields()
  }
  #bloqueDefensor
  #idProceso
  #rol
  #idEmpleado
  #idDistritoJudicial
  #idUsuario

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
      this.verificadorEstado()
    }
  }
  #defensor

  verificadorEstado = async () => {
    if (this.#rol === 1 || this.#rol === 2 || this.#rol === 4) {
      if (this.#defensor.value !== '0') {
        this.#pagina = 1
        console.log('Rol 1,2,4')
        console.log('Defensor', this.#defensor.value)
        // const { procesosJudiciales } = 
        // await 
        this.model.getProcesosBusqueda(this.#defensor.value, null, false, this.#pagina, this.#estatus_proceso.value === '1' ? "EN_TRAMITE" : this.#estatus_proceso.value === '2' ? "BAJA" : this.#estatus_proceso.value === '3' ? "CONCLUIDO" : null)
          .then(procesosJudiciales => {
            this.#procesos = procesosJudiciales.procesosJudiciales
            this.getNumeroPaginas(this.#defensor.value)
            this.fillTabla()
          })
          .catch(error => {
            this.#pagina = 1
            console.log('Defensor', this.#defensor.value)
            //const { procesosJudiciales } = await 
            this.model.getProcesosBusqueda(null, this.model.user.id_distrito_judicial, false, this.#pagina, this.#estatus_proceso.value === '1' ? "EN_TRAMITE" : this.#estatus_proceso.value === '2' ? "BAJA" : this.#estatus_proceso.value === '3' ? "CONCLUIDO" : null)
              .then(procesosJudiciales => {
                this.#procesos = procesosJudiciales.procesosJudiciales
                this.getNumeroPaginas(null)
                this.fillTabla()
              })
              .catch(error => {
                console.error('Error:', error.message)
                //Mensaje de error
                const modal = document.querySelector('modal-warning');
                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    window.location = '/index.html'
                  }
                });

                modal.message = 'No existen procesos judiciales para mostrar';
                modal.title = 'Error'
                modal.open = 'true'
              })
          })
      }
      else {
        this.#pagina = 1
        console.log('Defensor', this.#defensor.value)
        //const { procesosJudiciales } = await 
        this.model.getProcesosBusqueda(null, this.model.user.id_distrito_judicial, false, this.#pagina, this.#estatus_proceso.value === '1' ? "EN_TRAMITE" : this.#estatus_proceso.value === '2' ? "BAJA" : this.#estatus_proceso.value === '3' ? "CONCLUIDO" : null)
          .then(procesosJudiciales => {
            this.#procesos = procesosJudiciales.procesosJudiciales
            this.getNumeroPaginas(null)
            this.fillTabla()
          })
          .catch(error => {
            console.error('Error:', error.message)
            //Mensaje de error
            const modal = document.querySelector('modal-warning');
            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                window.location = '/index.html'
              }
            }
            );
            modal.message = 'No existen procesos judiciales para mostrar';
            modal.title = 'Error'
            modal.open = 'true'
          })
      }

    } else if (this.#rol === 3) {
      console.log('Rol 3')
      console.log('Defensor', this.#defensor.value)
      //const { procesosJudiciales } = await 
      this.model.getProcesosBusqueda(this.#idEmpleado, null, false, this.#pagina, this.#estatus_proceso.value === '1' ? "EN_TRAMITE" : this.#estatus_proceso.value === '2' ? "BAJA" : this.#estatus_proceso.value === '3' ? "CONCLUIDO" : null)
        .then(procesosJudiciales => {
          this.#procesos = procesosJudiciales.procesosJudiciales
          this.getNumeroPaginas(this.model.user.id_empleado)
          this.fillTabla()
        }).catch(error => {
          console.error('Error:', error.message)
          //Mensaje de error
          const modal = document.querySelector('modal-warning');
          modal.setOnCloseCallback(() => {
            if (modal.open === 'false') {
              window.location = '/index.html'
            }
          }
          );
          modal.message = 'No existen procesos judiciales para mostrar con respecto al defensor';
          modal.title = 'Error'
          modal.open = 'true'
        })

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
      const id_distrito_judicial = this.model.user.id_distrito_judicial
      const { totalProcesosJudiciales } = await this.model.getProcesosBusqueda(id_defensor || null, id_defensor === null ? id_distrito_judicial : null, true, 1, this.#estatus_proceso.value === '1' ? "EN_TRAMITE" : this.#estatus_proceso.value === '2' ? "BAJA" : this.#estatus_proceso.value === '3' ? "CONCLUIDO" : null)

      const total = document.getElementById('total')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + totalProcesosJudiciales
      this.#numeroPaginas = (totalProcesosJudiciales) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });

      modal.message = 'Error al obtener el total de procesos, intente de nuevo mas tarde o verifique el status del servidor';
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
    const table = this.#procesosTable
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }

  #procesos
  #procesosTable
  #estatus_proceso
  manageFormFields = async () => {
    const { id_usuario, id_tipouser, id_distrito_judicial, id_empleado } = this.model.user
    this.#rol = id_tipouser
    this.#bloqueDefensor = document.getElementById('bloque-defensor')
    if (this.#rol === 1 || this.#rol === 2 || this.#rol === 4) {
      // Verifica si la clase 'hidden' existe antes de intentar eliminarla
      if (this.#bloqueDefensor.classList.contains('hidden')) {
        this.#bloqueDefensor.classList.remove('hidden');
      }
    } else if (this.#rol === 3) {
      // Verifica si la clase 'hidden' no existe antes de intentar agregarla
      if (!this.#bloqueDefensor.classList.contains('hidden')) {
        this.#bloqueDefensor.classList.add('hidden');
      }
    }

    this.#estatus_proceso = document.getElementById('estatus_proceso')
    this.#estatus_proceso = estatus_proceso
    this.#idEmpleado = id_empleado
    this.#procesosTable = document.getElementById('table-body')
    this.#idDistritoJudicial = id_distrito_judicial
    this.#idUsuario = id_usuario
    this.#defensor = document.getElementById('defensor')
    this.buttonsEventListeners()
    this.verificadorEstado()
    //this.getNumeroPaginas()
    // this.handleConsultarDemanda()
    //Se consulta los procesos judiciales
    //  this.consultarProcesos()
    //Se agregan los defensores al select
    this.agregarDefensores()
  }
  eventos = async () => {

    //Se agregan los eventos a los botones
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.handleFiltros();
    });

    const deleteButton = document.getElementById('deleteButton');
    deleteButton.addEventListener('click', (event) => {
      event.preventDefault();
      const defensor = document.getElementById('defensor')
      const estatus_proceso = document.getElementById('estatus_proceso')
      defensor.disabled = false
      estatus_proceso.disabled = false
      deleteButton.style.display = 'none'
      defensor.value = '0'
      estatus_proceso.value = '0'
      this.#pagina = 1
      this.verificadorEstado()
    });
  }

  //Metodo para agregar los defensores
  agregarDefensores = async () => {
    try {
      const defensores = await this.model.getDefensoresByDistrito2(this.model.user.id_distrito_judicial)

      this.#defensores = defensores
      const defensor_select = document.getElementById('defensor')
      defensor_select.innerHTML = '';

      // Agregar el primer hijo deseado
      const firstOption = document.createElement('option');
      firstOption.value = '0';
      firstOption.text = 'Selecciona un defensor';
      firstOption.disabled = true;
      firstOption.selected = true;
      defensor_select.appendChild(firstOption);

      this.#defensores.forEach(defensor => {
        const option = document.createElement('option');
        option.value = defensor.id_defensor;
        option.text = defensor.nombre_defensor;
        defensor_select.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching defensores:', error.message);
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {
        if (modal.open === 'false') {
          window.location = '/index.html'
        }
      })
      modal.message = 'No hay defensores asignados en el distrito .'
      modal.title = 'Sin defensores'
      modal.open
    }

  }

  //Metodo para consultar los procesos judiciales
  consultarProcesos = async () => {
    try {
      console.log('Consultando procesos judiciales')
      const procesosResponse = await this.model.getProcesosJudiciales()
      if (procesosResponse === undefined || procesosResponse === null || procesosResponse.length === 0) {
        const modal = document.querySelector('modal-warning');
        modal.message = 'No hay procesos judiciales para mostrar';
        modal.title = 'Error'
        modal.open = true
      } else {
        const table = document.getElementById('table-body')
        table.innerHTML = ''
        procesosResponse.forEach(proceso => {
          table.appendChild(this.crearRow(proceso))
        })
      }

    } catch (error) {
      console.error('Error:', error.message)
      const modal = document.querySelector('modal-warning');
      modal.message = 'No hay procesos judiciales para mostrar';
      modal.title = 'Error'
      modal.open = true
    }
  }

  //Metodo para consultar la asesoria por id
  handleConsultarAsesoriaById = async id => {
    try {
      const button = document.querySelector('.consulta-button')
      button.disabled = true
      const proceso = await this.model.getProcesoJudicialById(id)
      const idTurno = proceso.id_turno
      const turno = await this.model.getTurno(idTurno)
      const asesoria = await this.model.getAsesoriaById(turno.turno.asesoria.datos_asesoria.id_asesoria)

      const modal = document.querySelector('modal-asesoria')
      const dataAsesoria = new DataAsesoria(asesoria)

      const handleModalClose = () => {
        const modalContent = modal.shadowRoot.getElementById('modal-content')
        modalContent.innerHTML = ''
        button.disabled = false
      }

      modal.addEventListener('onClose', handleModalClose)

      const modalContent = modal.shadowRoot.getElementById('modal-content')
      modalContent.appendChild(dataAsesoria)

      modal.title = 'Datos Asesoría'
      modal.open = true
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  //Metodo para consultar el demandado
  handleConsultarDemandado = async id => {
    try {
      const button = document.querySelector('.consulta2-button')
      button.disabled = true
      const proceso = await this.model.getProcesoJudicialById(id)
      for (var i = 0; i <= ((proceso.participantes).length) - 1; i++) {
        if (proceso.participantes[i].demandado != null) {
          this.modalDemandado(proceso.participantes[i])
        }
      }

    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  //Metodo para abrir el modal del demandado
  modalDemandado = async demandado => {
    try {
      const button = document.querySelector('.consulta2-button')
      button.disabled = true
      const modal = document.querySelector('modal-demandado')
      const dataDemandado = new DataDemandado(demandado)

      const handleModalClose = () => {
        const modalContent = modal.shadowRoot.getElementById('modal-content')
        modalContent.innerHTML = ''
        button.disabled = false
      }

      modal.addEventListener('onClose', handleModalClose)

      const modalContent = modal.shadowRoot.getElementById('modal-content')
      modalContent.appendChild(dataDemandado)

      modal.title = 'Datos Demandado'
      modal.open = true
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  //Metodo para consultar el promovente
  handleConsultarPromovente = async id => {
    let familiares_array = []
    try {
      const { familiares } = await this.model.getFamiliaresBusqueda(id, false, 1)
      familiares.forEach(familiar => {
        familiares_array.push(familiar)
      }
      )
    }
    catch (error) {
      console.error('Error:', error.message)
    }
    try {
      const button = document.querySelector('.consulta3-button')
      button.disabled = true
      const proceso = await this.model.getProcesoJudicialById(id)
      for (var i = 0; i <= ((proceso.participantes).length) - 1; i++) {
        if (proceso.participantes[i].promovente != null) {
          this.modalPromovente({ promovente: proceso.participantes[i], familiares: familiares_array, model: this.model })
        }
      }

    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  //Metodo para abrir el modal del promovente
  modalPromovente = async promovente => {
    try {
      const button = document.querySelector('.consulta3-button')
      button.disabled = true
      const modal = document.querySelector('modal-promovente')
      const dataPromovente = new DataPromovente(promovente)

      const handleModalClose = () => {
        const modalContent = modal.shadowRoot.getElementById('modal-content')
        modalContent.innerHTML = ''
        button.disabled = false
      }

      modal.addEventListener('onClose', handleModalClose)

      const modalContent = modal.shadowRoot.getElementById('modal-content')
      modalContent.appendChild(dataPromovente)

      modal.title = 'Datos Promovente'
      modal.open = true
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  //Metodo para consultar la prueba
  handleConsultarPrueba = async id => {
    let pruebas_array = []
    let resoluciones_array = []
    let observaciones_array = []
    try {
      const { pruebas } = await this.model.getPruebasBusqueda(id, false, 1)
      pruebas.forEach(prueba => {
        pruebas_array.push(prueba)
      })
    }
    catch (error) {
      console.error('Error:', error.message)
    }
    try {
      const { resoluciones } = await this.model.getResolucionesBusqueda(id, false, 1)
      resoluciones.forEach(resolucion => {
        resoluciones_array.push(resolucion)
      }
      )
    }
    catch (error) {
      console.error('Error:', error.message)
    }

    try {
      const { observaciones } = await this.model.getObservacionesBusqueda(id, false, 1)
      observaciones.forEach(observacion => {
        observaciones_array.push(observacion)
      }
      )
    }
    catch (error) {
      console.error('Error:', error.message)
    }

    try {
      const button = document.querySelector('.consulta4-button')
      button.disabled = true
      this.modalPrueba({ pruebas: pruebas_array, id_proceso_judicial: id, resoluciones: resoluciones_array, observaciones: observaciones_array, model: this.model })
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  //Metodo para abrir el modal de la prueba
  modalPrueba = async proceso => {
    try {
      const button = document.querySelector('.consulta4-button')
      const modal = document.querySelector('modal-prueba')
      const dataProceso = new DataPrueba(proceso)

      const handleModalClose = () => {
        const modalContent = modal.shadowRoot.getElementById('modal-content')
        modalContent.innerHTML = ''
        button.disabled = false
      }

      modal.addEventListener('onClose', handleModalClose)

      const modalContent = modal.shadowRoot.getElementById('modal-content')
      modalContent.appendChild(dataProceso)

      modal.title = 'Datos Generales Proceso Judicial'
      modal.open = true
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  //Metodo para consultar los estados procesales
  handleConsultarEstadosProcesales = async id => {
    try {
      const button = document.querySelector('.consulta5-button')
      button.disabled = true
      const { estadosProcesales } = await this.model.getEstadosBusqueda(id, false, 1)
      this.modalEstadosProcesales({ estadosProcesales: estadosProcesales, id_proceso_judicial: id, model: this.model })

    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  //Metodo para abrir el modal de los estados procesales
  modalEstadosProcesales = async proceso => {
    try {
      const button = document.querySelector('.consulta5-button')
      const modal = document.querySelector('modal-estados-procesales')
      const dataProceso = new DataEstadosProcesales(proceso)

      const handleModalClose = () => {
        const modalContent = modal.shadowRoot.getElementById('modal-content')
        modalContent.innerHTML = ''
        button.disabled = false
      }

      modal.addEventListener('onClose', handleModalClose)

      const modalContent = modal.shadowRoot.getElementById('modal-content')
      modalContent.appendChild(dataProceso)

      modal.title = 'Estados Procesales'
      modal.open = true
    } catch (error) {
      console.error('Error:', error.message)
    }
  }


  fillTabla = async () => {
    try {
      const procesos = this.#procesos;
      const lista = procesos;
      const table = this.#procesosTable;
      const rowsTable = table.rows.length;

      if (this.validateRows(rowsTable)) {
        lista.forEach(proceso => {
          const row = document.createElement('tr');
          row.classList.add('bg-white', 'border-b', 'hover:bg-gray-50');
          const nombre_defensor = this.#defensores.find(defensor => defensor.id_defensor === proceso.id_defensor);
          row.innerHTML = `<td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  ${proceso.id_proceso_judicial}
              </td>
              <td class="px-6 py-4">
                  ${proceso.fecha_inicio}
              </td>
              <td class="px-6 py-4">
                  ${proceso.control_interno}
              </td>
              <td class="px-6 py-4">
                  ${proceso.numero_expediente}
              </td>
              <td class="px-6 py-4">
                  ${proceso.fecha_estatus === null ? '' : proceso.fecha_estatus}
              </td>
              <td class="px-6 py-4">
                  ${proceso.estatus_proceso}
              </td>
              <td class="px-6 py-4">
                  ${nombre_defensor.nombre_defensor}
              </td>
              <td class="px-6 py-4 text-right">
                  <button href="#" class="consulta-button font-medium text-[#db2424] hover:underline" data-id="${proceso.id_proceso_judicial}">Consultar</button>
              </td>
              <td class="px-6 py-4 text-right">
                  <button href="#" class="consulta2-button font-medium text-[#db2424] hover:underline" data-id="${proceso.id_proceso_judicial}">Consultar</button>
              </td>
              <td class="px-6 py-4 text-right">
                  <button href="#" class="consulta3-button font-medium text-[#db2424] hover:underline" data-id="${proceso.id_proceso_judicial}">Consultar</button>
              </td>
              <td class="px-6 py-4 text-right">
                  <button href="#" class="consulta4-button font-medium text-[#db2424] hover:underline" data-id="${proceso.id_proceso_judicial}">Consultar</button>
              </td>
              <td class="px-6 py-4 text-right">
                  <button href="#" class="consulta5-button font-medium text-[#db2424] hover:underline" data-id="${proceso.id_proceso_judicial}">Consultar</button>
              </td>`;

          table.appendChild(row);
        });

        const consultarButtons1 = table.querySelectorAll('.consulta-button');
        consultarButtons1.forEach(button => {
          button.addEventListener('click', () => {
            this.handleConsultarAsesoriaById(button.getAttribute('data-id'));
          });
        });

        const consultarButtons2 = table.querySelectorAll('.consulta2-button');
        consultarButtons2.forEach(button => {
          button.addEventListener('click', () => {
            this.handleConsultarDemandado(button.getAttribute('data-id'));
          });
        });

        const consultarButtons3 = table.querySelectorAll('.consulta3-button');
        consultarButtons3.forEach(button => {
          button.addEventListener('click', () => {
            this.handleConsultarPromovente(button.getAttribute('data-id'));
          });
        });

        const consultarButtons4 = table.querySelectorAll('.consulta4-button');
        consultarButtons4.forEach(button => {
          button.addEventListener('click', () => {
            this.handleConsultarPrueba(button.getAttribute('data-id'));
          });
        });

        const consultarButtons5 = table.querySelectorAll('.consulta5-button');
        consultarButtons5.forEach(button => {
          button.addEventListener('click', () => {
            this.handleConsultarEstadosProcesales(button.getAttribute('data-id'));
          });
        });
      }
    } catch (error) {
      console.error('Error al obtener los procesos:', error.message);
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => { });
      modal.message = 'Error al obtener los procesos, intente de nuevo o verifique el status del servidor.';
      modal.title = 'Error';
      modal.open = true;
    }
  }

  //Metodo para manejar los filtros y las consultas respectivas
  handleFiltros = async () => {

    const defensor = document.getElementById('defensor')
    const estatus_proceso = document.getElementById('estatus_proceso')
    const botonEliminar = document.getElementById('deleteButton')


    if (defensor.disabled === false) {
      if (this.#rol === 1 || this.#rol === 2 || this.#rol === 4) {
        if (defensor.value === '0') {
          const modal = document.querySelector('modal-warning');
          modal.message = 'Selecciona un defensor';
          modal.title = 'Error'
          modal.open = true
        } else {
          try {

            this.#pagina = 1
            await this.verificadorEstadoFiltros()
            if (this.#procesos.length === 0) {
              const modal = document.querySelector('modal-warning');
              modal.message = 'No se encontraron procesos judiciales con los filtros seleccionados';
              modal.title = 'Error'
              modal.open = true
              this.#defensor.value = '0'
              this.#estatus_proceso.value = '0'
            }
            else {
              defensor.disabled = true
              estatus_proceso.disabled = true
              this.#pagina = 1
              botonEliminar.style.display = 'block'
              await this.verificadorEstado()
            }
          }
          catch (error) {
            console.error('Error:', error.message)
          }
        }

      } else if (this.#rol === 3) {
        try {

          this.#pagina = 1
          await this.verificadorEstadoFiltros()
          if (this.#procesos.length === 0) {
            const modal = document.querySelector('modal-warning');
            modal.message = 'No se encontraron procesos judiciales con los filtros oara el defensor';
            modal.title = 'Error'
            modal.open = true
            this.#defensor.value = '0'
            this.#estatus_proceso.value = '0'
          }
          else {
            defensor.disabled = true
            estatus_proceso.disabled = true
            this.#pagina = 1
            botonEliminar.style.display = 'block'
            await this.verificadorEstado()
          }
        }
        catch (error) {
          console.error('Error:', error.message)
        }
      }


    }
    else {
      const modal = document.querySelector('modal-warning');
      modal.message = 'Ya se realizo una busqueda, para realizar otra, elimina la anterior';
      modal.title = 'Error'
      modal.open = true
    }
    //   }
  }
  verificadorEstadoFiltros = async () => {
    try {
      if (this.#rol === 1 || this.#rol === 2 || this.#rol === 4) {
        if (this.#defensor.value !== '0') {
          const { procesosJudiciales } = await this.model.getProcesosBusqueda(this.#defensor.value, null, false, this.#pagina, this.#estatus_proceso.value === '1' ? "EN_TRAMITE" : this.#estatus_proceso.value === '2' ? "BAJA" : this.#estatus_proceso.value === '3' ? "CONCLUIDO" : null)
          this.#procesos = procesosJudiciales
        }
        else {
          const { procesosJudiciales } = await this.model.getProcesosBusqueda(null, this.model.user.id_distrito_judicial, false, this.#pagina, this.#estatus_proceso.value === '1' ? "EN_TRAMITE" : this.#estatus_proceso.value === '2' ? "BAJA" : this.#estatus_proceso.value === '3' ? "CONCLUIDO" : null)
          this.#procesos = procesosJudiciales
        }

      } else if (this.#rol === 3) {
        const { procesosJudiciales } = await this.model.getProcesosBusqueda(this.#idEmpleado, null, false, this.#pagina, this.#estatus_proceso.value === '1' ? "EN_TRAMITE" : this.#estatus_proceso.value === '2' ? "BAJA" : this.#estatus_proceso.value === '3' ? "CONCLUIDO" : null)
        this.#procesos = procesosJudiciales
      }
      return true
    } catch (error) {
      this.#procesos = []
      return false
    }
  }
  //Metodo para crear las filas de la tabla
  crearRow = proceso => {
    const row = document.createElement('tr')
    row.classList.add('bg-white', 'border-b', 'hover:bg-gray-50')
    const nombre_defensor = this.#defensores.find(defensor => defensor.id_defensor === proceso.id_defensor)
    row.innerHTML = `<td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                ${proceso.id_proceso_judicial}
            </td>
            <td class="px-6 py-4">
                ${proceso.fecha_inicio}
            </td>
            <td class="px-6 py-4">
                ${proceso.control_interno}
            </td>
            <td class="px-6 py-4">
                ${proceso.numero_expediente}
            </td>
            <td class="px-6 py-4">
                ${proceso.fecha_estatus === null ? '' : proceso.fecha_estatus}
            </td>
            <td class="px-6 py-4">
                ${proceso.estatus_proceso}
            </td>
            <td class="px-6 py-4">
                ${nombre_defensor.nombre_defensor}
            </td>

          
            <td class="px-6 py-4 text-right">
                <button href="#" class="consulta-button font-medium text-[#db2424] hover:underline" data-id="${proceso.id_proceso_judicial}" >Consultar</button>
            </td>
            <td class="px-6 py-4 text-right">
                <button href="#" class="consulta2-button font-medium text-[#db2424] hover:underline" data-id="${proceso.id_proceso_judicial}">Consultar</button>
            </td>
            <td class="px-6 py-4 text-right">
                <button href="#" class="consulta3-button font-medium text-[#db2424] hover:underline" data-id="${proceso.id_proceso_judicial}" >Consultar</button>
            </td>
            <td class="px-6 py-4 text-right">
                <button href="#" class="consulta4-button font-medium text-[#db2424] hover:underline" data-id="${proceso.id_proceso_judicial}" >Consultar</button>
            </td>
            <td class="px-6 py-4 text-right">
                <button href="#" class="consulta5-button font-medium text-[#db2424] hover:underline" data-id="${proceso.id_proceso_judicial}" >Consultar</button>
            </td>
            `

    const consultarButton1 = row.querySelectorAll('.consulta-button');
    consultarButton1.forEach(button => {
      button.addEventListener('click', () => {
        this.handleConsultarAsesoriaById(button.getAttribute('data-id'));
      });
    });

    const consultarButton2 = row.querySelectorAll('.consulta2-button');
    consultarButton2.forEach(button => {
      button.addEventListener('click', () => {
        this.handleConsultarDemandado(button.getAttribute('data-id'));
      });
    });

    const consultarButton3 = row.querySelectorAll('.consulta3-button');
    consultarButton3.forEach(button => {
      button.addEventListener('click', () => {
        this.handleConsultarPromovente(button.getAttribute('data-id'));
      });
    });

    const consultarButton4 = row.querySelectorAll('.consulta4-button');
    consultarButton4.forEach(button => {
      button.addEventListener('click', () => {
        this.handleConsultarPrueba(button.getAttribute('data-id'));
      });
    });

    const consultarButton5 = row.querySelectorAll('.consulta5-button');
    consultarButton5.forEach(button => {
      button.addEventListener('click', () => {
        this.handleConsultarEstadosProcesales(button.getAttribute('data-id'));
      });
    });

    return row
  }


}
export { ConsultaProcesoController }
