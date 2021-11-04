import { Blockchain } from './chain/Blockchain';
import { createServer } from './rest-server';

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const blockchain = new Blockchain();
const app = createServer(blockchain);

app.listen(HTTP_PORT, () => {
	console.info(`Listening on port ${HTTP_PORT}`);
});
