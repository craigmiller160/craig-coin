import { Block } from './Block';
import { createTimestamp } from '../utils/createTimestamp';
import { BlockDataType } from '../types/blockTypes';

export const genesisBlock = (): Block =>
	new Block(
		createTimestamp(),
		'----',
		'f1r57-h45h', // TODO generate a first hash anyway
		[]
	);

export const mineBlock = (lastBlock: Block, data: BlockDataType): Block => {
	const hash = 'todo-hash';
	return new Block(createTimestamp(), lastBlock.hash, hash, data);
};
