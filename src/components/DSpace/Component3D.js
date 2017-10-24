import THREE from 'three-js/three'

export default class Component3D extends THREE.Object3D {
  constructor(component) {
    super()
    this.component = component
    this.element = null
    this.vantages = null
  }

  get width() {
    if (this.element) {
      return this.element.offsetWidth
    }
    return null
  }

  get height() {
    if (this.element) {
      return this.element.offsetHeight
    }
    return null
  }

  setElement(value) {
    this.element = value
  }
}
