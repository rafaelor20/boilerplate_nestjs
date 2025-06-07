import { Router } from 'express';
import { getHistoric, storeTransaction, deleteTransaction } from '@/controllers/companies-controller';

const companyRouter = Router();

companyRouter
  .all('/*')
  .get('/historic', getHistoric)
  .post('/store', storeTransaction)
  .delete('/delete/:transactionId', deleteTransaction);

export { companyRouter };