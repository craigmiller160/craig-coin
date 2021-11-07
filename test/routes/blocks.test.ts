import request from 'supertest';
import { createTestServer } from '../testutils/createTestServer';

jest.mock('../../src/p2p-server');

describe('blocks', () => {
	it('GET /blocks', async () => {
		const { app, blockchain } = createTestServer();
		const response = await request(app)
			.get('/blocks')
			.expect('Content-Type', /application\/json/)
			.expect(200);
		expect(response.body).toEqual(blockchain.chain);
	});
});