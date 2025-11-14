import { LoginController } from '../controllers/login.controller.js'
import { APIModel } from '../models/api.model.js'
import { LoginView } from '../views/login.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new LoginController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new LoginView(controller)
  
  // si la sesión ya se inicio, no hay necesidad de regresar
  // a la pantalla de login
  if (model.tokenInexistente()) return;
  window.location.href = window.location.origin + "/index.html";
}

main()
