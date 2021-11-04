import { BlockDataType } from '../types/blockTypes';

export class Block {
	constructor(
		public timestamp: string,
		public lastHash: string,
		public hash: string,
		public data: BlockDataType
	) {}

	toString(): string {
		return `Block - 
			Timestamp: ${this.timestamp}
			Last Hash: ${this.lastHash}
			Hash     : ${this.hash}
			Data     : ${JSON.stringify(this.data)}`;
	}
}
