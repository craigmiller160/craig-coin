export interface TransactionInput {
	readonly timestamp: string;
	readonly amount: number;
	readonly address: string;
	readonly signature: string;
}
