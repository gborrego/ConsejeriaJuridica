import {  GeneroController } from '../controllers/genero.controller.js'
import { APIModel } from '../models/api.model.js'
import { GeneroView } from '../views/genero.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new GeneroController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new GeneroView(controller)
}

main()
