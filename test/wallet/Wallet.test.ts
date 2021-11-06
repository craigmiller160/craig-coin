import { Wallet } from '../../src/wallet/Wallet';

describe('Wallet', () => {
	it('toString', () => {
		const wallet = new Wallet();
		expect(wallet.toString()).toEqual(`Wallet - 
		publicKey: ${wallet.publicKey}
		balance  : ${wallet.balance}`);
	});

	it('sign', () => {
		throw new Error();
	});
});
