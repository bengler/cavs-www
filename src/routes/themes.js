import React from 'react'
import { keys, union, flattenDeep } from 'lodash';
import seedrandom from 'seedrandom'

export async function getTheme (fetch, type, key) {
  switch(type) {
    case 'subject':
      return {
        type: type,
        key: key,
        title: key,
        items: await getItems(fetch, type, key)
      }

    default:
      return []
  }
}

export async function getItems (fetch, type, key) {
  const projection = `{ _id, name, title }`

  switch(type) {
    case 'subject':
      return await fetch(`*["${key}" in subjects] ${projection}`)

    default:
      return []
  }
}

export async function getRandomTheme (fetch, seed) {
  const random = seedrandom(seed.toString())
  const randomA = random()
  const randomB = random()

  const types = {
    async subject () {
      const items = await fetch(`*[defined(subjects)].subjects`, {})
      const subjects = union(flattenDeep(items))
      return subjects[Math.floor(randomA * subjects.length)]
    }
  }

  const typeKeys = keys(types)
  const type = typeKeys[Math.floor(randomB * typeKeys.length)]
  const key = await types[type]()

  return await getTheme(fetch, type, key)
}
