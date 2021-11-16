import { Wallet } from '../../src/wallet/Wallet';

describe('Wallet', () => {
	it('updateBalance', () => {
		const wallet = new Wallet();
		wallet.updateBalance(100);
		expect(wallet.balance).toEqual(100);
	});
});
