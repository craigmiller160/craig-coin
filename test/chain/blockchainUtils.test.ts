import { Block } from '../../src/block/Block';
import { isValidChain } from '../../src/chain/blockchainUtils';
import { createChain } from '../testutils/utilityFunctions';

describe('blockchainUtils', () => {
	describe('isValidChain', () => {
		it('is valid', () => {
			const chain = createChain();
			// TODO dynamic difficulty is breaking this because of how it impacts hashing
			expect(isValidChain(chain)).toEqual(true);
		});

		it('invalid genesis block', () => {
			const newGenesis = new Block(
				'timestamp',
				'lastHash',
				'hash',
				0,
				[]
			);
			const chain = createChain();
			chain[0] = newGenesis;
			expect(isValidChain(chain)).toEqual(false);
		});

		it('invalid block in chain', () => {
			const newBlock = new Block('timestamp', 'lastHash', 'hash', 0, []);
			const chain = createChain();
			chain.push(newBlock);
			expect(isValidChain(chain)).toEqual(false);
		});
	});
});
