import React from 'react'
import THREE from 'three-js/three'
import Blocks from '@sanity/block-content-to-react'

import s from './AppNew.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import bus from './bus'
import { Space } from './Space'
import { Column, Barrel } from '../layout'
import { Navigator } from './Navigator'

import Header from '../../Header'
import ThemeHeading from '../ThemeHeading'
import Item from '../Item'



class DSpace extends React.PureComponent {
  static childContextTypes = {
    space: React.PropTypes.instanceOf(Space)
  }

  static propTypes = {
    space: React.PropTypes.object
  }

  constructor(props) {
    super(props)

    this.nextScrollY = null

    this.camera = null
    this.space = this.props.space || new Space()
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      1,
      10000
    )
    this.space.camera = this.camera
    this.camera.position.z = -200
    this.camera.position.y = 0
    this.renderer3D = new THREE.WebGLRenderer()
    this.renderer3D.setSize(this.width * 2, this.height * 2)

    if (true) {
      const components = [0, 1, 2, 3, 4, 5, 6].map(() => <ThemeHeading />)
      const barrelComponents = [
        'blur-building/Sections.jpg',
        'blur-building/cloud22.jpg',
        'blur-building/cloud34.jpg',
        'blur-building/Nozzle.jpg',
        'blur-building/cloud35.jpg',
        'blur-building/cloud36.jpg'
      ].map(src => <img src={'projects/' + src} style={{ width: '800px' }} />)

      barrelComponents[4] = new Column({
        components: [0, 1, 2, 3].map(() => <ThemeHeading />)
      })

      const barrel = new Barrel({
        components: barrelComponents
      })

      components[0] = (
        <div className={s.header}>
          <Header inverted />
        </div>
      )

      components[2] = barrel

      this.column = new Column({
        components
      })
      // this.column.rotation.z = Math.PI / 2
      this.space.add(this.column)

      const aside = new Column({
        components: [
          <h2>An aside</h2>,
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et nibh vitae metus dictum volutpat. Donec sollicitudin facilisis faucibus. Ut dolor orci, efficitur in elementum nec, tristique sit amet quam. Etiam mattis sit amet ligula et mattis. Aliquam eros mi, sodales ut purus ut, pretium faucibus velit. Aenean lobortis, purus at consequat accumsan, augue ipsum lobortis diam, eget semper erat ligula non nibh. Fusce nec consectetur mauris.</p>,
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et nibh vitae metus dictum volutpat. Donec sollicitudin facilisis faucibus. Ut dolor orci, efficitur in elementum nec, tristique sit amet quam. Etiam mattis sit amet ligula et mattis. Aliquam eros mi, sodales ut purus ut, pretium faucibus velit. Aenean lobortis, purus at consequat accumsan, augue ipsum lobortis diam, eget semper erat ligula non nibh. Fusce nec consectetur mauris.</p>,
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et nibh vitae metus dictum volutpat. Donec sollicitudin facilisis faucibus. Ut dolor orci, efficitur in elementum nec, tristique sit amet quam. Etiam mattis sit amet ligula et mattis. Aliquam eros mi, sodales ut purus ut, pretium faucibus velit. Aenean lobortis, purus at consequat accumsan, augue ipsum lobortis diam, eget semper erat ligula non nibh. Fusce nec consectetur mauris.</p>,
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et nibh vitae metus dictum volutpat. Donec sollicitudin facilisis faucibus. Ut dolor orci, efficitur in elementum nec, tristique sit amet quam. Etiam mattis sit amet ligula et mattis. Aliquam eros mi, sodales ut purus ut, pretium faucibus velit. Aenean lobortis, purus at consequat accumsan, augue ipsum lobortis diam, eget semper erat ligula non nibh. Fusce nec consectetur mauris.</p>,
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et nibh vitae metus dictum volutpat. Donec sollicitudin facilisis faucibus. Ut dolor orci, efficitur in elementum nec, tristique sit amet quam. Etiam mattis sit amet ligula et mattis. Aliquam eros mi, sodales ut purus ut, pretium faucibus velit. Aenean lobortis, purus at consequat accumsan, augue ipsum lobortis diam, eget semper erat ligula non nibh. Fusce nec consectetur mauris.</p>,
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et nibh vitae metus dictum volutpat. Donec sollicitudin facilisis faucibus. Ut dolor orci, efficitur in elementum nec, tristique sit amet quam. Etiam mattis sit amet ligula et mattis. Aliquam eros mi, sodales ut purus ut, pretium faucibus velit. Aenean lobortis, purus at consequat accumsan, augue ipsum lobortis diam, eget semper erat ligula non nibh. Fusce nec consectetur mauris.</p>,
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et nibh vitae metus dictum volutpat. Donec sollicitudin facilisis faucibus. Ut dolor orci, efficitur in elementum nec, tristique sit amet quam. Etiam mattis sit amet ligula et mattis. Aliquam eros mi, sodales ut purus ut, pretium faucibus velit. Aenean lobortis, purus at consequat accumsan, augue ipsum lobortis diam, eget semper erat ligula non nibh. Fusce nec consectetur mauris.</p>,
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et nibh vitae metus dictum volutpat. Donec sollicitudin facilisis faucibus. Ut dolor orci, efficitur in elementum nec, tristique sit amet quam. Etiam mattis sit amet ligula et mattis. Aliquam eros mi, sodales ut purus ut, pretium faucibus velit. Aenean lobortis, purus at consequat accumsan, augue ipsum lobortis diam, eget semper erat ligula non nibh. Fusce nec consectetur mauris.</p>
        ]
      })

      aside.rotation.z = Math.PI / 2
      aside.position.x = 200
      // aside.position.x = 10
      this.column.children[5].add(aside)
      this.space.reindex()
    }

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading
    })

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    for (let i = 0; i < 300; i++) {
      const cube = new THREE.Mesh(geometry, material)
      cube.position.x = (Math.random() - 0.5) * 2000
      cube.position.y = 1500 - Math.random() * 3000
      cube.position.z = -800 - Math.random() * 800
      cube.rotation.x = Math.random() * Math.PI
      cube.rotation.y = Math.random() * Math.PI
      cube.rotation.z = Math.random() * Math.PI
      cube.scale.x = Math.random() * 300
      cube.scale.y = Math.random() * 300
      cube.scale.z = Math.random() * 300
      // this.space.scene.add( cube )
    }
    const light = new THREE.DirectionalLight(0xffffff, 0.5)
    this.space.scene.add(light)
    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    this.space.scene.add(ambient)

    this.navigator = new Navigator(this.space, this.camera)
    this.space.navigator = this.navigator

    // Navigate to start element
    var initialVantage = this.navigator.vantageObjectForPath(window.location.pathname)
    if (!initialVantage) {
      initialVantage = this.column.nav.vantages[0]
    }
    initialVantage = this.column.nav.vantages[0]
    this.navigator.resetTo(initialVantage)

    this.handleResize()
    this.start = new Date()

    bus.subscribe(this.handleBusMessage)
  }

  state = { elapsed: 0 }

  getChildContext() {
    return {
      space: this.space
    }
  }

  buildIntro(intro) {
    const introColumn = new Column({
      components: [
        <Blocks blocks={intro.body} />
      ]
    })
    this.column.children[1] = introColumn
    this.space.reindex()
  }


  componentWillReceiveProps(nextProps) {
    if(nextProps.intro) {
      this.buildIntro(nextProps.intro)
    }
    if(nextProps.intro) {
      this.buildIntro(nextProps.intro)
    }
  }

  componentDidMount() {
    this.startAnimation()
    window.addEventListener('resize', this.handleResize)

    if(this.props.intro) {
      this.buildIntro(this.props.intro)
    }
  }

  componentWillUnmount() {
    this.stopAnimation()
    window.removeEventListener('resize', this.handleResize)
  }

  startAnimation() {
    this.animationShouldRun = true
    const animate = () => {
      const elapsed = new Date() - this.start
      if (this.animationShouldRun) {
        global.requestAnimationFrame(animate)
      }
      this.space.update()
      this.navigator.update()
      this.setState({ elapsed })
    }
    animate()
  }

  stopAnimation() {
    this.animationShouldRun = false
  }

  handleResize = () => {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.camera.aspect = this.width / this.height
    const nominalDistance = 800
    const nominalWidth = 1200
    this.camera.fov =
      2 *
      Math.atan(nominalWidth / this.camera.aspect / (2 * nominalDistance)) *
      (180 / Math.PI)
    this.camera.updateProjectionMatrix()
    this.renderer3D.setSize(this.width, this.height)
    this.renderer3D.setPixelRatio(2)
  }

  setRendererCanvas = element => {
    console.log('Update renderer canvas', element)
    this.renderer3D = new THREE.WebGLRenderer({ canvas: element })
    this.renderer3D.setClearColor(new THREE.Color(0x000000))
    this.handleResize()
  }

  componentDidUpdate() {
    this.renderer3D.render(this.space.scene, this.camera)
    if (this.nextScrollY !== null) {
      console.log(
        'scrolling to ',
        this.nextScrollY,
        'scroll height',
        document.body.scrollHeight
      )
      window.scrollTo(0, this.nextScrollY)
      this.nextScrollY = null
    }
  }

  handleBackdropClick = event => {
    // Potentially handle clicks for 3D objects using ray-casting, but for now consider this
    // a click outside
    bus.dispatch({
      event: 'clickOutside'
    })
  }

  handleBusMessage = msg => {
    switch (msg.event) {
      case 'setScroll':
        this.nextScrollY = msg.y
        break
      default:
        break
    }
  }

  render() {
    const fov =
      0.5 /
      Math.tan(THREE.Math.degToRad(this.camera.getEffectiveFOV() * 0.5)) *
      this.height
    this.space.scene.updateMatrixWorld()
    this.camera.updateMatrixWorld()
    this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld)
    const cameraCSSTransform =
      `translateZ(${fov.toFixed(3)}px)` +
      getCameraCSSMatrix(this.camera.matrixWorldInverse) +
      `translate(${this.width / 2}px,${this.height / 2}px)`
    return (
      <div>
        <div style={{ position: 'fixed' }} onClick={this.handleBackdropClick}>
          <div
            style={{
              position: 'fixed',
              top: '0',
              perspective: `${fov}px`
            }}
          >
            <div
              style={{
                transform: cameraCSSTransform,
                transformStyle: 'preserve-3d',
                width: `${this.width}px`,
                height: `${this.height}px`
              }}
            >
              {this.space.renderComponents()}
            </div>
          </div>
          <canvas ref={this.setRendererCanvas} />
        </div>
        <div style={{ height: `${this.navigator.getScrollHeight()}px` }} />
      </div>
    )
  }
}
export default withStyles(s)(DSpace)

function epsilon(value) {
  return Math.abs(value) < 1e-10 ? 0 : value
}

function getCameraCSSMatrix(matrix) {
  const elements = matrix.elements

  return (
    'matrix3d(' +
    epsilon(elements[0]) +
    ',' +
    epsilon(-elements[1]) +
    ',' +
    epsilon(elements[2]) +
    ',' +
    epsilon(elements[3]) +
    ',' +
    epsilon(elements[4]) +
    ',' +
    epsilon(-elements[5]) +
    ',' +
    epsilon(elements[6]) +
    ',' +
    epsilon(elements[7]) +
    ',' +
    epsilon(elements[8]) +
    ',' +
    epsilon(-elements[9]) +
    ',' +
    epsilon(elements[10]) +
    ',' +
    epsilon(elements[11]) +
    ',' +
    epsilon(elements[12]) +
    ',' +
    epsilon(-elements[13]) +
    ',' +
    epsilon(elements[14]) +
    ',' +
    epsilon(elements[15]) +
    ')'
  )
}
