import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 'e5dtp8wy',
  dataset: 'production',
  useCdn: true
})

function createFetch() {
  return (query, params) => client.fetch(query, params)
}

export default createFetch
