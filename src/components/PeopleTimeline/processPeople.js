

export default function processPeople(people) {
  const affiliationPeriods = []

  people.forEach(person => {
    if (person.affiliationsPeriods) {
      person.affiliationsPeriods.forEach(period => {
        if (period.start && period.start.date && period.end && period.end.date) {
          const obj = {
            name: person.name,
            role: period.role,
            _id: person._id,
            start: new Date(period.start.date.utc),
            end: new Date(period.end.date.utc),
          }

          if (obj.start.getTime() == obj.end.getTime()) {
            obj.end.setFullYear(obj.end.getFullYear() + 1)
          }

          if (!isNaN(obj.start) && !isNaN(obj.end)) {
            affiliationPeriods.push(obj)
          } else {
            // console.info(person.name, person.role)
          }
        }
      })
    }
  })

  return affiliationPeriods
}
