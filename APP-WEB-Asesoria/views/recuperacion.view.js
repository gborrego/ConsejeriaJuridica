import '../components/modal-warning/modal-warning.js'

class RecuperacionView {
  constructor(controller) {
    this.controller = controller

    // Obtén los elementos de los botones
    this.recuperacionForm = document.getElementById('recuperar')

    // Agrega manejadores de eventos
    this.recuperacionForm.addEventListener('submit', e => {
      e.preventDefault()
      this.controller.handleRecuperacion()
    })
  }
}

export { RecuperacionView }
