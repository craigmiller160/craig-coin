import { nanoid } from 'nanoid';

// TODO couldn't there just be one output per-transaction, rather than this?
export class Transaction {
	id: string = nanoid();
	input: any = null; // TODO need type
	outputs: any[] = []; // TODO need type
}
