import { EtniaController   } from '../controllers/etnia.controller'
import { APIModel } from '../models/api.model'
import { EtniaView } from '../views/etnia.view'

const main = () => {
  const model = new APIModel()
  const controller = new EtniaController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new EtniaView(controller)
}

main()
