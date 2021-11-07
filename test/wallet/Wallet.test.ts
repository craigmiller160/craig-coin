import { Wallet } from '../../src/wallet/Wallet';

describe('Wallet', () => {
	it('toString', () => {
		const wallet = new Wallet();
		expect(wallet.toString()).toEqual(`Wallet - 
		publicKey: ${wallet.publicKey}
		balance  : ${wallet.balance}`);
	});

	it('sign', () => {
		const dataHash = 'abcdefg';
		const wallet = new Wallet();
		const result = wallet.sign(dataHash);
		expect(result).toEqual(wallet.keyPair.sign(dataHash).toDER('hex'));
	});

	describe('createTransaction', () => {
		it('creates brand new transaction', () => {
			throw new Error();
		});

		it('updates existing transaction', () => {
			throw new Error();
		});
	});
});
