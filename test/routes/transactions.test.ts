import { createTestServer } from '../testutils/createTestServer';
import { unpackRight } from '../testutils/utilityFunctions';
import { newTransaction } from '../../src/transaction/transactionUtils';
import request from 'supertest';

describe('transactions', () => {
	it('GET /transactions', async () => {
		const { app, transactionPool, wallet } = createTestServer();
		const transaction = unpackRight(
			newTransaction(wallet, 'recipient', 100)
		);
		transactionPool.updateOrAddTransaction(transaction);

		const response = await request(app)
			.get('/transactions')
			.expect('Content-Type', /application\/json/)
			.expect(200);
		expect(response.body).toEqual(transactionPool.transactions);
	});

	it('POST /transactions', async () => {
		throw new Error();
	});
});
