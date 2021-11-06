import { INITIAL_BALANCE } from '../config';
import { ec } from 'elliptic';
import { genKeyPair } from '../utils/cryptoUtils';

export class Wallet {
	readonly balance = INITIAL_BALANCE;
	readonly keyPair: ec.KeyPair = genKeyPair();
	readonly publicKey = this.keyPair.getPublic().encode('hex', false);

	sign(dataHash: string): string {
		return this.keyPair.sign(dataHash).toDER('hex');
	}

	toString(): string {
		return `Wallet - 
		publicKey: ${this.publicKey}
		balance  : ${this.balance}`;
	}
}
