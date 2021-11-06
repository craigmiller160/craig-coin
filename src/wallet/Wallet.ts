import { INITIAL_BALANCE } from '../config';

export class Wallet {
	balance = INITIAL_BALANCE;
	keyPair = ''; // TODO need type
	publicKey = '';

	toString(): string {
		return `Wallet -
		publicKey: ${this.publicKey}
		balance  : ${this.balance}`;
	}
}
