import {
	compareTimestamps,
	createTimestamp,
	millisToTimestamp,
	timestampToMillis
} from '../../src/utils/dateUtils';
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

	it('timestampToMillis', () => {
		const millis = timestampToMillis('20211105154415066Z');
		expect(millis).toEqual(1636127055066);
	});

	it('millisToTimestamp', () => {
		const timestamp = millisToTimestamp(1636127055066);
		expect(timestamp).toEqual('20211105154415066Z');
	});

	describe('compareTimestamps', () => {
		const ts1 = '20211105154415066Z';
		const ts2 = '20211105154415099Z';

		it('greater than', () => {
			const result = compareTimestamps(ts1, ts2);
			expect(result).toEqual(1);
		});

		it('equal to', () => {
			const result = compareTimestamps(ts1, ts1);
			expect(result).toEqual(0);
		});

		it('less than', () => {
			const result = compareTimestamps(ts2, ts1);
			expect(result).toEqual(-1);
		});
	});
});
