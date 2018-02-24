import THREE from 'three-js/three'

export default class Component3D extends THREE.Object3D {
  constructor(component) {
    super()
    this.component = component
    this.element = null
    this.vantages = null
    this.lastWidth = null
    this.lastHeight = null
  }

  get width() {
    if (this.element) {
      this.lastWidth = this.element.offsetWidth
    }
    return this.lastWidth
  }

  get height() {
    if (this.element) {
      this.lastHeight = this.element.offsetHeight
    }
    return this.lastHeight
  }

  setElement(value) {
    this.element = value
  }
}
