import '../components/modal-warning/modal-warning.js'
import '../components/navbar/navbar.js'
import '../components/turnar/tabs-header.js'
import '../components/turnar/asesorado-tab.js'
import '../components/turnar/domicilio-tab.js'
import '../components/turnar/turno-tab.js'

class TurnarView {
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

export { TurnarView }
