import { Blockchain } from '../chain/Blockchain';
import { TransactionPool } from '../transaction/TransactionPool';
import { Wallet } from '../wallet/Wallet';
import { P2pServer } from '../p2p-server';

export const mine = (
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	wallet: Wallet,
	p2pServer: P2pServer
) => {
	// const validTransactions = transactionPool.
};
