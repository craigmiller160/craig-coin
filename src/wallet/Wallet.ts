import { INITIAL_BALANCE } from '../config';
import { ec } from 'elliptic';
import { genKeyPair } from './walletUtils';

export class Wallet {
	balance = INITIAL_BALANCE;
	keyPair: ec.KeyPair = genKeyPair();
	publicKey = this.keyPair.getPublic().encode('hex', false);

	toString(): string {
		return `Wallet -
		publicKey: ${this.publicKey}
		balance  : ${this.balance}`;
	}
}
