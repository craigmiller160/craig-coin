import { createTestServer } from '../testutils/createTestServer';
import request from 'supertest';

describe('wallet', () => {
	it('GET /wallet', async () => {
		const { app, wallet } = createTestServer();
		const response = await request(app)
			.get('/wallet')
			.auth(
				process.env.BASIC_AUTH_USER ?? '',
				process.env.BASIC_AUTH_PASSWORD ?? ''
			);
		expect(response.body).toEqual({
			balance: wallet.balance,
			publicKey: wallet.publicKey
		});
	});
});
