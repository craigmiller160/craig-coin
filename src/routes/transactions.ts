import { Express, Request } from 'express';
import { TransactionPool } from '../transaction/TransactionPool';
import { Wallet } from '../wallet/Wallet';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { logger } from '../logger';
import { createTransaction } from '../wallet/walletUtils';
import { Blockchain } from '../chain/Blockchain';
import { unknownToError } from '../utils/unknownToError';
import { P2pServer } from '../p2p/P2pServer';
import { broadcastTransaction } from '../p2p/p2pUtils';

interface TransactionRequest {
	readonly recipient: string;
	readonly amount: number;
}

export const configureGetTransactions = (
	app: Express,
	transactionPool: TransactionPool
) =>
	app.get('/transactions', (req, res) => {
		res.json(transactionPool.transactions);
	});

export const configureCreateTransaction = (
	app: Express,
	wallet: Wallet,
	p2pServer: P2pServer,
	blockchain: Blockchain,
	transactionPool: TransactionPool
) =>
	app.post(
		'/transactions',
		(req: Request<unknown, unknown, TransactionRequest>, res) => {
			const { recipient, amount } = req.body;
			if (!recipient || !amount) {
				res.status(400);
				res.send('Invalid transaction');
				return;
			}
			pipe(
				createTransaction(
					wallet,
					blockchain,
					transactionPool,
					recipient,
					amount
				),
				E.chain((transaction) =>
					E.tryCatch(
						() => broadcastTransaction(p2pServer, transaction),
						unknownToError
					)
				),
				E.fold(
					(error) => {
						logger.error('Error creating a transaction');
						logger.error(error);
						res.status(500);
						res.send(error.message);
					},
					() => {
						res.redirect('/transactions');
					}
				)
			);
		}
	);
