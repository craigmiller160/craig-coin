import pino from 'pino';

export const logger = pino({
    level: process.env.LOGGER_LEVEL || 'info',
    prettyPrint: {
        translateTime: 'yyyy-MM-dd HH:mm:ss.l'
    }
});