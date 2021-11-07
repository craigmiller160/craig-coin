import request from 'supertest';
import { createTestServer } from '../testutils/createTestServer';

jest.mock('../../src/p2p-server');

describe('mine', () => {
	it('POST /mine', async () => {
		const body = {
			data: []
		};
		const { app, blockchain, p2pServer } = createTestServer();
		await request(app).post('/mine').send(body).expect(302);
		expect(blockchain.chain).toHaveLength(2);
		expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(
			body.data
		);
		expect(p2pServer.syncChains).toHaveBeenCalled();
	});
});
