import {
	genesisBlock,
	hash,
	hashBlock,
	mineBlock
} from '../../src/block/blockUtils';
import { Block } from '../../src/block/Block';
import { verifyTimestamp } from '../testutils/utilityFunctions';
import { DIFFICULTY } from '../../src/config';

describe('blockUtils', () => {
	it('genesisBlock', () => {
		const block = genesisBlock();

		expect(block.timestamp).toEqual('0');
		expect(block.lastHash).toEqual('----');
		expect(block.data).toEqual([]);
		expect(block.hash).toHaveLength(64);
		expect(block.nonce).toEqual(0);
	});

	it('mineBlock', () => {
		const lastBlock = new Block('timestamp', 'lastHash', 'hash', 0, []);
		const block = mineBlock(lastBlock, []);
		verifyTimestamp(block.timestamp);
		expect(block.lastHash).toEqual(lastBlock.hash);
		expect(block.data).toEqual([]);
		expect(block.hash).toHaveLength(64);
		expect(block.hash.substring(0, DIFFICULTY)).toEqual(
			'0'.repeat(DIFFICULTY)
		);
	});

	it('hash', () => {
		const theHash = hash(0, 'timestamp', 'lastHash', []);
		expect(theHash).toEqual(
			'190cbe9463addc578f0f504f7ddec44ee3682c59c6d7149f68a3052214f07cf3'
		);
	});

	it('hashBlock', () => {
		const block = new Block('timestamp', 'lastHash', 'hash', 0, []);
		const hash = hashBlock(block);
		expect(hash).toEqual(
			'190cbe9463addc578f0f504f7ddec44ee3682c59c6d7149f68a3052214f07cf3'
		);
	});
});
