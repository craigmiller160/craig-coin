import { Block } from '../../src/block/Block';
import { genesisBlock, mineBlock } from '../../src/block/blockUtils';
import { isValidChain } from '../../src/chain/blockchainUtils';

const createChain = (): Block[] =>
	[...new Array(3).keys()].reduce(
		(newArray, index) => {
			const lastBlock = newArray[index];
			const newBlock = mineBlock(lastBlock, [`${index}`]);
			return [...newArray, newBlock];
		},
		[genesisBlock()]
	);

describe('blockchainUtils', () => {
	describe('isValidChain', () => {
		it('is valid', () => {
			const chain = createChain();
			expect(isValidChain(chain)).toEqual(true);
		});

		it('invalid genesis block', () => {
			const newGenesis = new Block('timestamp', 'lastHash', 'hash', []);
			const chain = createChain();
			chain[0] = newGenesis;
			expect(isValidChain(chain)).toEqual(false);
		});

		it('invalid block in chain', () => {
			const newBlock = new Block('timestamp', 'lastHash', 'hash', []);
			const chain = createChain();
			chain.push(newBlock);
			expect(isValidChain(chain)).toEqual(false);
		});
	});
});
