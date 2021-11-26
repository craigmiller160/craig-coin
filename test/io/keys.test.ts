import { keyFileExists } from '../../src/io/keys';

jest.mock('../../src/io/constants', () => {
	const path = jest.requireActual('path');
	return {
		DATA_DIR_PATH: path.resolve(__dirname, '..', 'testfiles')
	};
});

describe('io keys', () => {
	describe('keyFileExists', () => {
		it('does exist', () => {
			expect(keyFileExists()).toEqual(true);
		});

		it('does not exist', () => {
			throw new Error();
		});
	});

	it('loadPrivateKey', () => {
		throw new Error();
	});

	it('savePrivateKey', () => {
		throw new Error();
	});
});
