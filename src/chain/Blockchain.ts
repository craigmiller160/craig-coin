import { Block } from '../block/Block';
import { genesisBlock, mineBlock } from '../block/blockUtils';
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
}
