import { Blockchain } from '../chain/Blockchain';
import { Express } from 'express';
import { P2pServer } from '../p2p-server';
import { logger } from '../logger';
import { mine } from '../miner/minerUtils';
import { TransactionPool } from '../transaction/TransactionPool';
import { Wallet } from '../wallet/Wallet';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

export const configureMine = (
	app: Express,
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	wallet: Wallet,
	p2pServer: P2pServer
) =>
	app.post('/mine', (req, res) => {
		pipe(
			mine(blockchain, transactionPool, wallet, p2pServer),
			E.fold(
				(error) => {
					logger.error('Error mining transactions');
					logger.error(error);
					res.status(500);
					res.send(error.message);
				},
				() => res.redirect('/blocks')
			)
		);
	});
