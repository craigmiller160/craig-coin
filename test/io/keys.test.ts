import {
	keyFileExists,
	loadPrivateKey,
	savePrivateKey
} from '../../src/io/keys';
import { unpackRight } from '../testutils/utilityFunctions';
import { getDataDirPath } from '../../src/io/constants';
import path from 'path';
import '@relmify/jest-fp-ts';
import fs from 'fs';

jest.mock('../../src/io/constants', () => {
	return {
		getDataDirPath: jest.fn()
	};
});

const testfilesPath = path.resolve(__dirname, '..', 'testfiles');

const cleanupDirectory = () => {
	fs.rmSync(path.resolve(process.cwd(), 'keys'), {
		recursive: true,
		force: true
	});
};

describe('io keys', () => {
	beforeEach(() => {
		(getDataDirPath as jest.Mock).mockReset();
		cleanupDirectory();
	});

	afterEach(() => {
		cleanupDirectory();
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
		(getDataDirPath as jest.Mock).mockImplementation(() => process.cwd());
		const result = savePrivateKey('Hello World');
		expect(result).toBeRight();
		expect(
			fs.existsSync(path.resolve(process.cwd(), 'keys', 'privateKey.pem'))
		);
	});
});
