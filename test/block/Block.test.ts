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
			Data      : []
			Timestamp : timestamp
			Last Hash : lastHash
			Nonce     : 1
			Difficulty: 2
			Hash      : hash`);
	});
});
