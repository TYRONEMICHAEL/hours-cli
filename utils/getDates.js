import moment from 'moment';

export default function(fromDate, toDate) {
  const dates = [];
  const nextDay = moment(fromDate).add(1, 'day');

  dates.push(moment(fromDate));

  while (nextDay.isBetween(fromDate, toDate)) {
    dates.push(nextDay);
    nextDay.add(1, 'day');
  }

  dates.push(toDate);

  return dates;
}
