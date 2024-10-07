import {  UsuarioController } from '../controllers/usuario.controller.js'
import { APIModel } from '../models/api.model.js'
import { UsuarioView } from '../views/usuario.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new UsuarioController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new UsuarioView(controller)
}

main()
