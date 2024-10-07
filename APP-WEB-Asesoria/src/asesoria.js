import { AsesoriaController } from '../controllers/asesoria.controller.js'
import { APIModel } from '../models/api.model.js'
import { AsesoriaView } from '../views/asesoria.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new AsesoriaController(model)
  const view = new AsesoriaView(controller)
}

main()
