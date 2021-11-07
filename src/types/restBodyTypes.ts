export type BlockData = string[];

export interface MineRequest {
	data: BlockData;
}

export interface TransactionRequest {
	recipient: string;
	amount: number;
}
