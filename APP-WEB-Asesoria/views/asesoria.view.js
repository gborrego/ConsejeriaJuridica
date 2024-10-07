import '../components/modal-warning/modal-warning.js'
import '../components/navbar/navbar.js'
import '../components/asesoria/tabs-header.js'
import '../components/asesoria/asesoria-tab.js'
import '../components/asesoria/asesorado-tab.js'
import '../components/asesoria/detalles-tab.js'

class AsesoriaView {
  constructor(controller) {
    this.controller = controller;
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

export { AsesoriaView }
