import { JuzgadoController   } from '../controllers/juzgado.controller'
import { APIModel } from '../models/api.model'
import { JuzgadoView } from '../views/juzgado.view'

const main = () => {
  const model = new APIModel()
  const controller = new JuzgadoController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new JuzgadoView(controller)
}

main()
