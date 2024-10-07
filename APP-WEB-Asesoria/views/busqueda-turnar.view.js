import '../components/modal-warning/modal-warning.js'
import '../components/navbar/navbar.js'

class BusquedaTurnarView {
  constructor(controller) {
    this.controller = controller

    // Obtén los elementos de los botones
    this.searchForm = document.getElementById('registrar-turno')

    // Agrega manejadores de eventos
    document.addEventListener('DOMContentLoaded', () => {
      this.controller.handleDOMContentLoaded();
      this.initNavbar();
    });

    this.searchForm.addEventListener('submit', e => {
      e.preventDefault()

      // Obtener los datos del formulario
      const formData = new FormData(this.searchForm)
      const inputs = Object.fromEntries(formData.entries())
      const inputsArray = Object.values(inputs)

      // Enviar los datos al controlador
      this.controller.handleSearch(inputsArray)
    })
  }
  initNavbar() {
    const navbar = document.querySelector('navbar-comp');
    if (navbar) {
      navbar.permisos = this.controller.model.user.permisos;
    }
  }
}

export { BusquedaTurnarView }
