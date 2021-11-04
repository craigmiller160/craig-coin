import express from 'express';
import { Blockchain } from './chain/Blockchain';
import { configureGetBlocks } from './routes/getBlocks';
import bodyParser from 'body-parser';
import { configureMine } from './routes/mine';

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const blockchain = new Blockchain();

// TODO make this re-usable instead of test server
const app = express();
app.use(bodyParser.json());
configureGetBlocks(app, blockchain);
configureMine(app, blockchain);

app.listen(HTTP_PORT, () => {
	console.info(`Listening on port ${HTTP_PORT}`);
});
