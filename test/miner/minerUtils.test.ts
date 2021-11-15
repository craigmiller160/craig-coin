import { createTestServer } from '../testutils/createTestServer';
import { unpackRight } from '../testutils/utilityFunctions';
import { newTransaction } from '../../src/transaction/transactionUtils';
import { mine } from '../../src/miner/minerUtils';

describe('minerUtils', () => {
	it('mine', () => {
		const { blockchain, transactionPool, wallet, p2pServer } =
			createTestServer();
		const transaction = unpackRight(newTransaction(wallet, 'abc', 100));
		transactionPool.addTransaction(transaction);
		mine(blockchain, transactionPool, wallet, p2pServer);
		expect(transactionPool.transactions).toHaveLength(0);
		expect(p2pServer.syncChains).toHaveBeenCalled();
		expect(p2pServer.broadcastClearTransactions).toHaveBeenCalled();
		expect(blockchain.chain).toEqual([
			{
				data: [],
				timestamp: '0',
				lastHash: '----',
				nonce: 0,
				difficulty: 3,
				hash: expect.any(String)
			},
			{
				data: [
					transaction,
					{
						input: {
							timestamp: expect.any(String),
							amount: 500,
							address: blockchain.wallet.publicKey,
							signature: expect.any(String)
						},
						outputs: [
							{
								amount: 50,
								address: wallet.publicKey
							}
						],
						id: expect.any(String)
					}
				],
				timestamp: expect.any(String),
				lastHash: blockchain.chain[0].hash,
				nonce: expect.any(Number),
				difficulty: 2,
				hash: expect.any(String)
			}
		]);
	});
});
