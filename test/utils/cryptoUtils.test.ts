import {
	genKeyPair,
	hashData,
	hashText,
	verifySignature
} from '../../src/utils/cryptoUtils';
import { ec } from 'elliptic';
import { unpackRight } from '../testutils/utilityFunctions';

describe('cryptoUtils', () => {
	it('genKeyPair', () => {
		const keyPair = unpackRight(genKeyPair());
		expect(keyPair).not.toBeUndefined();
	});

	it('getKeyPairFromPrivate', () => {
		throw new Error();
	});

	describe('verifySignature', () => {
		let keyPair: ec.KeyPair;
		let publicKeyString: string;
		let dataHash: string;
		let validSignature: string;
		beforeEach(() => {
			keyPair = unpackRight(genKeyPair());
			publicKeyString = keyPair.getPublic().encode('hex', false);
			const data = {
				abc: 'def'
			};
			dataHash = unpackRight(hashData(data));
			validSignature = keyPair.sign(dataHash).toDER('hex');
		});

		it('valid signature', () => {
			expect(
				verifySignature(publicKeyString, validSignature, dataHash)
			).toBe(true);
		});

		it('invalid signature', () => {
			expect(verifySignature(publicKeyString, 'abcdefg', dataHash)).toBe(
				false
			);
		});

		it('error while validating', () => {
			expect(verifySignature('abcdefg', validSignature, dataHash)).toBe(
				false
			);
		});
	});

	it('hashData', () => {
		const object = {
			abc: 'def',
			ghi: 'jkl'
		};
		const hash = unpackRight(hashData(object));
		expect(hash).toEqual(
			'38165149a1d03aedc784bc6ec9cb6b33bdf665762a506f7602e124c45f4f09c9'
		);
	});

	it('hashText', () => {
		const text = 'Hello World';
		const hash = unpackRight(hashText(text));
		expect(hash).toEqual(
			'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'
		);
	});
});
