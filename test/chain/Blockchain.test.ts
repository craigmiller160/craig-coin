import { Blockchain } from '../../src/chain/Blockchain';
import { createChain, unpackRight } from '../testutils/utilityFunctions';
import { Block } from '../../src/block/Block';
import { genesisBlock } from '../../src/block/blockUtils';

describe('Blockchain', () => {
	it('starts with genesis block', () => {
		const blockchain = new Blockchain(unpackRight(genesisBlock()));
		expect(blockchain.chain).toHaveLength(1);

		const gBlock = blockchain.chain[0];
		expect(gBlock.timestamp).toEqual('0');
		expect(gBlock.lastHash).toEqual('----');
		expect(gBlock.data).toEqual([]);
		expect(gBlock.hash).toHaveLength(64);
	});

	it('addBlock', () => {
		const blockchain = new Blockchain(unpackRight(genesisBlock()));
		expect(blockchain.chain).toHaveLength(1);

		const block = unpackRight(blockchain.addBlock([]));
		const lastBlock = blockchain.chain[blockchain.chain.length - 1];

		expect(blockchain.chain).toHaveLength(2);
		expect(JSON.stringify(block)).toEqual(JSON.stringify(lastBlock));
	});

	describe('replaceChain', () => {
		it('successful', () => {
			const blockchain = new Blockchain(unpackRight(genesisBlock()));
			const chain = createChain();
			blockchain.replaceChain(chain);
			expect(blockchain.chain).toEqual(chain);
		});

		it('invalid chain', () => {
			const blockchain = new Blockchain(unpackRight(genesisBlock()));
			const chain = createChain();
			chain.push(unpackRight(genesisBlock()));
			blockchain.replaceChain(chain);
			expect(blockchain.chain).toHaveLength(1);
			expect(blockchain.chain).not.toEqual(chain);
		});

		it('chain too short', () => {
			const blockchain = new Blockchain(unpackRight(genesisBlock()));
			const newChain: Block[] = [];
			blockchain.replaceChain(newChain);
			expect(blockchain.chain).toHaveLength(1);
			expect(blockchain.chain).not.toEqual(newChain);
		});
	});
});
