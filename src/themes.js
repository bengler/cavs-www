import {keys, union, flattenDeep} from 'lodash'
import seedrandom from 'seedrandom'
import PropTypes from 'prop-types'

export const themeShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  related: PropTypes.array
})

// key here can be id, key or name
export async function getTheme(fetch, type, key) {

  const item = await getItem(fetch, type, key)
  const theme = await {
    content: async () => ({
      type: type,
      key: key,
      title: item && item.title || item && item.name || key,
      items: await getItems(fetch, type, key)
    })
  }.content()

  theme.getRelated = () => Promise.all([
    getRelatedTheme(fetch, item._type, item._id, 0),
    getRelatedTheme(fetch, item._type, item._id, 1),
    getRelatedTheme(fetch, item._type, item._id, 3)
  ])

  return theme
}

function getItem(fetch, type, key) {
  switch (type) {
    case 'subject':
      return fetch(`
        *["${key}" in subjects && defined(imageAssets)] {
          _id,
          _type,
          identifier,
          imageAssets[] {
            _key,
            asset -> {url, metadata{dimensions}}
          }
        }
        [0...20]
      `)
    case 'person':
      return fetch(`
        *[_id == "${key}"]{
          _id,
          _type,
          name,
          identifier,
          portraits[0...1] {
            _key,
            asset -> {url}
          }
        }[0]
      `)
    default:
      return fetch(`
        *[_id == "${key}"]{
          _id,
          _type,
          title,
          name,
          identifier,
          imageAssets[0...1] {
            _key,
            asset -> {url, metadata{dimensions}}
          }
        }[0]
      `)
  }
}

function getRelatedTheme(fetch, type, key, i) {
  let result
  switch (type) {
    case 'subject':
      result = fetch(`
        *["${key}" in subjects && defined(imageAssets)] {
          _id,
          _type
        }
        [${i}]
      `)
      break
    default:
      result = fetch(`
        *[_type in ["work2d", "work3d"]][references("${key}")]{
          _id,
          _type
        }[${i}]
      `)
  }

  return result.then(item => {
    if (!item) {
      return getRandomTheme(fetch, Math.random())
    }
    return getTheme(fetch, item._type, item._id)
  })

}

export function getItems(fetch, type, key) {
  const projection = `{
    _id,
    _type,
    name,
    title,
    imageAssets[0...1] {
      _key,
      asset -> {url}
    },
    "link": *[_id == "${key}"]{
      _id,
      _type,
      identifier
    }[0]
  }`

  switch (type) {
    case 'subject':
      return fetch(`*["${key}" in subjects && defined(imageAssets)][0..10] ${projection}`)
    default:
      return fetch(`*[references("${key}") && defined(imageAssets)][0..20] ${projection}`)
  }
}

async function getRandomSubject(fetch, random) {
  const subjects = union(flattenDeep(await fetch('*[defined(subjects)].subjects')))
  const subject = {
    key: subjects[Math.floor(random * subjects.length)],
    type: 'subject'
  }
  return subject
}

async function getRandomPerson(fetch, random) {
  // count(*[_type == 'person'])
  // This is slow until we get a gradient fix
  // const persons = await fetch(`
  //   *[_type=="person"]{
  //     _id,
  //     name,
  //     _type,
  //     "references": count(*[references(^._id)])
  //   }| order(references desc)[0...10]
  // `)

  // Use query when count bug is fixed
  const persons = [
    'KuSTdtevcHYwcJtGmAxP87',
    'KuSTdtevcHYwcJtGmAEdbj',
    'EHuxLEh0H8zSzv7I1wh2ZW',
    'KuSTdtevcHYwcJtGmADtzn',
    'EHuxLEh0H8zSzv7I1wgKFZ',
    'EHuxLEh0H8zSzv7I1wjjUn',
    'EHuxLEh0H8zSzv7I1wgZQq',
    'rK2x6kntSczQ7pTNwGpElJ',
    'khRkUyQBJM9b7Ne558QWtH',
    'EHuxLEh0H8zSzv7I1wiXeS'
  ]
  const personId = persons[Math.floor(random * persons.length)]
  const person = await fetch(`
    *[_id == "${personId}"][0]
  `)

  person.type = person._type
  person.key = person._id
  return person
}

async function getRandomWork(fetch, random) {
  // This is slow until we get a gradient fix
  // const works = await fetch(`
  //   *[_type in ["work3d", "work2d"]]{
  //     _id,
  //     name,
  //     _type,
  //     "references": count(*[references(^._id)])
  //   }| order(references desc)[0...10]
  // `)

  // We use static _ID's until gradient is fast
  const works = [
    'hl96Z0p4ueMElEEF2xhWyO',
    '09161ded-a154-4d2c-9597-c007f23d1bc3',
    'ch7HXy1Ux9jmVKZ6TKXvok',
    'hl96Z0p4ueMElEEF319L0a',
    'Zy2wQAJhvq9Xno04o1Au8u',
    '7oyPtsvISZYRglNHCly5TI',
    'dc846443-7f06-44d3-8937-4e3404d2ab7e',
    '52743748-f84a-40b6-81cd-c61284830d20'
  ]
  const workId = works[Math.floor(random * works.length)]
  const work = await fetch(`
    *[_id == "${workId}"][0]
  `)
  work.type = work._type
  work.key = work._id
  return work
}

export async function getRandomTheme(fetch, seed) {
  const random = seedrandom(seed.toString())
  const randomA = random()
  const randomB = random()

  const types = {
    subject: await getRandomSubject(fetch, randomA),
    person: await getRandomPerson(fetch, randomA),
    work: await getRandomWork(fetch, randomA)
  }

  const typeKeys = keys(types)
  const item = types[typeKeys[Math.floor(randomB * typeKeys.length)]]

  return getTheme(fetch, item.type, item.key)
}
