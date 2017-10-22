import React from 'react'
import {filter, last, first} from 'lodash'
import PropTypes from 'prop-types'
import mat4 from 'gl-mat4'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Blocks from '@sanity/block-content-to-react'

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
      scroll: 0,
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
            ['rotateY', 0.5]
          ])
        },

        ...Array(10).fill().map((v, i) => ({
          type: 'intro',
          key: `intro-${i}`,
          rect: null,
          matrix: transformMatrix(mat4.create(), [
            ['rotateY', Math.sin(i) * 1],
            ['rotateX', Math.cos(i * 3) * 0.5],
            ['translate', [Math.sin(i * 3) * 1000, Math.cos(i * 10) * 1000, Math.sin(i * 2) * 500]]
          ])
        }))
      ]
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.updateItems()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = e => {
    this.setState({
      scroll: window.pageYOffset
    })

    this.updateItems()
  }

  updateItems() {
    this.setState({
      items: this.state.items.map(item => ({
        ...item,
        rect: this.refs[item.key].getBoundingClientRect()
      }))
    })
  }

  getPhases() {
    const {items, scroll} = this.state

    const transition = easings.easeInOutQuad(Math.min(1, (scroll + 150) / 500))

    const phases = items.map((item, i) => {
      const multiplier = i === 0 ? 2.5 - transition : transition
      const enter = (1 - Math.min(1, Math.max(0, (item.rect ? item.rect.top : Infinity) / 1000))) * multiplier
      const exit = (1 - Math.min(1, Math.max(0, (item.rect ? item.rect.bottom : Infinity) / 1000))) * multiplier

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
          const phase = phases[i].value
          const opacity = phase

          const style = {
            opacity: phase,
            visibility: opacity ? 'visible' : 'hidden'
          }

          if (phase > 0 && phase < 1) {
            const amount = easings.easeInOutQuint(1 - phase)
            style.filter = `blur(${amount * 10}px)`
          }

          return (
            <div key={item.key} ref={item.key} className={s.item} style={style}>
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
                        <div className={s.theme} />
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default withStyles(s)(Explorer)
