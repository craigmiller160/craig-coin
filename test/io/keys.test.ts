import { keyFileExists, loadPrivateKey } from '../../src/io/keys';
import { unpackRight } from '../testutils/utilityFunctions';

jest.mock('../../src/io/constants', () => {
	const path = jest.requireActual('path');
	return {
		DATA_DIR_PATH: path.resolve(__dirname, '..', 'testfiles')
	};
});

describe('io keys', () => {
	it('keyFileExists', () => {
		expect(keyFileExists()).toEqual(true);
	});

	it('loadPrivateKey', () => {
		const privKey = unpackRight(loadPrivateKey());
		expect(privKey).toEqual('Private Key');
	});

	it('savePrivateKey', () => {
		throw new Error();
	});
});
