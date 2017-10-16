import React from 'react'
import {sortBy, last} from 'lodash'

import People from './People'
import Layout from '../../components/Layout'
import {compact} from 'lodash'

// for counting "references": count(*[references(^._id)])
function createQuery() {
  return `
    *[_type=="person"]{
      _id,
      name,
      "references": count(*[references(^._id)])
    }
    [0..5000]
  `
}

export default {

  path: '/people',
  children: [
    {
      path: '/alphabetical',
      async action({fetch}) {
        const resp = await fetch(createQuery(), {})

        const people = sortBy(resp, person => {
          if (person.name) {
            return last(person.name.split(' '))
          }
          return false
        })

        const buckets = []
        people.forEach(person => {
          buckets[person.name.charAt(0).toLowerCase()] = true
        })

        const alphaNumericals = Object.keys(buckets).sort()

        const chunks = alphaNumericals.map(character => {
          return {
            title: character,
            items: compact(people.map(person => {
              if (person.name && person.name.charAt(0).toLowerCase() === character) {
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
      path: '/',
      async action({fetch, params}) {
        const resp = await fetch(`
          *[_type=="person"]{
            _id,
            name,
            portraits[] {
              _key,
              asset -> {url}
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
    }
    // {
    //   path: '/:view',
    //   async action({fetch, params}) {
    //     const resp = await fetch(createQuery(), {})
    //
    //     const people = sortBy(resp, person => {
    //       if (person.name) {
    //         return last(person.name.split(' '))
    //       }
    //       return false
    //     })
    //
    //     return {
    //       title: 'People',
    //       component: <Layout><People people={people} view={params.view} /></Layout>,
    //     }
    //   }
    // },
  ]
}
