import { genKeyPair } from '../../src/wallet/walletUtils';

describe('walletUtils', () => {
	it('genKeyPair', () => {
		const keyPair = genKeyPair();
		expect(keyPair).not.toBeUndefined();
	});
});
