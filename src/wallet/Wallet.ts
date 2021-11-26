import { INITIAL_BALANCE } from '../config';
import { ec } from 'elliptic';
import { genKeyPair } from '../utils/cryptoUtils';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

export class Wallet {
	#balance = INITIAL_BALANCE;
	readonly keyPair: ec.KeyPair;
	readonly publicKey: string;

	constructor(keyPair?: ec.KeyPair) {
		this.keyPair = keyPair
			? keyPair
			: pipe(
					genKeyPair(),
					E.fold(
						(error) => {
							throw error;
						},
						(keyPair) => keyPair
					)
			  );
		this.publicKey = this.keyPair.getPublic().encode('hex', false);
	}

	get balance(): number {
		return this.#balance;
	}

	updateBalance(newBalance: number) {
		this.#balance = newBalance;
	}
}
