import { INITIAL_BALANCE } from '../config';
import { ec } from 'elliptic';
import { genKeyPair } from './walletUtils';

export class Wallet {
	readonly balance = INITIAL_BALANCE;
	readonly keyPair: ec.KeyPair = genKeyPair();
	readonly publicKey = this.keyPair.getPublic().encode('hex', false);

	toString(): string {
		return `Wallet -
		publicKey: ${this.publicKey}
		balance  : ${this.balance}`;
	}
}
