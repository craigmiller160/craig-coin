import { format, utcToZonedTime } from 'date-fns-tz';
import { Block } from '../../src/block/Block';
import { genesisBlock, mineBlock } from '../../src/block/blockUtils';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

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

export const unpackRight = <T>(either: E.Either<Error, T>) =>
	pipe(
		either,
		E.getOrElse<Error, T>((error) => {
			throw error;
		})
	);
