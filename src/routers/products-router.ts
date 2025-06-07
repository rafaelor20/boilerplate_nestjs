import { Router } from 'express';
import { productsController } from '../controllers/products-controller';

const productsRouter = Router();

productsRouter
  .all('/*')
  .post('/', productsController.create)
  .get('/', productsController.getAll)
  .get('/:id', productsController.getById)
  .patch('/:id', productsController.update)
  .delete('/:id', productsController.delete);

export { productsRouter };