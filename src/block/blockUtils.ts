import { Block } from './Block';
import { createTimestamp } from '../utils/createTimestamp';
import { BlockDataType } from '../types/blockTypes';
import SHA256 from 'crypto-js/sha256';

export const genesisBlock = (): Block => {
	const timestamp = createTimestamp();
	const data: BlockDataType = [];
	const lastHash = '----';
	const hash = hashBlock(timestamp, lastHash, data);
	return new Block(
		timestamp,
		lastHash,
		hash,
		data
	);
}

export const mineBlock = (lastBlock: Block, data: BlockDataType): Block => {
	const timestamp = createTimestamp();
	const hash = hashBlock(timestamp, lastBlock.hash, data);
	return new Block(timestamp, lastBlock.hash, hash, data);
};

export const hashBlock = (timestamp: string, lastHash: string, data: BlockDataType): string =>
	SHA256(timestamp + lastHash + JSON.stringify(data)).toString()