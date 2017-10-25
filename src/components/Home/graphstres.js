
import {flatten, uniqWith, isEqual} from 'lodash'

async function fetchData(fetch) {
  return fetch(`
    *[defined(imageAssets)][0..20000]{
      identifier,
      _id,
      _type,

      "url": imageAssets[0].asset->url,
      format,
      "creators": creators[]->{
        _id,
          name
      },
      "partOf": partOf[]->{
        _id,
        name,
        "creators": creators[]->{
          _id,
          name
        }
      },
      subjects,
        "creationTime": date.date.utc
    }
  `)
}

const itemsByCreators = {}
const itemsBySubjects = {}
const itemsByFormats = {}
const itemsByDecade = {}
const itemsByWorks = {}

const selectedCreators = []
const selectedSubjects = []
const selectedFormats = []
const selectedDecades = []
const selectedWorks = []

const creatorNamesByIds = {}
const workNamesByIds = {}

function itemCreators(item) {
  let creatorList = item.creators || []
  if (item.partOf && item.partOf.length > 0) {
    creatorList = creatorList.concat(flatten(item.partOf.map(parent => {
      return parent.creators
    })))
  }
  creatorList = creatorList.filter(Boolean)
  creatorList = uniqWith(creatorList, isEqual)
  return creatorList
}

function canonicalItem(item) {
  return {
    _id: item._id,
    url: item.url,
    identifier: item.identifier
  }
}

function createOrAddInDict(dict, listItem, key) {
  const itemList = dict[key]
  if (itemList) {
    itemList.push(listItem)
    return true
  }
  dict[key] = [listItem]
  return false
}

function categoriseItem(item) {

  const obj = canonicalItem(item)

  itemCreators(item).forEach(creator => {
    if (!createOrAddInDict(itemsByCreators, obj, creator._id)) {
      creatorNamesByIds[creator._id] = creator.name
    }
  })
  if (item.partOf && item.partOf.length > 0) {
    item.partOf.forEach(part => {
      if (part._id) {
        if (!createOrAddInDict(itemsByWorks, obj, part._id)) {
          workNamesByIds[part._id] = part.name
        }
      }
    })
  }
  if (item.format) {
    item.format.forEach(specFormat => {
      createOrAddInDict(itemsByFormats, obj, specFormat)
    })
  }
  if (item.subjects) {
    item.subjects.forEach(specSubject => {
      createOrAddInDict(itemsBySubjects, obj, specSubject)
    })
  }
  if (item.creationTime) {
    const decade = Math.floor(new Date(item.creationTime).getFullYear() / 10) * 10
    createOrAddInDict(itemsByDecade, obj, decade)
  }
}

function pruneDict(dict) {
  Object.keys(dict).forEach(key => {
    if (dict[key].length < 3) {
      delete dict[key]
    }
  })
}

function categoriseData(data) {
  data.forEach(item => {
    categoriseItem(item)
  })
  pruneDict(itemsByCreators)
  pruneDict(itemsBySubjects)
  pruneDict(itemsByFormats)
  pruneDict(itemsByDecade)
  pruneDict(itemsByWorks)
}

function selectRandomFromDict(dict, selectedList) {

  let keys = Object.keys(dict)

  if (selectedList.length > keys.length / 2) {
    selectedList.shift()
  }

  keys = keys.filter(k => {
    return !selectedList.includes(k)
  })

  const randomKey = keys[Math.floor(Math.random() * keys.length)]

  selectedList.push(randomKey)
  return {
    randomKey: randomKey,
    items: dict[randomKey]
  }
}

export async function initGraphData(fetch) {
  const data = await fetchData(fetch)
  categoriseData(data)
}

export function randomTopic() {

  const rnd = Math.random() * 10
  console.info(rnd)
  if (rnd < 2) {
    const {randomKey, items} = selectRandomFromDict(itemsByCreators, selectedCreators)
    return {
      kind: 'creator',
      color: 'rgb(0,255,255)',
      title: creatorNamesByIds[randomKey],
      url: '',
      items: items
    }
  } else if (rnd < 4) {
    const {randomKey, items} = selectRandomFromDict(itemsBySubjects, selectedSubjects)
    return {
      kind: 'subject',
      color: 'rgb(0,255,0)',
      title: randomKey,
      url: '',
      items: items
    }
  } else if (rnd < 6) {
    const {randomKey, items} = selectRandomFromDict(itemsByDecade, selectedDecades)
    return {
      kind: 'decade',
      color: 'rgb(255,0,153)',
      title: randomKey,
      url: '',
      items: items
    }
  } else {
    const {randomKey, items} = selectRandomFromDict(itemsByWorks, selectedWorks)
    return {
      kind: 'work',
      color: 'rgb(153,0,255)',
      title: workNamesByIds[randomKey],
      url: '',
      items: items
    }
  }
}

// const itemsByCreators = {}
// const itemsBySubjects = {}
// const itemsByFormats = {}
// const itemsByDecade = {}
// const itemsByWorks = {}

// const selectedCreators = []
// const selectedSubjects = []
// const selectedFormats = []
// const selectedDecades = []
// const selectedWorks = []