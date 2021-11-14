import { format, utcToZonedTime } from 'date-fns-tz';
import { Block } from '../../src/block/Block';
import { genesisBlock, mineBlock } from '../../src/block/blockUtils';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { newTransaction } from '../../src/transaction/transactionUtils';
import { Wallet } from '../../src/wallet/Wallet';

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
			const transaction = unpackRight(
				newTransaction(new Wallet(), 'abc', 100)
			);
			const lastBlock = newArray[index];
			const newBlock = mineBlock(lastBlock, [transaction]);
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
