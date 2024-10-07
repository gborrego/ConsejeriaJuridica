import '../components/modal-warning/modal-warning.js'

class LoginView {
  constructor(controller) {
    this.controller = controller

    // Obtén los elementos de los botones
    this.loginForm = document.getElementById('login')

    // Agrega manejadores de eventos
    this.loginForm.addEventListener('submit', e => {
      e.preventDefault()
      this.controller.handleLogin()
    })
  }
}

export { LoginView }
