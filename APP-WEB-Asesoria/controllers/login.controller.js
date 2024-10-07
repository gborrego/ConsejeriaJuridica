import { validateNonEmptyFields } from '../lib/utils.js'
import { ValidationError } from '../lib/errors.js'

class LoginController {
  constructor(model) {
    this.model = model
  }
  #acceptablePermissions = ['ALL_SA', 'AD_USUARIOS_SA', 'AD_EMPLEADOS_SA', 'AD_JUICIOS_SA', 'AD_GENEROS_SA', 'AD_ESTADOSCIVILES_SA', 'AD_MOTIVOS_SA', 'AD_CATALOGOREQUISITOS_SA', 'CONSULTA_ASESORIA_SA', 'REGISTRO_ASESORIA_SA', 'TURNAR_ASESORIA_SA']

  // Metodo que se enc arga de manejar el login
  handleLogin = async () => {
    const correo = document.getElementById('correo').value
    const password = document.getElementById('password').value
    try {
      if (!validateNonEmptyFields([correo, password])) {
        throw new ValidationError(
          'Campos obligatorios en blanco, por favor revise.'
        )
      }
      //Aqui en este caso se procedera a cambiar el assets del navbar con respecto a los permisos del usuario
      const user = await this.model.login({ correo, password })

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
     // document.cookie = `user=${user}; HttpOnly; Secure; SameSite=Strict;`;

      location.replace('index.html')
    } catch (error) {
      console.error(error.message)
      //Aqui se manejan los errores que se puedan presentar
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
