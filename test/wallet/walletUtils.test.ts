import { Wallet } from '../../src/wallet/Wallet';
import { signData, walletToString } from '../../src/wallet/walletUtils';

describe('walletUtils', () => {
	it('walletToString', () => {
		const wallet = new Wallet();
		expect(walletToString(wallet)).toEqual(`Wallet - 
		publicKey: ${wallet.publicKey}
		balance  : ${wallet.balance}`);
	});

	it('sign', () => {
		const dataHash = 'abcdefg';
		const wallet = new Wallet();
		const result = signData(wallet, dataHash);
		expect(result).toEqual(wallet.keyPair.sign(dataHash).toDER('hex'));
	});
});
