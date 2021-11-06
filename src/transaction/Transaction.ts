import { nanoid } from 'nanoid';
import { TransactionOutput } from './TransactionOutput';

// TODO couldn't there just be one output per-transaction, rather than this?
export class Transaction {
	readonly id: string = nanoid();
	readonly input: string = ''; // TODO need real type
	constructor(public outputs: ReadonlyArray<TransactionOutput>) {}

	toString(): string {
		return `Transaction - 
		id     : ${this.id}
		input  : ${this.input}
		outputs: ${JSON.stringify(this.outputs, null, 2)}`;
	}
}
