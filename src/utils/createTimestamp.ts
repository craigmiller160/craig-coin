import { utcToZonedTime, format } from 'date-fns-tz';

export const createTimestamp = () =>
	format(utcToZonedTime(new Date(), 'UTC'), 'yyyyMMddHHmmssSSSXX', {
		timeZone: 'UTC'
	});
