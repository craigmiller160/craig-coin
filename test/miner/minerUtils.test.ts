import { createTestServer } from '../testutils/createTestServer';
import { unpackRight } from '../testutils/utilityFunctions';
import { newTransaction } from '../../src/transaction/transactionUtils';
import { mine } from '../../src/miner/minerUtils';
import { genesisBlock } from '../../src/block/blockUtils';
import '@relmify/jest-fp-ts';

describe('minerUtils', () => {
	it('mine, but no transactions to mine', () => {
		const { blockchain, transactionPool, wallet, p2pServer } =
			createTestServer();
		const result = mine(blockchain, transactionPool, wallet, p2pServer);
		expect(result).toEqualLeft(new Error('No transactions to mine'));
	});

	it('mine', () => {
		const { blockchain, transactionPool, wallet, p2pServer } =
			createTestServer();
		const transaction = unpackRight(newTransaction(wallet, 'abc', 100));
		transactionPool.addTransaction(transaction);
		const result = unpackRight(
			mine(blockchain, transactionPool, wallet, p2pServer)
		);
		expect(transactionPool.transactions).toHaveLength(0);
		expect(p2pServer.syncChains).toHaveBeenCalled();
		expect(p2pServer.broadcastClearTransactions).toHaveBeenCalled();

		const newBlock = {
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
			difficulty: 0,
			hash: expect.any(String)
		};
		const theGenesisBlock = unpackRight(genesisBlock());

		expect(result).toEqual(newBlock);

		expect(blockchain.chain).toEqual([theGenesisBlock, newBlock]);
	});
});
