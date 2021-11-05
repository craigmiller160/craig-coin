import { utcToZonedTime, format } from 'date-fns-tz';
import { parse } from 'date-fns';

const FORMAT = 'yyyyMMddHHmmssSSSXX';
const TIME_ZONE = 'UTC';

export const createTimestamp = () => millisToTimestamp(Date.now());

export const millisToTimestamp = (millis: number): string =>
	format(utcToZonedTime(new Date(millis), TIME_ZONE), FORMAT, {
		timeZone: TIME_ZONE
	});

export const timestampToMillis = (timestamp: string): number => {
	const date = parse(timestamp, FORMAT, new Date());
	return date.getTime();
};
