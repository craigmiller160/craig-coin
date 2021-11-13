import { BlockData } from './BlockData';

export class Block {
	constructor(
		public readonly data: BlockData,
		public readonly timestamp: string,
		public readonly lastHash: string,
		public readonly nonce: number,
		public readonly difficulty: number,
		public readonly hash: string
	) {}
}
