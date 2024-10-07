import { IndexController } from '../controllers/index.controller.js'
import { APIModel } from '../models/api.model.js'
import { IndexView } from '../views/index.view.js'

function main() {
  const model = new APIModel()
  const controller = new IndexController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new IndexView(controller)
}

main()
