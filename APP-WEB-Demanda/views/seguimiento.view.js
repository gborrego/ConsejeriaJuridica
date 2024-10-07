import '../components/modal-warning/modal-warning.js'
import '../components/navbar/navbar.js'
import '../components/seguimiento/tabs-header.js'
import '../components/seguimiento/registro-tab.js'
import '../components/seguimiento/promovente-tab.js'
import '../components/seguimiento/demandado-tab.js'
import '../components/seguimiento/proceso-tab.js'
import '../components/seguimiento/detalles-tab.js'

class SeguimientoView {
  constructor(controller) {
    this.controller = controller
    document.addEventListener('DOMContentLoaded', () => {
      this.controller.handleDOMContentLoaded();
      this.initNavbar();
    });
  }
  initNavbar() {
    const navbar = document.querySelector('navbar-comp');
    if (navbar) {
      navbar.permisos = this.controller.model.user.permisos;
    }
  }
}

export { SeguimientoView }
