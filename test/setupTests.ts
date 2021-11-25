import '@relmify/jest-fp-ts';

process.env.BASIC_AUTH_USER = 'user@gmail.com';
process.env.BASIC_AUTH_PASSWORD = 'password';

jest.mock('../src/p2p/webSocketWrapperUtils', () => {
	return jest.requireActual('./testutils/testWebSocketWrapperUtils');
});
