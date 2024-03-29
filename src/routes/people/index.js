import React from 'react'
import {compact, sortBy, last} from 'lodash'

import People from './People'
import Map from './Map'
import Layout from '../../components/Layout'

// for counting "references": count(*[references(^._id)])
// faster? "references": defined(*[references(^._id)][0])
function createQuery() {
  return `
    *[_type=="person"]{
      _id,
      name
    }
    [0..5000]
  `
}

export default {

  path: '/people',
  children: [
    {
      path: '/',
      async action({fetch}) {
        const resp = await fetch(createQuery(), {})

        const people = sortBy(resp, person => {
          if (person.name) {
            const lastName = last(person.name.split(' '))
            return lastName
          }
          return false
        })

        const buckets = []
        people.forEach(person => {
          const lastName = last(person.name.split(' '))
          buckets[lastName.charAt(0).toLowerCase()] = true
        })

        const alphaNumericals = Object.keys(buckets).sort()

        const chunks = alphaNumericals.map(character => {
          return {
            title: character,
            items: compact(people.map(person => {
              if (person.name && last(person.name.split(' ')).charAt(0).toLowerCase() === character) {
                return person
              }
              return false
            }))
          }
        })

        return {
          title: 'People',
          component: <Layout><People chunks={chunks} view="alphabetical" /></Layout>,
        }
      }
    },
    {
      path: '/portraits',
      async action({fetch, params}) {
        const resp = await fetch(`
          *[_type=="person"]{
            _id,
            name,
            portraits[] {
              _key,
              asset -> {url, metadata {dimensions}}
            }
          }
          [0..5000]
        `, {})

        const people = sortBy(resp, person => {
          if (person.name) {
            return last(person.name.split(' '))
          }
          return false
        })

        return {
          title: 'People',
          component: <Layout><People people={people} view="portraits" /></Layout>,
        }
      }
    },
    {
      path: '/timeline',
      async action({fetch, params}) {
        const resp = await fetch(`
          *[_type=="person"]{
            _id,
            _type,
            _createdAt,
            name,
            identifier,
            title,
            date,
            affiliationsPeriods,
            ...
          }
          [0..5000]
        `, {})

        const people = sortBy(resp, person => {
          if (person.name) {
            return last(person.name.split(' '))
          }
          return false
        })

        return {
          title: 'People',
          component: <Layout><People people={people} view="timeline" /></Layout>,
        }
      }
    },
    {
      path: '/map',
      async action({fetch, params}) {
        const people = await fetch(`
          *[_type=="person"]{
            _id,
            name,
            placeOfBirth,
            portraits[] {
              asset -> {url}
            }
          }
          [0..5000]
        `, {})

        return {
          title: 'People - map',
          component: <Layout><Map people={people} /></Layout>,
        }
      }
    }
  ]
}
