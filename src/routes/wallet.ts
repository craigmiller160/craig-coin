import { Express, Response } from 'express';
import { Wallet } from '../wallet/Wallet';

interface WalletResponse {
	readonly balance: number;
	readonly publicKey: string;
}

export const configureGetWallet = (app: Express, wallet: Wallet) =>
	app.get('/wallet', (req, res: Response<WalletResponse>) => {
		res.json({
			balance: wallet.balance,
			publicKey: wallet.publicKey
		});
	});
