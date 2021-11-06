import { nanoid } from 'nanoid';
import { TransactionOutput } from './TransactionOutput';
import { TransactionInput } from './TransactionInput';

// TODO couldn't there just be one output per-transaction, rather than this?
export class Transaction {
	readonly id: string = nanoid();
	constructor(
		public input: TransactionInput,
		public outputs: ReadonlyArray<TransactionOutput>
	) {}

	toString(): string {
		return `Transaction - 
		id     : ${this.id}
		input  : ${JSON.stringify(this.input, null, 2)}
		outputs: ${JSON.stringify(this.outputs, null, 2)}`;
	}
}
