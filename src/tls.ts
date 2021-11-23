import { ServerOptions } from 'https';
import fs from 'fs';
import path from 'path';
import { constants } from 'crypto';
import { RequestListener } from 'http';
import https from 'https';

const ciphers = [
	'ECDHE-ECDSA-AES256-GCM-SHA384',
	'ECDHE-RSA-AES256-GCM-SHA384',
	'ECDHE-ECDSA-CHACHA20-POLY1305',
	'ECDHE-RSA-CHACHA20-POLY1305',
	'ECDHE-ECDSA-AES128-GCM-SHA256',
	'ECDHE-RSA-AES128-GCM-SHA256',
	'ECDHE-ECDSA-AES256-SHA384',
	'ECDHE-RSA-AES256-SHA384',
	'ECDHE-ECDSA-AES128-SHA256',
	'ECDHE-RSA-AES128-SHA256'
];

const tlsProps: ServerOptions = {
	key: fs.readFileSync(
		path.resolve(__dirname, '..', 'certs', 'craigcoin.key.pem')
	),
	cert: fs.readFileSync(
		path.resolve(__dirname, '..', 'certs', 'craigcoin.cert.pem')
	),
	ciphers: ciphers.join(';'),
	passphrase: process.env.TLS_KEY_PASSWORD,
	secureOptions:
		constants.SSL_OP_NO_TLSv1_1 |
		constants.SSL_OP_NO_TLSv1 |
		constants.SSL_OP_NO_SSLv3 |
		constants.SSL_OP_NO_SSLv2
};

export const createHttpsServer = (requestListener?: RequestListener) =>
	https.createServer(tlsProps, requestListener);
