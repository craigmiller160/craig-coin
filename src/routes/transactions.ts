import { Express } from 'express';
import { TransactionPool } from '../transaction/TransactionPool';

export const configureGetTransactions = (
	app: Express,
	transactionPool: TransactionPool
) =>
	app.get('/transactions', (req, res) => {
		res.json(transactionPool.transactions);
	});
