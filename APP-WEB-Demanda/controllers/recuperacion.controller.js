import { ValidationError } from '../lib/errors'

class RecuperacionController {
  //Constructor de la clase
  constructor(model) {
    this.model = model
  }

  //Función para cerrar la ventana modal
  callbackClose = () => {
    window.location.replace('login.html')
  }

  //Función para recuperar la contraseña
  handleRecuperacion = async () => {
    //Obtenemos el correo del usuario
    const correo = document.getElementById('correo').value
    try {
      //Validamos que el correo no esté vacío
      if (!correo) {
        //Si el correo está vacío, lanzamos un error
        throw new ValidationError(
          'Campos obligatorios en blanco, por favor revise.'
        )
      }

      //Llamamos a la función recover del modelo
      const response = await this.model.recover(correo)
      //Muestra un mensaje de recuperación exitosa
      const modal = document.querySelector('modal-warning')
      modal.title = 'Recuperación Exitosa.'
      modal.message = response.message
      modal.open = true
      // modal.setOnCloseCallback = this.callbackClose
      // location.replace('login.html')
    } catch (error) {
      //Si hay un error, mostramos un mensaje de error
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
