import { INITIAL_BALANCE } from '../config';

export class Wallet {
	balance = INITIAL_BALANCE;
	keyPair: any = null; // TODO need type
	publicKey = '';
	constructor() {}

	toString(): string {
		return `Wallet -
		publicKey: ${this.publicKey}
		balance  : ${this.balance}`;
	}
}
