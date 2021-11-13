import { Wallet } from './Wallet';

export const walletToString = (wallet: Wallet): string =>
	`Wallet - 
		publicKey: ${wallet.publicKey}
		balance  : ${wallet.balance}`;

export const signData = (wallet: Wallet, dataHash: string): string =>
	wallet.keyPair.sign(dataHash).toDER('hex');
