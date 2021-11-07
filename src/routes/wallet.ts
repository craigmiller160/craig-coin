import { Express, Response } from 'express';
import { Wallet } from '../wallet/Wallet';
import { WalletResponse } from '../types/restTypes';

export const configureGetWallet = (app: Express, wallet: Wallet) =>
	app.get('/wallet', (req, res: Response<WalletResponse>) => {
		res.json({
			balance: wallet.balance,
			publicKey: wallet.publicKey
		});
	});
