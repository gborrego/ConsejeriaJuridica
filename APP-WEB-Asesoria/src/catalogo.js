import { CatalogoController   } from '../controllers/catalogo.controller.js'
import { APIModel } from '../models/api.model.js'
import { CatalogoView } from '../views/catalogo.view.js'

const main = () => {
  const model = new APIModel()
  const controller = new CatalogoController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new CatalogoView(controller)
}

main()
