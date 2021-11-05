import { createTimestamp } from '../../src/utils/dateUtils';
import { format, utcToZonedTime } from 'date-fns-tz';

describe('dateUtils', () => {
	it('createTimestamp', () => {
		const expectedTS = format(
			utcToZonedTime(new Date(), 'UTC'),
			'yyyyMMddHHmmssSSSXX',
			{
				timeZone: 'UTC'
			}
		);
		const actualTS = createTimestamp();
		expect(actualTS.length).toEqual(expectedTS.length);
		expect(actualTS.substring(0, 12)).toEqual(expectedTS.substring(0, 12));
	});

	it('millisFromTimestamp', () => {
		throw new Error();
	});
});
