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

//
// function getCameraMatrix(source, distance = 400) {
//   return transformMatrix(source, [
//     ['translate', [0, 0, distance]],
//     ['invert']
//   ])
// }

// function getElementMatrix (transforms) {
//   const projection = mat4.perspective([], 0.005, 1, 2, 1)
//   const view = mat4.create()
// }

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
      items: [
        {
          type: 'header',
          key: 'header',
          rect: {top: 0},
          matrix: mat4.create()
        }, {
          type: 'intro',
          key: 'intro',
          rect: {top: 0},
          matrix: transformMatrix(mat4.create(), [
            ['rotateY', 0.5]
          ])
        },

        ...Array(10).fill().map((v, i) => ({
          type: 'intro',
          key: `intro-${i}`,
          rect: {top: 0},
          matrix: transformMatrix(mat4.create(), [
            ['rotateY', Math.sin(i) * 1],
            ['rotateX', Math.cos(i * 3) * 0.5],
            ['translate', [Math.sin(i * 3) * 500, Math.cos(i * 5) * 500, Math.sin(i) * 500]]
          ])
        }))
      ]
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = e => {
    this.setState({
      items: this.state.items.map(item => ({
        ...item,
        rect: this.refs[item.key].getBoundingClientRect()
      }))
    })
  }

  render() {
    const {intro} = this.props
    const {items} = this.state

    const perspective = mat4.perspective([], 0.005, 1, 2, 1)

    const prev = last(filter(items, item => (
      item.rect.top <= 0
    )))

    const next = first(filter(items, item => (
      item.rect.top > 0
    )))

    const transition = 1 - Math.min(1, Math.max(0, (next ? next.rect.top : Infinity) / 1000))

    const m = transition ? prev.matrix.map((v, i) => lerp(v, next.matrix[i], easings.easeInOutCubic(transition))) : prev.matrix

    const view = transformMatrix(m, [
      ['translate', [0, 0, 400]],
      ['invert']
    ])

    return (
      <div className={s.root}>
        {items.map(item => {
          return (
            <div key={item.key} ref={item.key} className={s.item}>
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
