import BlockContentToHtml from '@sanity/block-content-to-html'
import THREE from 'three-js/three'
import { Column, Barrel } from './layout'
import React from 'react'
import style from './App.css'
import Figure from './components/Figure'
import Vantage from './Vantage'
import { NavStops } from './Navigator'
import { packer } from './packer'

const toHtml = new BlockContentToHtml({
  customTypeHandlers: {},
  blockTypeHandlers: {
    textBlock: {
      normal: node => {
        return `<p class="${style.paragraph}">${node.children}</p>`
      },
      h2: node => {
        return `<div class="big-heading">${node.children}</div>`
      },
      blockquote: node => {
        return `<div class="${style.blockquote}">${node.children}</div>`
      }
    },
    listBlock: {
      number: node => {
        return `<ol class="article-list">${node.children}</ol>`
      },
      bullet: node => {
        return `<ul class="article-list">${node.children}</ul>`
      },
      listItem: node => {
        return `<li class="article-list-item ${node.style}">${node.children}</li>`
      }
    },
    span: node => {
      let result = ''
      if (node.attributes.author) {
        result = `
          <div class="author-bio">
            <img src="${node.attributes.author.image.url}" />
            ${node.attributes.author.name}
          </div>`
      }
      if (node.attributes.link) {
        result += `<a href="${node.attributes.link.href}">${node.children}</a>`
      }
      if (Object.keys(node.attributes).length === 0) {
        result = node.children
      }
      return result
    },
    marks: {
      em: null, // Just igonore 'em' marks.
      code: 'pre' // Render 'code' marks as 'pre' tags
    }
  }
})

// Extracts contiguous blocks and groups them as objects of
// type blockGroup in order to make it easy to create single
// components of series of blocks.
function groupContiguousBlocks(array) {
  const result = []
  let group = null
  array.forEach(item => {
    if (item._type == 'block') {
      if (!group) group = []
      group.push(item)
    } else {
      if (group) {
        result.push({
          _type: 'blockGroup',
          blocks: group
        })
        group = null
      }
      result.push(item)
    }
  })
  if (group) {
    result.push({
      _type: 'blockGroup',
      blocks: group
    })
  }
  return result
}

function componentFromItem(item, _options) {
  const options = _options || {}
  switch (item._type) {
    case 'blockGroup':
      return (
        <div
          className={style.blocks}
          dangerouslySetInnerHTML={{ __html: toHtml.convert(item.blocks) }}
        />
      )
    case 'hero':
      return (
        <div>
          <img className={style.hero} src={item.image.asset.url + '?w=900'} />
          <div className={style.title}>
            {packer('THE BROAD', 32)}
          </div>
        </div>
      )
    case 'figure':
      return <Figure item={item} width={options.width || 1000} />
    case 'slides':
      const barrel = new Barrel({
        components: item.images.map(i => componentFromItem(i, { width: 800 }))
      })
      // barrel.position.x = -150
      return barrel
    case 'torus':
      const geometry = new THREE.TorusKnotGeometry(200, 30, 100, 16)
      const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        fog: true
      })
      const knots = []
      const container = new THREE.Object3D()
      for (let i = 0; i < 5; i++) {
        const knot = new THREE.Mesh(geometry, material)
        knot.position.x = -150
        knots.push(knot)
        container.add(knot)
      }
      container.height = 650
      container.update = () => {
        for (let i = 0; i < knots.length; i++) {
          const knot = knots[i]
          knot.rotation.y += 0.001 + 0.00001 * i
          knot.rotation.x += 0.0013 + 0.0001 * i
        }
      }
      const stops = 8
      const radius = 800
      const targets = []
      for (let i = 1; i < stops; i++) {
        const angle = Math.PI * 2 / stops * i
        const vantage = new Vantage()
        vantage.position.z = radius
        const target = new THREE.Object3D()
        target.vantages = [vantage]
        target.rotation.y = angle
        target.add(vantage)
        container.add(target)
        targets.push(target)
      }
      targets.unshift(container)

      const defaultVantage = new Vantage()
      defaultVantage.position.z = 800
      container.vantages = [defaultVantage]
      container.add(defaultVantage)
      new NavStops(targets, { cyclic: true })
      return container
    case 'aside':
      const feature = new Feature(item.target)
      const aside = new THREE.Object3D()
      aside.add(feature)
      feature.position.x = 750
      feature.position.z = -250
      feature.rotation.z = Math.PI / 2
      aside.height = 0
      return aside
    default:
      console.warn('Unsupported feature block ignored:', item._type)
      console.info('*****', item)
      return (
        <div style={{ width: '1000px' }}>
          <p>Unsupported: {item._type}</p>
          <pre
            dangerouslySetInnerHTML={{ __html: JSON.stringify(item, null, 2) }}
          />
        </div>
      )
  }
}

export default class Feature extends THREE.Object3D {
  constructor(document) {
    super()
    const components = groupContiguousBlocks(document.content).map(item => {
      return componentFromItem(item)
    })
    const column = new Column({ components })
    this.add(column)
    this.vantages = column.vantages
  }
}
