export type BlockData = string[];

export interface MineRequest {
	readonly data: BlockData;
}

export interface TransactionRequest {
	readonly recipient: string;
	readonly amount: number;
}

export interface WalletResponse {
	readonly balance: number;
	readonly publicKey: string;
}
