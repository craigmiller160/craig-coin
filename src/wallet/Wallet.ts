import { INITIAL_BALANCE } from '../config';
import { ec } from 'elliptic';
import { genKeyPair } from './walletUtils';

export class Wallet {
	balance = INITIAL_BALANCE;
	keyPair: ec.KeyPair = genKeyPair();
	publicKey = this.keyPair.getPublic().encode('hex', false); // TODO do I want true or false here?

	toString(): string {
		return `Wallet -
		publicKey: ${this.publicKey}
		balance  : ${this.balance}`;
	}
}
