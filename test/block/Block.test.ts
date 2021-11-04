import { Block } from '../../src/block/Block';

describe('Block', () => {
	it('prints custom toString()', () => {
		const block = new Block('timestamp', 'lastHash', 'hash', []);
		expect(block.toString()).toEqual(`Block - 
			Timestamp: timestamp
			Last Hash: lastHash
			Hash     : hash
			Data     : []`);
	});
});
