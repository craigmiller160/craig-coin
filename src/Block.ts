import { createTimestamp } from './utils/createTimestamp';

type BlockDataType = any[]; // TODO improve this type

export class Block {
	static genesis(): Block {
		return new this(
			createTimestamp(),
			'----',
			'f1r57-h45h', // TODO generate a first hash anyway
			[]
		);
	}

	static mineBlock(lastBlock: Block, data: BlockDataType) {
		const hash = 'todo-hash';
		return new this(createTimestamp(), lastBlock.hash, hash, data);
	}

	constructor(
		public timestamp: string, // TODO need to create this internally, but also prevent it from changing during mining if i make this immutable
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
