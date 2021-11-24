import WebSocket from 'ws';
import { Blockchain } from '../chain/Blockchain';
import { TransactionPool } from '../transaction/TransactionPool';

export class P2pServer {
	#sockets: ReadonlyArray<WebSocket> = [];
	constructor(
		public readonly blockchain: Blockchain,
		public readonly transactionPool: TransactionPool
	) {}
}
