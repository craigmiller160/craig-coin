import { Blockchain } from './chain/Blockchain';
import { createAndStartRestServer } from './rest-server';
import {P2pServer} from './p2p-server';

const blockchain = new Blockchain();
const p2pServer = new P2pServer(blockchain);
p2pServer.listen();
createAndStartRestServer(blockchain);
