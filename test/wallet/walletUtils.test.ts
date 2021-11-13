import { Wallet } from '../../src/wallet/Wallet';
import { walletToString } from '../../src/wallet/walletUtils';

describe('walletUtils', () => {
	it('walletToString', () => {
		const wallet = new Wallet();
		expect(walletToString(wallet)).toEqual(`Wallet - 
		publicKey: ${wallet.publicKey}
		balance  : ${wallet.balance}`);
	});
});
