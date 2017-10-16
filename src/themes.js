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

export async function getTheme(fetch, type, key) {
  const theme = await {
    subject: async () => ({
      type: type,
      key: key,
      title: key,
      items: await getItems(fetch, type, key)
    })
  }[type]()

  theme.getRelated = async () => ([
    await getRandomTheme(fetch, `${theme.key}-1`),
    await getRandomTheme(fetch, `${theme.key}-2`)
  ])

  return theme
}

export function getItems(fetch, type, key) {
  const projection = `{
    _id,
    name,
    title,
    imageAssets[] {
      _key,
      asset -> {url}
    }
  }`

  switch (type) {
    case 'subject':
      return fetch(`*["${key}" in subjects && defined(imageAssets)][0..20] ${projection}`)

    default:
      return []
  }
}

export async function getRandomTheme(fetch, seed) {
  const random = seedrandom(seed.toString())
  const randomA = random()
  const randomB = random()

  const types = {
    async subject() {
      const items = await fetch('*[defined(subjects)].subjects')
      const subjects = union(flattenDeep(items))
      return subjects[Math.floor(randomA * subjects.length)]
    }
  }

  const typeKeys = keys(types)
  const type = typeKeys[Math.floor(randomB * typeKeys.length)]
  const key = await types[type]()

  return getTheme(fetch, type, key)
}
