import request from 'supertest';
import { createTestServer } from '../testutils/createTestServer';
import { unpackRight } from '../testutils/utilityFunctions';
import { newTransaction } from '../../src/transaction/transactionUtils';

describe('mine', () => {
	it('POST /mine', async () => {
		const { app, blockchain, p2pServer, transactionPool, wallet } =
			createTestServer();
		transactionPool.addTransaction(
			unpackRight(newTransaction(wallet, 'abc', 100))
		);
		await request(app)
			.post('/mine')
			.auth(
				process.env.BASIC_AUTH_USER ?? '',
				process.env.BASIC_AUTH_PASSWORD ?? ''
			)
			.expect(302);
		expect(blockchain.chain).toHaveLength(2);
		expect(p2pServer.syncChains).toHaveBeenCalled();
		expect(p2pServer.broadcastClearTransactions).toHaveBeenCalled();
		expect(transactionPool.transactions).toHaveLength(0);
	});
});
