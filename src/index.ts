import express from 'express';
import { Blockchain } from './chain/Blockchain';
import { configureGetBlocks } from './routes/getBlocks';

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const blockchain = new Blockchain();

const app = express();
configureGetBlocks(app, blockchain);

app.listen(HTTP_PORT, () => {
	console.info(`Listening on port ${HTTP_PORT}`);
});
