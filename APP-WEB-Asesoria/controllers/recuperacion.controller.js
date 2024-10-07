import { ValidationError } from '../lib/errors.js'

class RecuperacionController {
  constructor(model) {
    this.model = model
  }

  callbackClose = () => {
    window.location.replace('login.html')
  }

  //Metodo que se encarga de manejar la recuperacion de contraseña
  handleRecuperacion = async () => {
    const correo = document.getElementById('correo').value
    try {
      //Manejo de errores
      if (!correo) {
        throw new ValidationError(
          'Campos obligatorios en blanco, por favor revise.'
        )
      }
//En caso de exito se mostrara un modal con el mensaje de recuperacion exitosa
      const response = await this.model.recover(correo)
      const modal = document.querySelector('modal-warning')
      modal.title = 'Recuperación Exitosa.'
      modal.message = response.message
      modal.open = true
      // modal.setOnCloseCallback = this.callbackClose
      // location.replace('login.html')
    } catch (error) {
      //Manejo de errores y muestra de modales
      if (error instanceof ValidationError) {
        const modal = document.querySelector('modal-warning')
        modal.message = error.message
        modal.open = true
      } else {
        const modal = document.querySelector('modal-warning')
        modal.message = 'No existe usuario con el correo proporcionado.'
        modal.open = true
      }
    }
  }
}

export { RecuperacionController }
