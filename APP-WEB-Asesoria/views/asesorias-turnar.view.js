import '../components/asesoria/modal-asesoria.js'
import '../components/asesoria/data-asesoria.js'
import '../components/navbar/navbar.js'

class AsesoriasTurnarView {
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

export { AsesoriasTurnarView }
