import { Express } from 'express';
import { Wallet } from '../wallet/Wallet';

export const configureGetWallet = (app: Express, wallet: Wallet) =>
	app.get('/wallet', (req, res) => {
		res.json(wallet);
	});
