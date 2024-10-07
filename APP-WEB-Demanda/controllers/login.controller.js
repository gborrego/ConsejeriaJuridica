import { ValidationError } from '../lib/errors'
import { validateNonEmptyFields } from '../lib/utils'

class LoginController {
  //Constructor de la clase
  constructor(model) {
    this.model = model
  }
  #acceptablePermissions = ['ALL_SD', 'AD_ESCOLARIDAD_SD', 'AD_ETNIA_SD', 'AD_JUZGADO_SD', 'AD_OCUPACION_SD', 'CONSULTA_PROCESO_JUDICIAL_SD', 'SEGUIMIENTO_PROCESO_JUDICIAL_SD', 'REGISTRO_PROCESO_JUDICIAL_SD']

  // Metodo que se encarga de hacer el login
  handleLogin = async () => {
    //Obtenemos el correo y la contraseña del usuario
    const correo = document.getElementById('correo').value
    const password = document.getElementById('password').value
    try {
      //Validamos que los campos no estén vacíos  
      if (!validateNonEmptyFields([correo, password])) {
        throw new ValidationError(
          'Campos obligatorios en blanco, por favor revise.'
        ) 
      }
     console.log('correo', correo)  
      console.log('password ', password)


      //Aqui en este caso se procedera a cambiar el assets del navbar con respecto a los permisos del usuario
      const user = await this.model.login({ correo, password })
       
      console.log('user', user) 
      const userPermissions = user.permisos;
      const acceptablePermissions = this.#acceptablePermissions;
      const hasPermission = (userPermissions, acceptablePermissions) => {
        return userPermissions.some(permission => acceptablePermissions.includes(permission));
      };
      if (!hasPermission(userPermissions, acceptablePermissions)) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'No cuenta con permisos para acceso al sistema'
        modal.title = 'Sin Credenciales'
        modal.open = true
        return;
      }
      sessionStorage.setItem('user', JSON.stringify(user))
      location.replace('index.html')
    } catch (error) {
      console.error(error.message)
      //Muestra un mensaje de error en caso de que el login no sea exitoso
      if (error instanceof ValidationError) {
        const modal = document.querySelector('modal-warning')
        modal.message = error.message
        modal.open = true
      } else {
        const modal = document.querySelector('modal-warning')
        modal.message = 'Las credenciales no son válidas, intente de nuevo.'
        modal.open = true
      }
    }
  }
}

export { LoginController }
