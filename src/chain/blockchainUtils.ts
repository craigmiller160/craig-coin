import { Block } from '../block/Block';
import { genesisBlock, hashBlock } from '../block/blockUtils';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { logger } from '../logger';

const getGenesisBlockString = (): string =>
	pipe(
		genesisBlock(),
		E.fold(
			(error) => {
				logger.error(
					'Error generating genesis block for chain validation'
				);
				logger.error(error);
				return '';
			},
			(block) => JSON.stringify(block)
		)
	);

const createNewBlockHash = (block: Block): string =>
	pipe(
		hashBlock(block),
		E.fold(
			(error) => {
				logger.error('Error creating block hash for verification');
				logger.error(error);
				return '';
			},
			(hash) => hash
		)
	);

const validateAllBlocks = (chain: ReadonlyArray<Block>): boolean =>
	chain.reduce((valid: boolean, block, index, currentChain) => {
		if (index === 0) {
			return true;
		}

		if (!valid) {
			return false;
		}

		const lastBlock = currentChain[index - 1];
		const newHash = createNewBlockHash(block);

		// TODO go through all transactions
		// TODO verify the input signature
		// TODO verify the outputs all add up to the input
		// TODO track the balance of every wallet to make sure the input amount is correct

		return (
			block.lastHash === lastBlock.hash &&
			block.hash === newHash &&
			block.hash.startsWith('0'.repeat(block.difficulty))
		);
	}, true);

export const isValidChain = (chain: ReadonlyArray<Block>): boolean => {
	const genesisBlockString = getGenesisBlockString();
	if (genesisBlockString !== JSON.stringify(chain[0])) {
		return false;
	}

	return validateAllBlocks(chain);
};
