import {createTimestamp, millisFromTimestamp} from '../../src/utils/dateUtils';
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
		const time = millisFromTimestamp('20211105154415066Z');
		expect(time).toEqual(1636127055066);
	});
});
