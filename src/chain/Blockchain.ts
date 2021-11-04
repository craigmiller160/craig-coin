import { Block } from '../block/Block';
import { genesisBlock, mineBlock } from '../block/blockUtils';
import { BlockData } from '../types/blockTypes';
import { isValidChain } from './blockchainUtils';

export class Blockchain {
	#chain: ReadonlyArray<Block> = [genesisBlock()];

	get chain(): ReadonlyArray<Block> {
		return this.#chain.slice();
	}

	addBlock(data: BlockData): Block {
		const block = mineBlock(this.chain[this.chain.length - 1], data);
		this.#chain = [...this.#chain, block];
		return block;
	}

	replaceChain(newChain: ReadonlyArray<Block>) {
		if (newChain.length <= this.#chain.length) {
			console.warn('Received chain is not longer than the current chain');
			return;
		}
		if (!isValidChain(newChain)) {
			console.warn('Received chain is not valid');
			return;
		}

		this.#chain = newChain;
		console.info('Replacing blockchain with the new chain');
	}
}

export type BlockchainType = Blockchain;
