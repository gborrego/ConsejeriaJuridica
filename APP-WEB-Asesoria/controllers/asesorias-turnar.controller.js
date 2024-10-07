import { DataAsesoria } from '../components/asesoria/data-asesoria.js'
import { ControllerUtils } from '../lib/controllerUtils.js'

class AsesoriasTurnarController {
  #acceptablePermissions = ['ALL_SA', 'TURNAR_ASESORIA_SA']
  #pagina = 1
  #numeroPaginas
  #asesorias

  constructor(model) {
    this.model = model
    this.utils = new ControllerUtils(model.user)
  }

  buttonsEventListeners = async  () => {
    const prev = document.getElementById('anterior')
    const next = document.getElementById('siguiente')
    prev.addEventListener('click', this.handlePrevPage)
    next.addEventListener('click', this.handleNextPage) 
  }

  handlePrevPage = async () => {
    if (this.#pagina > 1) {
      this.#pagina--
      this.mostrarAsesorias()
    }
  }

  handleNextPage = async () => {
    if (this.#pagina < this.#numeroPaginas) {
      this.#pagina++
      this.mostrarAsesorias()
    }
  }

  getNumeroPaginas = async () => {
    try {
      const nombre_pre = JSON.parse(sessionStorage.getItem('nombre'))
      const apellido_paterno_pre = JSON.parse(sessionStorage.getItem('apellido_paterno'))
      const apellido_materno_pre = JSON.parse(sessionStorage.getItem('apellido_materno')) 
       
     const nombre= nombre_pre.nombre
      const apellido_paterno= apellido_paterno_pre.apellido_paterno
      const apellido_materno= apellido_materno_pre.apellido_materno 
      const {totalAsesorias} = await this.model.getAsesoriaByFullNameTotal(
          nombre,
          apellido_materno,
          apellido_paterno
      ) 
      const total = document.getElementById('total')
      total.innerHTML = `Total: ${totalAsesorias}`
      this.#numeroPaginas = Math.ceil(totalAsesorias / 10)
    } catch (error) {
      console.error('Error:', error.message)
      this.showErrorModal('Error al obtener el total de asesorias, intente de nuevo mas tarde o verifique el status del servidor')
    }
  }

  validateRows = rowsTable => {
    if (rowsTable > 0) {
      this.cleanTable(rowsTable)
    }
    return true
  }

  cleanTable = rowsTable => {
    const table = this.#asesorias
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }

  handleDOMContentLoaded = () => {
    const permiso = this.utils.validatePermissions({})
    if (permiso) {
      const userPermissions = this.model.user.permisos
      const acceptablePermissions = this.#acceptablePermissions
      const hasPermission = userPermissions.some(permission => acceptablePermissions.includes(permission))
      if (!hasPermission) {
        window.location.href = 'index.html'
        return
      }
    }
    this.#asesorias = document.getElementById('table-body')
    this.getNumeroPaginas()
    this.buttonsEventListeners()
    this.mostrarAsesorias()
    window.handleConsultarAsesoriasById = this.handleConsultarAsesoriasById
    window.handleTurnarAsesoriasById = this.handleTurnarAsesoriasById
  }

  mostrarAsesorias = async () => {
    try {
      const table = document.getElementById('table-body')
      const nombre_pre = JSON.parse(sessionStorage.getItem('nombre'))
      const apellido_paterno_pre = JSON.parse(sessionStorage.getItem('apellido_paterno'))
      const apellido_materno_pre = JSON.parse(sessionStorage.getItem('apellido_materno')) 
       
     const nombre= nombre_pre.nombre
      const apellido_paterno= apellido_paterno_pre.apellido_paterno
      const apellido_materno= apellido_materno_pre.apellido_materno 
       
      const asesorias = await this.model.getAsesoriaByFullName(
        nombre,
        apellido_materno,
        apellido_paterno,
        this.#pagina
      )

      const rowsTable = table.rows.length
      if (this.validateRows(rowsTable)) {
        asesorias.asesorias.forEach(asesoria => {
          if (asesoria === null) return
          table.appendChild(this.crearRow(asesoria))
        })
      }
    } catch (error) {
      console.error('Error:', error.message)
      this.showErrorModal('Error al obtener las asesorias, intente de nuevo mas tarde o verifique el status del servidor')
    }
  }

  handleConsultarAsesoriasById = async id => {
    try {
      console.log('id:', id)
      const button = document.querySelector('.consulta-button')
      button.disabled = true
      const asesoria = await this.model.getAsesoriaById(id)
      const persona = asesoria.asesoria.persona
      const domicilio = await this.model.getColoniaById(persona.domicilio.id_colonia)
      const modal = document.querySelector('modal-asesoria')
      const dataAsesoria = new DataAsesoria(asesoria, domicilio)

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

  handleTurnarAsesoriasById = async id => {
    try {
      const asesoria_pre = await this.model.getAsesoriaById(id)
      const asesoria = JSON.parse(JSON.stringify(asesoria_pre.asesoria))
      const dataColonia = await this.model.getColoniaById(asesoria.persona.domicilio.id_colonia)

      sessionStorage.setItem('asesoria', JSON.stringify(asesoria))
      sessionStorage.setItem('colonia', JSON.stringify(dataColonia.colonia))
      location.href = 'turnar.html'
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  crearRow = asesoria => {
    const row = document.createElement('tr')
    row.classList.add('bg-white', 'border-b', 'hover:bg-gray-50')
    row.innerHTML = `
      <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        ${asesoria.datos_asesoria.id_asesoria}
      </td>
      <td class="px-6 py-4">
        ${asesoria.persona.nombre} ${asesoria.persona.apellido_paterno} ${asesoria.persona.apellido_materno}
      </td>
      <td class="px-6 py-4">
        ${asesoria.tipos_juicio.tipo_juicio}
      </td>
      <td class="px-6 py-4">
        ${asesoria.datos_asesoria.resumen_asesoria}
      </td>
      <td class="px-6 py-4">
        ${asesoria.datos_asesoria.usuario}
      </td>
      <td class="px-6 py-4">
        ${asesoria.datos_asesoria.estatus_asesoria}
      </td>
      <td class="px-6 py-4 text-right">
        <button href="#" class="consulta-button font-medium text-[#db2424] hover:underline" onclick="handleConsultarAsesoriasById(this.value)" value="${asesoria.datos_asesoria.id_asesoria}">Consultar</button>
      </td>
      <td class="px-6 py-4 text-right">
        <button href="#" class="turnar-button font-medium text-[#db2424] hover:underline" onclick="handleTurnarAsesoriasById(this.value)" value="${asesoria.datos_asesoria.id_asesoria}">Turnar</button>
      </td>
    `
    return row
  }

  showErrorModal = (message) => {
    const modal = document.querySelector('modal-warning')
    modal.message = message
    modal.title = 'Error'
    modal.open = true
  }
}

export { AsesoriasTurnarController }