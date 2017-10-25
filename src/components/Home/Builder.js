import React from 'react'
import THREE from 'three-js/three'
import Blocks from '@sanity/block-content-to-react'

import bus from './DSpace/bus'
import Component3D from './DSpace/Component3D'
import Vantage from './DSpace/Vantage'
import {NavPath} from './DSpace/Navigator'

import {Theme} from './layout'
import {getRandomTheme} from '../../themes'

import Header from '../Header'
import ThemeHeading from './ThemeHeading'
import Item from './Item'

import s from './Builder.css'
import {initGraphData, randomTopic} from './graphstres'

import withStyles from 'isomorphic-style-loader/lib/withStyles'


const BlocksWithStyles = withStyles(s)(Blocks)
const HeaderWithStyles = withStyles(s)(Header)

function ensureBasicVantagePoint(obj, distance) {
  // Only set if no current vantage point
  if (obj.vantages) {
    return
  }

  const vantage = new Vantage(obj)
  vantage.position.z = distance || 800
  obj.add(vantage)
  obj.vantages = [vantage]
}

function ensureScrollyNav(obj, distance, height) {
  // Only set if no current vantage point
  if (obj.vantages) {
    return
  }

  const topVantage = new Vantage(obj)
  topVantage.position.z = distance || 800
  topVantage.position.y = height / 2
  const bottomVantage = new Vantage(obj)
  bottomVantage.position.z = distance || 800
  // bottomVantage.rotation.x = 0.2
  bottomVantage.position.y = -height / 2
  obj.add(topVantage, bottomVantage)
  obj.vantages = [topVantage, bottomVantage]
}

class Builder extends THREE.Object3D {

  constructor(space, fetch) {
    super()
    this.space = space
    this.fetch = fetch


    setTimeout(() => {
      this.stub()
      this.addIntro()
      this.initGraph()
    }, 50)
    bus.subscribe(this.handleBusMessage)
    this.components = []
  }

  handleBusMessage = msg => {
    switch (msg.event) {
      case 'scrollBeyond':
        this.addTheme(msg.closest.obj)
        break
      default:
        break
    }
  }

  async initGraph() {
    await initGraphData(this.fetch)
    console.info('**** ',randomTopic())
    console.info('**** ',randomTopic())
    console.info('**** ',randomTopic())
    console.info('**** ',randomTopic())
  }


  async addTheme(after) {
    const layout = await this.generateTheme()
    // layout.position.copy(after.position)
    if (after) {
      after.localToWorld(layout.position)
      after.getWorldQuaternion(layout.quaternion)
      const offset = new THREE.Vector3(0, -after.height / 2 - 400, 0)
      offset.applyQuaternion(layout.quaternion)
      layout.position.add(offset)
      // layout.rotation.y = Math.random() * 0.6 - 0.3
      // layout.rotation.x = Math.random() * 0.6 - 0.3
      after.vantages[0].navs[0].addObjects(layout.objs)
    } else {
      // Position of first theme
      layout.position.z = 400
      layout.position.y = -1500
      layout.rotation.x = -0.3
      layout.rotation.y = 0.3
      this.mainNav.addObjects(layout.objs)
    }

    if (layout.objs[2]) {
      await this.addAssociation(layout.objs[2], Math.random() - 0.5)
    }

    this.space.add(layout)

    this.components.push(layout)

    this.pruneComponents()

    this.space.reindex()
  }

  pruneComponents() {
    while (this.components.length > 10) {
      const toRemove = this.components.shift()
      this.space.remove(toRemove)
    }

  }

  async addAssociation(obj, direction) {
    const layout = await this.generateTheme()
    if (direction > 0) {
      layout.rotation.z = Math.PI / 2
      layout.rotation.x = Math.random() * 0.6 - 0.3
      layout.rotation.y = Math.random() * 0.6 - 0.3
      layout.position.x = 500
    } else {
      layout.rotation.z = -Math.PI / 2
      layout.rotation.x = Math.random() * 0.6 - 0.3
      layout.rotation.y = Math.random() * 0.6 - 0.3
      layout.position.x = -500
    }
    new NavPath(layout.objs, {prev: obj})
    obj.add(layout)
    this.space.reindex()
  }

  async generateTheme() {
    const theme = await getRandomTheme(this.fetch)

    const components = []

    components.push(<ThemeHeading theme={theme} />)

    theme.items.forEach(item => {
      components.push(<Item item={item} />)
    })

    return new Theme({components})
  }

  async addIntro() {
    const intro = await this.fetch('*[_type == "sitePage" && title == "Introduction"][0]{body}')
    this.introComponent = new Component3D(
      <BlocksWithStyles className={s.introduction} blocks={intro.body} />
    )
    ensureScrollyNav(this.introComponent, 800, 800)

    this.space.add(this.introComponent)

    this.mainNav = new NavPath([this.heading, this.introComponent])

    bus.dispatch({
      event: 'resetToComponent',
      name: `c${this.heading.id}`
    })

    this.space.reindex()

    const handle = new THREE.Object3D()
    handle.position.copy(this.introComponent.position)
    this.addTheme(null)
  }

  update() {
    if (this.introComponent && this.heading) {
      this.introComponent.position.y = this.heading.position.y - this.heading.height / 2 - this.introComponent.height / 2
    }

    // if (this.introComponent && this.mainColumn) {
    //   this.mainColumn.position.y = this.introComponent.position.y - this.introComponent.height / 2 - this.mainColumn.height / 2
    // }

  }


  stub() {
    this.heading = new Component3D(
      <div className={s.header}>
        <HeaderWithStyles inverted />
      </div>
    )
    ensureBasicVantagePoint(this.heading)

    this.space.add(this.heading)

    // const barrelComponents = [
    //   'blur-building/Sections.jpg',
    //   'blur-building/cloud22.jpg',
    //   'blur-building/cloud34.jpg',
    //   'blur-building/Nozzle.jpg',
    //   'blur-building/cloud35.jpg',
    //   'blur-building/cloud36.jpg'
    // ].map(src => <img src={'projects/' + src} style={{ width: '800px' }} />)

    // barrelComponents[4] = new Column({
    //   components: [0, 1, 2, 3].map(() => <ThemeHeading />)
    // })

    // const barrel = new Barrel({
    //   components: barrelComponents
    // })

    // components[2] = barrel

    // this.column.rotation.z = Math.PI / 2

    // const aside = new Column({
    //   components: [
    //     <h2>An aside</h2>,
    //   ]
    // })

    // aside.rotation.z = Math.PI / 2
    // aside.position.x = 200
    // // aside.position.x = 10
    // this.column.children[5].add(aside)

    this.space.reindex()
  }
}

export default Builder