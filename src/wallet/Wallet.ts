import { INITIAL_BALANCE } from '../config';

export class Wallet {
	balance = INITIAL_BALANCE;
	keyPair: any = null; // TODO need type
	publicKey = '';
	constructor() {}
}
