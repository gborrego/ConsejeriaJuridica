import {  JuicioController } from '../controllers/juicio.controller.js'
import { APIModel } from '../models/api.model.js'
import { JuicioView } from '../views/juicio.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new JuicioController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new JuicioView(controller)
}

main()
