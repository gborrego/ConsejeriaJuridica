import {  EstadoCivilController } from '../controllers/estado-civil.controller.js'
import { APIModel } from '../models/api.model.js'
import { EstadoCivilView } from '../views/estado-civil.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new EstadoCivilController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new EstadoCivilView(controller)
}

main()
