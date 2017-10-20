import dateFns from 'date-fns'

export default function approximationDate(data) {
  const {approximation, date} = data

  if (!date.utc) {
    return ''
  }

  switch (approximation) {
    case 'year':
      return dateFns.format(date.utc, 'YYYY')
    case 'month':
      return dateFns.format(date.utc, 'MMMM YYYY')
    case 'day':
      return dateFns.format(date.utc, 'D. MMMM YYYY')
    case 'circaYear':
      return dateFns.format(date.utc, 'YYYY')
    default:
      return dateFns.format(date.utc, 'D. MMMM YYYY')
  }
}
