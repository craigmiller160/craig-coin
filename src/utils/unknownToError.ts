export const unknownToError = (value: unknown): Error => {
	if (value instanceof Error) {
		return value as Error;
	}
	return new Error(`Unknown error received: ${value}`);
};
