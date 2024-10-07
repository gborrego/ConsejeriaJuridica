import {  MotivoController } from '../controllers/motivo.controller.js'
import { APIModel } from '../models/api.model.js'
import { MotivoView } from '../views/motivo.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new MotivoController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new MotivoView(controller)
}

main()
