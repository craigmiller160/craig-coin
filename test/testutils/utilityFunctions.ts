import { format, utcToZonedTime } from 'date-fns-tz';
import { Block } from '../../src/block/Block';
import { genesisBlock, mineBlock } from '../../src/block/blockUtils';

export const getExpectedTimestamp = () =>
	format(utcToZonedTime(new Date(), 'UTC'), 'yyyyMMddHHmmssSSSXX', {
		timeZone: 'UTC'
	});

export const verifyTimestamp = (timestamp: string) => {
	const expectedTs = getExpectedTimestamp();
	expect(timestamp).toHaveLength(expectedTs.length);
	expect(timestamp.substring(0, 12)).toEqual(expectedTs.substring(0, 12));
};

export const createChain = (): Block[] =>
	[...new Array(3).keys()].reduce(
		(newArray, index) => {
			const lastBlock = newArray[index];
			const newBlock = mineBlock(lastBlock, [`${index}`]);
			return [...newArray, newBlock];
		},
		[genesisBlock()]
	);
