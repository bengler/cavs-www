import THREE from 'three-js/three'

// Represents the vantage points in the scene graph and also keeps track of
// which nav-structures the vantage point takes part in
export default class Vantage extends THREE.Object3D {
  constructor(obj) {
    super()
    this.obj = obj
    this.navs = []
  }
  addNav(nav) {
    this.navs.push(nav)
  }
}
