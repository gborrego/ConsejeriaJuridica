import { TurnarController } from '../controllers/turnar.controller.js'
import { APIModel } from '../models/api.model.js'
import { TurnarView } from '../views/turnar.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new TurnarController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new TurnarView(controller)
}

main()
