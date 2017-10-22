import React from 'react'
import PropTypes from 'prop-types'
import {filter, last, findIndex, camelCase} from 'lodash'
import mat4 from 'gl-mat4'
import {TransitionGroup} from 'react-transition-group'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Blocks from '@sanity/block-content-to-react'

import {themeShape} from '../../themes'
import Theme from './Theme'
import Scroller from './Scroller'
import MatrixCamera from './MatrixCamera'
import MatrixElement from './MatrixElement'
import Fade from './Fade'

import Header from '../Header'

import s from './Explorer.css'

function transformMatrix(matrix, transforms) {
  const clone = mat4.clone(matrix)

  transforms.forEach(([key, ...params]) => {
    mat4[key](clone, clone, ...params)
  })

  return clone
}

function getCameraMatrix(source, distance = 400) {
  return transformMatrix(source, [
    ['translate', [0, 0, distance]],
    ['invert']
  ])
}

class Explorer extends React.Component {
  static propTypes = {
    theme: themeShape.isRequired,
    seed: PropTypes.string.isRequired,
    intro: PropTypes.shape({
      body: PropTypes.array
    }).isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      scroll: mat4.create(),
      items: [{
        theme: props.theme
      }]
    }

    // this.state = {
    //   ...this.state,
    //   ...this.getPlacements(props.theme)
    // }
  }

  componentWillReceiveProps(nextProps) {
    const prevTheme = this.props.theme
    const nextTheme = nextProps.theme
    const themeChange = nextTheme && prevTheme.key !== nextTheme.key

    if (themeChange) {
      this.setState(this.getPlacements(nextProps.theme), () => this.getNext())
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
      scroll: mat4.translate([], mat4.create(), [0, -window.pageYOffset, 0])
    })
  }

  getNext = () => {
    // return
    // const {active} = this.state
    // const cacheKey = `${active.theme.type}:${active.theme.key}`
    // const cached = nextCache[cacheKey]
    //
    // if (cached) {
    //   this.setState({
    //     next: cached
    //   })
    // } else {
    //   setTimeout(() => {
    //     active.theme.getRelated().then(themes => {
    //       if (this.mounted && themes && themes.length > 0) {
    //         const next = themes.map((theme, i) => ({
    //           theme: theme,
    //           matrix: transformMatrix(active.matrix, [
    //             ['translate', [(Math.random() - 0.5) * 500, (i + 1) * 150 + 100, (i + 1) * 30 + 20]],
    //             ['rotateZ', (Math.random() - 0.5) * 1],
    //             ['rotateX', Math.random() * 0.5]
    //           ])
    //         }))
    //
    //         nextCache[cacheKey] = next
    //
    //         this.setState({
    //           next
    //         })
    //       }
    //     })
    //   }, 200)
    // }
  }

  getPlacements(nextTheme) {
    // const {previous, next, active} = this.state
    // const nextIndex = findIndex(next, item => item.theme.key === nextTheme.key)
    // const previousIndex = findIndex(previous, item => item.theme.key === nextTheme.key)
    // const existsInNext = nextIndex > -1
    // const existsInPrevious = previousIndex > -1
    //
    // if (existsInNext) {
    //   const nextActive = next[nextIndex]
    //
    //   return {
    //     animate: true,
    //     previous: [...previous, active],
    //     next: [],
    //     active: nextActive,
    //     view: getCameraMatrix(nextActive.matrix)
    //   }
    // }
    //
    // if (existsInPrevious) {
    //   const nextActive = previous[previousIndex]
    //   return {
    //     animate: true,
    //     previous: previous.slice(0, previousIndex),
    //     next: [],
    //     active: nextActive,
    //     view: getCameraMatrix(nextActive.matrix)
    //   }
    // }
    //
    // const activeMatrix = mat4.create()
    // mat4.rotateZ(activeMatrix, activeMatrix, -45)
    // mat4.translate(activeMatrix, activeMatrix, [-500, 500, -300])
    //
    // const nextActive = {
    //   transforms: [],
    //   theme: nextTheme,
    //   matrix: activeMatrix
    // }
    //
    // return {
    //   previous: [],
    //   next: [],
    //   active: nextActive,
    //   view: getCameraMatrix(activeMatrix, 0, 1000)
    // }
  }

  render() {
    const {intro} = this.props
    const {scroll} = this.state

    const view = getCameraMatrix(mat4.create())

    return (
      <div className={s.root}>
        <div className={s.top} ref='top'>
          <div className={s.header}>
            <Header inverted />
          </div>

          <div className={s.intro}>
            <Blocks blocks={intro.body} />
          </div>
        </div>

        {Array(10).fill().map((v, i) => (
          <div key={`item${i}`} style={{height: 1000, marginBottom: 200, background: 'rgba(0, 0, 255, 0.3)'}} />
        ))}
      </div>
    )
  }
}

export default withStyles(s)(Explorer)
