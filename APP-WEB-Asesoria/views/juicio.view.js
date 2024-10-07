import '../components/modal-warning/modal-warning.js'
import '../components/navbar/navbar.js'
import '../components/Registros/juicios-tab.js'

class  JuicioView {
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

export {JuicioView }
 