import { Block } from '../../src/block/Block';

describe('Block', () => {
	it('prints custom toString()', () => {
		const block = new Block('timestamp', 'lastHash', 'hash', 1,[]);
		expect(block.toString()).toEqual(`Block - 
			Timestamp: timestamp
			Last Hash: lastHash
			Hash     : hash
			Nonce    : 1
			Data     : []`);
	});
});
