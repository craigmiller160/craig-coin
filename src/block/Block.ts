import { BlockData } from '../types/blockTypes';

export class Block {
	constructor(
		public readonly timestamp: string,
		public readonly lastHash: string,
		public readonly hash: string,
		public readonly data: BlockData
	) {}

	toString(): string {
		return `Block - 
			Timestamp: ${this.timestamp}
			Last Hash: ${this.lastHash}
			Hash     : ${this.hash}
			Data     : ${JSON.stringify(this.data)}`;
	}
}
