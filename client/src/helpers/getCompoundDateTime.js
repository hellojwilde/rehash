var moment = require('moment');

function getCompoundDateTime(date, time) {
  if (!date || !time) {
    return null;
  }

  return moment(time).set({
    'date': date.get('date'),
    'month': date.get('month'),
    'year': date.get('year')
  });
}

module.exports = getCompoundDateTime;