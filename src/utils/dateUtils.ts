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

export const compareTimestamps = (
	timestamp1: string,
	timestamp2: string
): number => {
	const millis1 = timestampToMillis(timestamp1);
	const millis2 = timestampToMillis(timestamp2);
	if (millis1 > millis2) {
		return -1;
	} else if (millis1 === millis2) {
		return 0;
	} else {
		return 1;
	}
};
