module.exports = {
	transform: {
		'^.+\\.ts$': 'ts-jest'
	},
	setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts']
};
