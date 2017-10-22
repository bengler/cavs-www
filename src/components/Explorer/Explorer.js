import React from 'react'
import {filter, last} from 'lodash'
import PropTypes from 'prop-types'
import mat4 from 'gl-mat4'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Blocks from '@sanity/block-content-to-react'

import Theme from './Theme'
import easings from './easings'
import {themeShape} from '../../themes'
import Header from '../Header'
import s from './Explorer.css'

function transformMatrix(matrix, transforms) {
  const clone = mat4.clone(matrix)

  transforms.forEach(([key, ...params]) => {
    mat4[key](clone, clone, ...params)
  })

  return clone
}

function lerp(a, b, t) {
  return a * (1 - t) + b * t
}

function lerpArray(a, b, t) {
  return a.map((value, i) => lerp(value, b[i], t))
}

class Explorer extends React.Component {
  static propTypes = {
    theme: themeShape.isRequired,
    intro: PropTypes.shape({
      body: PropTypes.array
    }).isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      scroll: 1,
      height: 1000,
      items: [
        {
          type: 'header',
          key: 'header',
          rect: null,
          matrix: mat4.create()
        }, {
          type: 'intro',
          key: 'intro',
          rect: null,
          matrix: transformMatrix(mat4.create(), [
            ['rotateY', 0.3],
            ['rotateX', -0.2]
          ])
        }, {
          type: 'theme',
          key: 'theme',
          theme: props.theme,
          rect: null,
          matrix: transformMatrix(mat4.create(), [
            ['rotateY', 1],
            ['rotateX', 0.5],
            ['translate', [0, -500, -100]]
          ])
        }
      ]
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.updateDimensions()
    this.props.theme.getRelated().then(this.handleRelated)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = e => {
    this.updateDimensions()
  }

  handleResize = () => {
    this.updateDimensions()
  }

  handleItemRef = (key, ref) => {
    if (!this.itemRefs) {
      this.itemRefs = {}
    }

    this.itemRefs[key] = ref
  }

  handleRelated = related => {
    const next = last(related.filter(theme => theme.items.length > 2))

    this.setState({
      items: [
        ...this.state.items,
        {
          type: 'theme',
          key: next.key,
          theme: next,
          rect: null,
          matrix: transformMatrix(last(this.state.items).matrix, [
            ['rotateY', (Math.random() - 0.5) * 2],
            ['rotateX', Math.random() * 2],
            ['translate', [
              0,
              -200,
              0
            ]]
          ])
        }
      ]
    })
  }

  updateDimensions() {
    this.setState({
      scroll: window.pageYOffset,
      height: window.innerHeight,
      items: this.state.items.map(item => ({
        ...item,
        rect: this.itemRefs[item.key].getBoundingClientRect()
      }))
    })
  }

  getPhases() {
    const {items, scroll, height} = this.state
    const span = Math.min(height, 1000)

    const transition = easings.easeInOutQuad(Math.min(1, (scroll + 300) / 400))

    const phases = items.map((item, i) => {
      const multiplier = i === 0 ? 5 - transition : transition
      const enter = (1 - Math.min(1, Math.max(0, (item.rect ? item.rect.top : Infinity) / span))) * multiplier
      const exit = (1 - Math.min(1, Math.max(0, (item.rect ? item.rect.bottom : Infinity) / span))) * multiplier

      return {
        enter,
        exit,
        value: enter - exit
      }
    })

    return phases
  }

  render() {
    const {intro} = this.props
    const {items} = this.state

    const phases = this.getPhases()
    const perspective = mat4.perspective([], 0.005, 1, 2, 1)
    const currentView = mat4.create()

    const nextPhase = last(filter(phases, phase => phase.value))

    if (nextPhase) {
      const nextIndex = phases.indexOf(nextPhase)
      const prevIndex = nextIndex ? nextIndex - 1 : 0
      const next = items[nextIndex]
      const prev = items[prevIndex]
      const transition = easings.easeInOutCubic(nextPhase.enter)

      lerpArray(prev.matrix, next.matrix, transition).forEach((v, i) => {
        currentView[i] = v
      })
    }

    const view = transformMatrix(currentView, [
      ['translate', [0, 0, 400]],
      ['invert']
    ])

    return (
      <div className={s.root}>
        {items.map((item, i) => {
          const handleItemRef = ref => this.handleItemRef(item.key, ref)
          const phase = phases[i].value
          const opacity = phase

          const style = {
            opacity: phase,
            visibility: opacity ? 'visible' : 'hidden',
            pointerEvents: opacity > 0.5 ? 'auto' : 'none'
          }

          return (
            <div key={item.key} ref={handleItemRef} className={s.item} style={style}>
              <div className={s.perspective} style={{transform: `matrix3d(${perspective.join()})`}}>
                <div className={s.view} style={{transform: `matrix3d(${view.join()})`}}>
                  <div className={s.model} style={{transform: `matrix3d(${item.matrix.join()})`}}>
                    {
                      (item.type === 'header' && (
                        <div className={s.header}>
                          <Header inverted />
                        </div>
                      ))

                      || (item.type === 'intro' && (
                        <div className={s.intro}>
                          <Blocks blocks={intro.body} />
                        </div>
                      ))

                      || (item.type === 'theme' && (
                        <Theme theme={item.theme} />
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className={s.loader} />
      </div>
    )
  }
}

export default withStyles(s)(Explorer)
