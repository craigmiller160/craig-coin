import { Blockchain } from './chain/Blockchain';
import { createAndStartRestServer } from './rest-server';
import { P2pServer } from './p2p-server';
import { TransactionPool } from './transaction/TransactionPool';
import { Wallet } from './wallet/Wallet';

const wallet = new Wallet();
const transactionPool = new TransactionPool();
const blockchain = new Blockchain();

const p2pServer = new P2pServer(blockchain);
p2pServer.listen();
createAndStartRestServer(blockchain, transactionPool, wallet, p2pServer);
