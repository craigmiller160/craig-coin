import { utcToZonedTime, format } from 'date-fns-tz';
import { parse } from 'date-fns';

const FORMAT = 'yyyyMMddHHmmssSSSXX';
const TIME_ZONE = 'UTC';

export const createTimestamp = () =>
	format(utcToZonedTime(new Date(), TIME_ZONE), FORMAT, {
		timeZone: TIME_ZONE
	});

export const millisFromTimestamp = (timestamp: string): number => {
	const date = parse(timestamp, FORMAT, new Date());
	return date.getTime();
};