import { BlockData } from '../types/blockTypes';

const DIFFICULTY = 4;

export class Block {
	constructor(
		public readonly timestamp: string,
		public readonly lastHash: string,
		public readonly hash: string,
		public readonly nonce: number,
		public readonly data: BlockData
	) {}

	toString(): string {
		return `Block - 
			Timestamp: ${this.timestamp}
			Last Hash: ${this.lastHash}
			Hash     : ${this.hash}
			Nonce    : ${this.nonce}
			Data     : ${JSON.stringify(this.data)}`;
	}
}
