import '../components/modal-warning/modal-warning.js'
import '../components/navbar/navbar.js'
import '../components/proceso/tabs-header.js'
import '../components/proceso/registro-tab.js'
import '../components/proceso/promovente-tab.js'
import '../components/proceso/demandado-tab.js'
import '../components/proceso/proceso-tab.js'
import '../components/proceso/detalles-tab.js'

class ProcesoView {
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

export { ProcesoView }
