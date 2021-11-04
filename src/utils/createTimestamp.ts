import format from 'date-fns/format';

export const createTimestamp = () => format(new Date(), 'yyyyMMddHHmmssSSSXX');
