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

	describe('POST /transactions', () => {
		it('body missing properties', async () => {
			const { app } = createTestServer();
			const missingRecipient = {
				amount: 100
			};
			await request(app)
				.post('/transactions')
				.send(missingRecipient)
				.expect(400);

			const missingAmount = {
				recipient: 'abc'
			};
			await request(app)
				.post('/transactions')
				.send(missingAmount)
				.expect(400);
		});

		it('creates and broadcasts transaction', async () => {
			const body = {
				recipient: 'abc',
				amount: 100
			};
			const { app, p2pServer, transactionPool } = createTestServer();
			await request(app).post('/transactions').send(body).expect(302);
			expect(transactionPool.transactions).toHaveLength(1);
			expect(p2pServer.broadcastTransaction).toHaveBeenCalled();
		});

		it('has error creating transaction', async () => {
			const body = {
				recipient: 'abc',
				amount: 100
			};
			const { app, p2pServer } = createTestServer();
			(p2pServer.broadcastTransaction as jest.Mock).mockImplementation(
				() => {
					throw new Error('Dying');
				}
			);
			await request(app).post('/transactions').send(body).expect(500);
		});
	});
});
