import { genesisBlock, mineBlock, hashBlock } from '../../src/block/blockUtils';
import {format, utcToZonedTime} from 'date-fns-tz';
import {Block} from '../../src/block/Block';

const getExpectedTs = () => format(
    utcToZonedTime(new Date(), 'UTC'),
    'yyyyMMddHHmmssSSSXX',
    {
        timeZone: 'UTC'
    }
);

describe('blockUtils', () => {
	it('genesisBlock', () => {
	    const expectedTs = getExpectedTs();
		const block = genesisBlock();
		expect(block.timestamp).toHaveLength(expectedTs.length);
		expect(block.timestamp.substring(0,12)).toEqual(expectedTs.substring(0,12));
		expect(block.lastHash).toEqual('----');
		expect(block.data).toEqual([]);
		expect(block.hash).toHaveLength(64);
	});

	it('mineBlock', () => {
		const lastBlock = new Block('timestamp', 'lastHash', 'hash', []);
		const expectedTs = getExpectedTs();
		const block = mineBlock(lastBlock, []);
		expect(block.timestamp).toHaveLength(expectedTs.length);
		expect(block.timestamp.substring(0,12)).toEqual(expectedTs.substring(0,12));
		expect(block.lastHash).toEqual(lastBlock.hash);
		expect(block.data).toEqual([]);
		expect(block.hash).toHaveLength(64);
	});

	it('hashBlock', () => {
		const hash = hashBlock('timestamp', 'lastHash', []);
		expect(hash).toEqual('af5e8e66d42193775e16e0c701ce630760efc63f7c58843c7f3e6685640d7a59');
	});
});
