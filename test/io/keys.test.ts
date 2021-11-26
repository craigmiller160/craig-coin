import { keyFileExists, loadPrivateKey } from '../../src/io/keys';
import { unpackRight } from '../testutils/utilityFunctions';
import { getDataDirPath } from '../../src/io/constants';
import path from 'path';

jest.mock('../../src/io/constants', () => {
	return {
		getDataDirPath: jest.fn()
	};
});

const testfilesPath = path.resolve(__dirname, '..', 'testfiles');

describe('io keys', () => {
	beforeEach(() => {
		(getDataDirPath as jest.Mock).mockReset();
	});

	it('keyFileExists', () => {
		(getDataDirPath as jest.Mock).mockImplementation(() => testfilesPath);
		expect(keyFileExists()).toEqual(true);
	});

	it('loadPrivateKey', () => {
		(getDataDirPath as jest.Mock).mockImplementation(() => testfilesPath);
		const privKey = unpackRight(loadPrivateKey());
		expect(privKey).toEqual('Private Key');
	});

	it('savePrivateKey', () => {
		throw new Error();
	});
});
