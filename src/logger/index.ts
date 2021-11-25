import pino from 'pino';

export const logger = pino({
	level: process.env.LOGGER_LEVEL || 'info',
	transport: {
		target: 'pino-pretty',
		options: {
			translateTime: 'yyyy-mm-dd HH:MM:ss.l'
		}
	}
});
