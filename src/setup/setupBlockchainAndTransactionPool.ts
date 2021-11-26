import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { genesisBlock } from '../block/blockUtils';
import { Blockchain } from '../chain/Blockchain';
import { TransactionPool } from '../transaction/TransactionPool';

export type ChainAndPool = [Blockchain, TransactionPool];

export const setupBlockchainAndTransactionPool = (): E.Either<
	Error,
	ChainAndPool
> =>
	pipe(
		genesisBlock(),
		E.map((genesisBlock): ChainAndPool => {
			const blockchain = new Blockchain(genesisBlock);
			const transactionPool = new TransactionPool();
			return [blockchain, transactionPool];
		})
	);
