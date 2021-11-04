import { format, utcToZonedTime } from 'date-fns-tz';

export const getExpectedTs = () =>
	format(utcToZonedTime(new Date(), 'UTC'), 'yyyyMMddHHmmssSSSXX', {
		timeZone: 'UTC'
	});

export const verifyTs = (timestamp: string) => {
	const expectedTs = getExpectedTs();
	expect(timestamp).toHaveLength(expectedTs.length);
	expect(timestamp.substring(0, 12)).toEqual(expectedTs.substring(0, 12));
};
