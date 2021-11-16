import { INITIAL_BALANCE } from '../config';
import { ec } from 'elliptic';
import { genKeyPair } from '../utils/cryptoUtils';

export class Wallet {
	#balance = INITIAL_BALANCE;
	readonly keyPair: ec.KeyPair = genKeyPair();
	readonly publicKey = this.keyPair.getPublic().encode('hex', false);

	get balance(): number {
		return this.#balance;
	}

	updateBalance(newBalance: number) {
		this.#balance = newBalance;
	}
}
