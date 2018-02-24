import THREE from 'three-js/three'
import bus from './bus'

// The navigational affordances of the site is structured as "navs". This class
// manages the user progression through the navs

export class NavPath {
  constructor(objects, options) {
    this.vantages = []
    this.addObjects(objects)
    if (options) {
      this.prev = options.prev
    }
  }

  addObjects(objects) {
    let newVantages = []
    objects.forEach(o => {
      newVantages = newVantages.concat(o.vantages || [])
    })
    newVantages.forEach(vantage => {
      vantage.addNav(this)
    })
    this.vantages = this.vantages.concat(newVantages)
  }

  getScrollHeight() {
    return 80000
  }

  eachPair(cb) {
    const len = this.vantages.length
    let prev = null
    let current = null
    for (let i = 0; i < len; i++) {
      prev = current
      current = this.vantages[i]
      let distance
      if (prev) {
        const up = new THREE.Vector3()
          .copy(current.up)
          .applyQuaternion(current.getWorldQuaternion())
        if (false && up) {
          // If an up vector is provided, use the dot product so that scrolling always
          // produces the same amount of travel along the vertical direction of the
          // screen
          // TODO: Shouldn't use the up vector of the camera – rather some approximation
          // of the average up vector of the two vantage points
          const travel = prev
            .getWorldPosition()
            .clone()
            .sub(current.getWorldPosition())
          distance = travel.dot(up)
        } else {
          distance = prev
            .getWorldPosition()
            .distanceTo(current.getWorldPosition())
        }
        cb({from: prev, to: current, distance})
      }
    }
  }

  // Computes the progress that would center the camera on the provided vantage
  computeProgressCenteredOn(vantage) {
    let cumulative = 0
    if (vantage === this.vantages[0]) {
      return 0
    }
    let result = null
    this.eachPair(({to, distance}) => {
      cumulative += distance
      if (to === vantage) {
        result = cumulative
      }
    })
    return result
  }

  findPair(progress) {
    const len = this.vantages.length

    if (len === 0) {
      return null
    }
    if (len === 1) {
      return {
        from: this.vantages[0],
        to: this.vantages[0],
        interpolation: 0
      }
    }

    let prev = null
    let current = null
    let distance = null
    let remaining = progress
    for (let i = 0; i < len; i++) {
      prev = current
      current = this.vantages[i]
      if (prev) {
        const up = new THREE.Vector3()
          .copy(current.up)
          .applyQuaternion(current.getWorldQuaternion())
        if (false && up) {
          // If an up vector is provided, use the dot product so that scrolling always
          // produces the same amount of travel along the vertical direction of the
          // screen
          // TODO: Shouldn't use the up vector of the camera – rather some approximation
          // of the average up vector of the two vantage points
          const travel = prev
            .getWorldPosition()
            .clone()
            .sub(current.getWorldPosition())
          distance = travel.dot(up)
        } else {
          distance = prev
            .getWorldPosition()
            .distanceTo(current.getWorldPosition())
        }
        // distance = prev.parent.height / 2 + current.parent.height / 2
        if (distance > remaining || i === len - 1) {
          break
        }
        remaining -= distance
      }
    }
    return {
      from: prev,
      to: current,
      t: remaining / distance
    }
  }
  // Sets rotation and position of the target Object3D to reflect the given progress
  applyVantage(target, progress) {
    const pair = this.findPair(progress)
    const quat = pair.from
      .getWorldQuaternion()
      .slerp(pair.to.getWorldQuaternion(), pair.t)
    const pos = pair.from
      .getWorldPosition()
      .lerp(pair.to.getWorldPosition(), pair.t)
    const closest = pair.t < 0.5 ? pair.from : pair.to
    target.position.copy(pos)
    target.setRotationFromQuaternion(quat)
    target.updateMatrix()
    return {closest, pair}
  }
}

// Represents an ordered sequence of camera stops as in a slide show
export class NavStops {
  constructor(objects, options) {
    // Is this a ring of stops?
    this.cyclic = !!options.cyclic
    // Will only use the first vantage point for each object
    this.vantages = objects.map(obj => obj.vantages[0])
    this.vantages.forEach(v => v.addNav(this))
    this.names = objects.map(obj => `c${obj.id}`)
  }

  getScrollHeight() {
    return 0
  }

  vantageForName(name) {
    const index = this.names.indexOf(name)
    if (index !== -1) {
      return {
        index,
        vantage: this.vantages[index]
      }
    }
  }

  getNextPrev(vantage) {
    const index = this.vantages.indexOf(vantage)
    // console.log(this.vantages.map(v => v.id), vantage.id)

    if (index === -1) {
      return null
    }
    // TODO: Implement non-cyclic stops
    const prevIndex = index === 0 ? this.vantages.length - 1 : index - 1
    const nextIndex = index === this.vantages.length - 1 ? 0 : index + 1
    // console.log({ prevIndex, nextIndex })
    return {
      next: this.vantages[nextIndex],
      previous: this.vantages[prevIndex]
    }
  }
}

export class Navigator {
  constructor(space, camera) {
    this.space = space
    this.camera = camera
    this.scrollNav = null
    this.scrollTop = 0
    this.lastScrollY = 0
    // Set to non zero to disable scroll controller for a number of frames
    this.delayScrollControl = 0
    // True while handling pop-state
    this.popping = false
    bus.subscribe(this.handleMsg)
    window.addEventListener('popstate', this.handlePopState)
  }

  vantageObjectForPath(pathname) {
    if (pathname.length < 2) {
      return null
    }
    const name = window.location.pathname.slice(1)
    const obj = this.space.findByName(name)
    if (obj && obj.vantages) {
      return obj.vantages[0]
    }
    return null
  }

  handlePopState = event => {
    const vantage = this.vantageObjectForPath(window.location.pathname)
    if (vantage) {
      this.popping = true
      this.flyTo(vantage)
      this.popping = false
    }
  }

  // Returns the current nav considered being "in control"
  currentMainNav() {
    if (this.scrollNav) {
      return this.scrollNav
    }
    return this.stopsNav
  }

  handleMsg = msg => {
    if (msg.event === 'navigate') {
      // Handles navigation to next/previous based on next/prev commands
      if (this.stopsNav) {
        this.navigateStop(msg.to)
      }
    }
    if (msg.event === 'clickedComponent') {
      // console.log('CLICKA')
      // Handle navigating to clicked components
      const obj = this.space.findByName(msg.name)
      // console.log('clicked', obj)
      // TODO: Maybe not all objects takes clicks like this?
      if (obj && obj.vantages) {
        this.flyTo(obj.vantages[0])
      }
    }
    if (msg.event === 'resetToComponent') {
      const obj = this.space.findByName(msg.name)
      // console.log('Obj:', obj)
      if (obj && obj.vantages) {
        this.resetTo(obj.vantages[0])
      }
    }
    if (msg.event === 'setRawNavMode') {
      this.focus = null
      this.resolveNavs()
      // console.log('Navigator in raw mode')
      this.rawMode = msg
    }
  }

  getScrollHeight() {
    if (this.rawMode) {
      return this.rawMode.scrollHeight
    }
    if (this.scrollNav) {
      return this.scrollNav.getScrollHeight()
    }
    return 0
  }

  resetTo(vantage) {
    this.rawMode = null
    this.setFocus(vantage)
    this.camera.position.copy(vantage.getWorldPosition())
    this.camera.setRotationFromQuaternion(vantage.getWorldQuaternion())
    this.scrollLock = true
  }

  setFocus(vantage, flyTo) {
    const oldMainNav = this.currentMainNav()
    const oldScrollNav = this.scrollNav
    this.focus = vantage
    this.resolveNavs()
    if (!this.popping) {
      // Don't mess with history when popping
      // console.log(
      //   oldMainNav,
      //   this.currentMainNav(),
      //   oldMainNav !== this.currentMainNav()
      // )
      if (oldMainNav !== this.currentMainNav()) {
        // console.log('pushState')
        // history.pushState({}, 'DS+R', `c${this.focus.parent.id}`)
      } else {
        // console.log('replaceState')
        // history.replaceState({}, 'DS+R', `c${this.focus.parent.id}`)
      }
    }
    if (this.scrollNav && (flyTo || this.scrollNav != oldScrollNav)) {
      const top = this.scrollNav.computeProgressCenteredOn(this.focus)
      bus.dispatch({
        event: 'setScroll',
        y: top
      })
      // Delay scroll controller a beat to allow scroll box and scroll Y to catch up
      this.delayScrollControl = 20
    }
    // console.log('focus', `c${this.focus.parent.id}`)
  }

  flyTo(vantage) {
    this.setFocus(vantage, true)
    this.scrollLock = false
    this.rawMode = null
  }

  update() {
    const delta = window.scrollY - this.lastScrollY
    if (!this.focus) {
      return
    }
    const target = new THREE.Object3D()
    if (this.delayScrollControl > 0) {
      this.delayScrollControl--
    }
    if (this.scrollNav && this.delayScrollControl <= 0) {
      const report = this.scrollNav.applyVantage(target, window.scrollY || 0)
      if (report.closest != this.focus) {
        this.setFocus(report.closest)
      }

      if (window.scrollY == 0 && delta < 0 && this.scrollNav.prev) {
        bus.dispatch({
          event: 'clickedComponent',
          name: this.scrollNav.prev
        })
      }

      if (report.pair.t < 1) {
        this.scrollBeyondFired = false
      }
      if (report.pair.t > 1 && !this.scrollBeyondFired) {
        this.scrollBeyondFired = true
        bus.dispatch({
          event: 'scrollBeyond',
          closest: report.closest
        })
      }
    } else {
      target.position.copy(this.focus.getWorldPosition())
      target.setRotationFromQuaternion(this.focus.getWorldQuaternion())
    }
    const distance = this.camera.position.distanceTo(target.position)
    if (
      this.scrollLock
      || distance < 0.05
      || Number.isNaN(this.camera.position.x)
    ) {
      this.camera.position.copy(target.position)
      this.camera.setRotationFromQuaternion(target.quaternion)
      if (!this.scrollLock) {
        //console.log('Scroll lock')
      }
      this.scrollLock = true
    } else {
      this.camera.position.copy(
        this.camera.position.lerp(target.position, 0.15)
      )
      this.camera.setRotationFromQuaternion(
        this.camera.quaternion.slerp(target.quaternion, 0.15)
      )
    }
    this.lastScrollY = window.scrollY
  }

  resolveNavs() {
    if (!this.focus) {
      this.scrollNav = null
      this.stopsNav = null
      return
    }
    this.scrollNav = this.focus.navs.find(nav => nav.getScrollHeight() > 0)
    this.stopsNav = this.focus.navs.find(nav => !!nav.getNextPrev)
    //console.log('scrollNav=', this.scrollNav, 'stopsNav=', this.stopsNav)
  }

  navigateStop(destination) {
    if (!this.stopsNav) {
      return
    }
    const nextPrev = this.stopsNav.getNextPrev(this.focus)
    //console.log(nextPrev)
    this.flyTo(nextPrev[destination])
  }
}
