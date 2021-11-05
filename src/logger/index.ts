import pino from 'pino';

export const logger = pino({
	level: process.env.LOGGER_LEVEL || 'info',
	transport: {
		target: 'pino-pretty',
		options: {
			translateTime: 'yyyy-MM-dd HH:mm:ss.l'
		}
	}
});
