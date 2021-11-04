import { genesisBlock, mineBlock, hashBlock } from '../../src/block/blockUtils';
import {format, utcToZonedTime} from 'date-fns-tz';

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
		throw new Error();
	});

	it('hashBlock', () => {
		throw new Error();
	});
});
