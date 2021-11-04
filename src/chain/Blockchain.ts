import { Block } from '../block/Block';
import { genesisBlock, hash, hashBlock, mineBlock } from '../block/blockUtils';
import { BlockData } from '../types/blockTypes';

export class Blockchain {
	#chain: Block[] = [genesisBlock()];

	get chain(): ReadonlyArray<Block> {
		return this.#chain.slice();
	}

	addBlock(data: BlockData): Block {
		const block = mineBlock(this.chain[this.chain.length - 1], data);
		this.#chain = [...this.#chain, block];
		return block;
	}

	isValidChain(chain: Block[]): boolean {
		// TODO if genesis block is always consistent, then we don't need this to be instance here
		if (JSON.stringify(this.#chain[0]) !== JSON.stringify(chain[0])) {
			return false;
		}

		return chain.reduce((valid: boolean, block, index, currentChain) => {
			if (!valid) {
				return false;
			}
			const lastBlock = currentChain[index];
			return (
				block.lastHash === lastBlock.hash &&
				block.hash === hashBlock(block)
			);
		}, true);
	}
}
