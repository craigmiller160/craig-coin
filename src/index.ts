import { Blockchain } from './chain/Blockchain';
import { createAndStartRestServer } from './rest-server';
import { P2pServer } from './p2p-server';
import { Wallet } from './wallet/Wallet';
import { TransactionPool } from './transaction/TransactionPool';

const wallet = new Wallet();
const transactionPool = new TransactionPool();
const blockchain = new Blockchain();

const p2pServer = new P2pServer(blockchain);
p2pServer.listen();
createAndStartRestServer(blockchain, transactionPool, p2pServer);
