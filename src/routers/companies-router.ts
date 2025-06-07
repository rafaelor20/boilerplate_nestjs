import { Router } from 'express';
import { companiesController } from '../controllers/companies-controller';
import { productsController } from '../controllers/products-controller';

const companiesRouter = Router();

companiesRouter
  .all('/*')
  .post('/', companiesController.create)
  .get('/', companiesController.getAll)
  .get('/:id', companiesController.getById)
  .patch('/:id', companiesController.update)
  .delete('/:id', companiesController.delete)
  .get('/:id/products', productsController.getById);

export { companiesRouter };