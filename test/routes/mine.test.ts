import request from 'supertest';
import { createTestServer } from '../testutils/createTestServer';
import { unpackRight } from '../testutils/utilityFunctions';
import { newTransaction } from '../../src/transaction/transactionUtils';
import {
	broadcastBlockchain,
	broadcastClearTransactions
} from '../../src/p2p/p2pUtils';

jest.mock('../../src/p2p/p2pUtils', () => {
	const p2pUtils = jest.requireActual('../../src/p2p/p2pUtils');
	return {
		...p2pUtils,
		broadcastClearTransactions: jest.fn(),
		broadcastBlockchain: jest.fn()
	};
});

describe('mine', () => {
	it('POST /mine', async () => {
		const { app, blockchain, transactionPool, wallet } = createTestServer();
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
		expect(broadcastBlockchain).toHaveBeenCalled();
		expect(broadcastClearTransactions).toHaveBeenCalled();
		expect(transactionPool.transactions).toHaveLength(0);
	});
});
