import { Blockchain } from '../chain/Blockchain';
import { TransactionPool } from '../transaction/TransactionPool';
import { Wallet } from '../wallet/Wallet';
import { P2pServer } from '../p2p-server';
import { getValidTransactions } from '../transaction/transactionPoolUtils';
import { rewardTransaction } from '../transaction/transactionUtils';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

export const mine = (
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	wallet: Wallet,
	p2pServer: P2pServer
) => {
	const validTransactions = getValidTransactions(transactionPool);
	pipe(
		rewardTransaction(wallet, blockchain.wallet),
		E.map((rewardTxn) => [...validTransactions, rewardTxn]),
		E.chain((transactions) => blockchain.addBlock(transactions)),
		E.map(() => {
			p2pServer.syncChains();
			transactionPool.clear();
			p2pServer.broadcastClearTransactions();
		})
	);
	// TODO what to do with any errors here? don't want to just suppress them
};
