import { IndexController } from '../controllers/index.controller'
import { APIModel } from '../models/api.model'
import { IndexView } from '../views/index.view'

function main() {
  const model = new APIModel()
  const controller = new IndexController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new IndexView(controller)
}

main()
