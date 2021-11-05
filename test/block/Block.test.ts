import { Block } from '../../src/block/Block';
import { DIFFICULTY } from '../../src/config';

describe('Block', () => {
	it('prints custom toString()', () => {
		const block = new Block(
			[],
			'timestamp',
			'lastHash',
			1,
			DIFFICULTY,
			'hash'
		);
		expect(block.toString()).toEqual(`Block - 
			Timestamp : timestamp
			Last Hash : lastHash
			Hash      : hash
			Nonce     : 1
			Difficulty: 2
			Data      : []`);
	});
});
