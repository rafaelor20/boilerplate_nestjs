import { Router } from 'express';
import { getHistoric, storeTransaction, deleteTransaction } from '@/controllers/products-controller';

const productRouter = Router();

productRouter
  .all('/*')
  .get('/historic', getHistoric)
  .post('/store', storeTransaction)
  .delete('/delete/:transactionId', deleteTransaction);

export { productRouter };