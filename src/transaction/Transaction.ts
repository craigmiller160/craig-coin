import { nanoid } from 'nanoid';
import { TransactionOutput } from './TransactionOutput';

// TODO couldn't there just be one output per-transaction, rather than this?
export class Transaction {
	readonly id: string = nanoid();
	readonly input: any = null; // TODO need type
	constructor(public output: ReadonlyArray<TransactionOutput>) {}
}
