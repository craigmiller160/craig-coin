import { genKeyPair } from '../../src/utils/cryptoUtils';

describe('cryptoUtils', () => {
	it('genKeyPair', () => {
		const keyPair = genKeyPair();
		expect(keyPair).not.toBeUndefined();
	});

	it('verifySignature', () => {
		throw new Error();
	});

	it('hashData', () => {
		throw new Error();
	});

	it('hashText', () => {
		throw new Error();
	});
});
