import { formatDate } from './formatting';
import { DATE_FORMATS } from './constants';
import { format, subYears } from 'date-fns';

export function dateToday () {
  return formatDate((new Date()).toISOString(), DATE_FORMATS.date_value);
}

export function isFutureDate (date: string) {
    return new Date(date).getTime() > new Date(new Date().toDateString()).getTime();
}

export function inferCentury (year: string) {
  if (year.length !== 2) {
    return year;
  }

  const thisCentury = dateToday().substr(0, 2)
    , lastCentury = format(subYears(new Date(), 100), 'YYYY').substr(0, 2)
    , thisCenturyGuess = `${thisCentury}${year}`
    , lastCenturyGuess = `${lastCentury}${year}`
    ;

  if (isFutureDate(`${thisCenturyGuess}-01-01`)) {
    return lastCenturyGuess;
  }

  return thisCenturyGuess;
}
