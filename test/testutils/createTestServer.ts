import { Blockchain } from '../../src/chain/Blockchain';
import { TransactionPool } from '../../src/transaction/TransactionPool';
import { P2pServer } from '../../src/p2p-server';
import { createServer } from '../../src/rest-server';
import { Express } from 'express';

export interface TestServer {
	app: Express;
	blockchain: Blockchain;
	transactionPool: TransactionPool;
	p2pServer: P2pServer;
}

export const createTestServer = (): TestServer => {
	const blockchain = new Blockchain();
	const transactionPool = new TransactionPool();
	const p2pServer = new P2pServer(blockchain);
	const app = createServer(blockchain, transactionPool, p2pServer);
	return {
		app,
		blockchain,
		transactionPool,
		p2pServer
	};
};
