import { Blockchain } from '../chain/Blockchain';
import { TransactionPool } from '../transaction/TransactionPool';
import { Wallet } from '../wallet/Wallet';
import { P2pServer } from '../p2p-server';
import { getValidTransactions } from '../transaction/transactionPoolUtils';

export const mine = (
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	wallet: Wallet,
	p2pServer: P2pServer
) => {
	const validTransactions = getValidTransactions(transactionPool);
	// include a reward for the miner
	// create a block consisting of the valid transactions
	// synchronize chains in the peer-to-peer server
	// clear the transaction pool
	// broadcast to every miner to clear their transaction pools as well
};
