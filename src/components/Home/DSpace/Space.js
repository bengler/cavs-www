// Models the collection of all things currently loaded in the scene
import THREE from 'three-js/three'
import DElement from './DElement'
import React from 'react'
import Component3D from './Component3D'

let nextKey = 0

function uniqueKey(collection) {
  nextKey++
  return `${collection}${nextKey}`
}

function epsilon(value) {
  return Math.abs(value) < 1e-10 ? 0 : value
}

function getObjectCSSMatrix(matrix) {
  const elements = matrix.elements
  return (
    'matrix3d(' +
    epsilon(elements[0]) +
    ',' +
    epsilon(elements[1]) +
    ',' +
    epsilon(elements[2]) +
    ',' +
    epsilon(elements[3]) +
    ',' +
    epsilon(-elements[4]) +
    ',' +
    epsilon(-elements[5]) +
    ',' +
    epsilon(-elements[6]) +
    ',' +
    epsilon(-elements[7]) +
    ',' +
    epsilon(elements[8]) +
    ',' +
    epsilon(elements[9]) +
    ',' +
    epsilon(elements[10]) +
    ',' +
    epsilon(elements[11]) +
    ',' +
    epsilon(elements[12]) +
    ',' +
    epsilon(elements[13]) +
    ',' +
    epsilon(elements[14]) +
    ',' +
    epsilon(elements[15]) +
    ')'
  )
}

function nameForObj(obj) {
  return `c${obj.id}`
}

export class Space {
  constructor() {
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0xffffff, 0, 3000)
    this.focusDepth = 600
    this.byName = {}
    this.component3Ds = []
    this.updaters = []
    this.navs = []
    this.version = 0
    this.camera = null
  }

  reindex() {
    this.byName = {}
    this.component3Ds = []
    this.updaters = []
    this.navs = []
    this.scene.traverse(obj => {
      this.byName[nameForObj(obj)] = obj
      if (obj instanceof Component3D) {
        this.component3Ds.push(obj)
      }
      if (obj.update) {
        this.updaters.push(obj)
      }
      if (obj.nav) {
        this.navs.push(obj.nav)
      }
    })
  }

  add(...obj) {
    this.scene.add(...obj)
    this.reindex()
  }

  remove(...obj) {
    this.scene.remove(...obj)
    this.reindex()
  }

  findByName(name) {
    return this.byName[name]
  }

  removeObjectByName(name) {
    this.removeObject(this.byName[name])
  }

  computeStyleForObject(name) {
    const obj = this.byName[name]
    if (obj === undefined) {
      console.warn(`Unable to find 3D object for component ${name}`)
      return {}
    }

    // Compute position relative to camera view
    const pos = obj.getWorldPosition()
    pos.applyMatrix4(this.camera.matrixWorldInverse)
    // if (obj.id == 17 && Math.random() < 0.05) {
    //   console.log(pos.z, pos.y, pos.z)
    // }
    const distance = pos.z // obj.getWorldPosition().distanceTo(this.camera.getWorldPosition())
    const focusPlane = -800
    const focusDepth = this.focusDepth
    const defocusLimit = 1000
    let inFocus = Math.abs(distance - focusPlane) - focusDepth
    if (inFocus < 0) inFocus = 0
    if (inFocus > defocusLimit) inFocus = defocusLimit
    // Defocus limit is now a value going from 0 (totally in focus) to 1 (totally out of focus)
    let defocus = inFocus / defocusLimit
    // if (distance > focusPlane) {
    //   defocus = 0
    // }
    // if (obj.id === 333 && Math.random() < 0.05) {
    //   console.log(distance, inFocus, defocus)
    // }

    const opacity = (1 - defocus).toFixed(1)

    if (obj.element) {
      let result = {
        opacity: opacity,
        // backgroundColor: `rgba(255, 255, ${(defocus * 10).toFixed(0)}, 0.01)`, // Hack to trigger repaint when opacity changes
        position: 'absolute',
        padding: '0',
        transform: 'translate(-50%, -50%)' + getObjectCSSMatrix(obj.matrixWorld)
      }
      return result
    } else {
      return { position: 'absolute', opacity: 0, padding: '0.1px' }
    }
  }

  // Called by DElement with the DOM-element once it is available, called with null
  // when element detaches
  _elementMounted(name, element) {
    const obj = this.byName[name]
    if (obj === undefined) return
    obj.element = element
  }

  // Will load the component into the Space and return a 3D object representing said component
  loadComponent(component) {
    const obj = new Component3D(component)
    this.add(obj)
    return obj
  }

  // updates the scene
  update() {
    this.updaters.forEach(obj => obj.update())
  }

  renderComponents(filter) {
    let components = this.component3Ds.slice()
    if (filter) {
      components = components.filter(filter)
    }
    return components.filter(obj => !obj.hidden).map(obj => {
      const name = nameForObj(obj)
      return (
        <DElement key={name} name={name} space={this}>{obj.component}</DElement>
      )
    })
  }
}
