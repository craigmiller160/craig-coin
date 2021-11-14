import { Block } from '../block/Block';
import { mineBlock } from '../block/blockUtils';
import { isValidChain } from './blockchainUtils';
import { logger } from '../logger';
import { BlockData } from '../block/BlockData';
import { Wallet } from '../wallet/Wallet';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

export class Blockchain {
	#chain: ReadonlyArray<Block>;
	readonly wallet = new Wallet();

	constructor(genesisBlock: Block) {
		this.#chain = [genesisBlock];
	}

	get chain(): ReadonlyArray<Block> {
		return this.#chain.slice();
	}

	addBlock(data: BlockData): E.Either<Error, Block> {
		return pipe(
			mineBlock(this.chain[this.chain.length - 1], data),
			E.map((block) => {
				this.#chain = [...this.#chain, block];
				return block;
			})
		);
	}

	replaceChain(newChain: ReadonlyArray<Block>) {
		if (newChain.length <= this.#chain.length) {
			logger.warn('Received chain is not longer than the current chain');
			return;
		}
		if (!isValidChain(newChain)) {
			logger.warn('Received chain is not valid');
			return;
		}

		this.#chain = newChain;
		logger.info('Replacing blockchain with the new chain');
	}
}
