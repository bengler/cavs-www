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

const nextCache = {}

function transformMatrix(matrix, transforms) {
  const clone = mat4.clone(matrix)

  transforms.forEach(([key, ...params]) => {
    mat4[key](clone, clone, ...params)
  })

  return clone
}

function getCameraMatrix(source, scroll = 0, distance = 400) {
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
    })
  }

  constructor(props) {
    super(props)

    this.state = {
      view: null,
      scroll: mat4.create(),
      previous: [],
      next: [],
      active: null
    }

    this.state = {
      ...this.state,
      ...this.getPlacements(props.theme)
    }
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
    this.mounted = true
    this.getNext()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  handleScroll = e => {
    this.setState({
      scroll: mat4.translate([], mat4.create(), [0, -document.documentElement.scrollTop, 0])
    })
  }

  handleAnimationRest = () => {
    this.setState({
      animate: false
    })
  }

  getNext = () => {
    return
    const {active} = this.state
    const cacheKey = `${active.theme.type}:${active.theme.key}`
    const cached = nextCache[cacheKey]

    if (cached) {
      this.setState({
        next: cached
      })
    } else {
      setTimeout(() => {
        active.theme.getRelated().then(themes => {
          if (this.mounted && themes && themes.length > 0) {
            const next = themes.map((theme, i) => ({
              theme: theme,
              matrix: transformMatrix(active.matrix, [
                ['translate', [(Math.random() - 0.5) * 500, (i + 1) * 150 + 100, (i + 1) * 30 + 20]],
                ['rotateZ', (Math.random() - 0.5) * 1],
                ['rotateX', Math.random() * 0.5]
              ])
            }))

            nextCache[cacheKey] = next

            this.setState({
              next
            })
          }
        })
      }, 200)
    }
  }

  getPlacements(nextTheme) {
    const {previous, next, active} = this.state
    const nextIndex = findIndex(next, item => item.theme.key === nextTheme.key)
    const previousIndex = findIndex(previous, item => item.theme.key === nextTheme.key)
    const existsInNext = nextIndex > -1
    const existsInPrevious = previousIndex > -1

    if (existsInNext) {
      const nextActive = next[nextIndex]

      return {
        animate: true,
        previous: [...previous, active],
        next: [],
        active: nextActive,
        view: getCameraMatrix(nextActive.matrix)
      }
    }

    if (existsInPrevious) {
      const nextActive = previous[previousIndex]
      return {
        animate: true,
        previous: previous.slice(0, previousIndex),
        next: [],
        active: nextActive,
        view: getCameraMatrix(nextActive.matrix)
      }
    }

    const nextActive = {
      transforms: [],
      theme: nextTheme,
      matrix: mat4.create()
    }

    return {
      previous: [],
      next: [],
      active: nextActive,
      view: getCameraMatrix(nextActive.matrix)
    }
  }

  render() {
    const {intro, seed} = this.props
    const {previous, next, active, view, scroll} = this.state

    const items = filter([
      last(previous),
      active,
      ...next
    ])

    return (
      <div className={s.root}>
        <Scroller onScroll={this.handleScroll} theme={active.theme}>
          <MatrixCamera view={view} scroll={scroll}>
            <div className={s.top}>
              <div className={s.header}>
                <Header inverted />
              </div>

              <div className={s.intro}>
                <Blocks blocks={intro.body} />
              </div>
            </div>

            <div style={{position: 'relative'}}>
              <MatrixElement matrix={mat4.rotateY([], mat4.create(), 20)}>
                <Theme theme={active.theme} seed={seed} />
              </MatrixElement>
            </div>

          </MatrixCamera>

          <div className={s.spacer} />
        </Scroller>
      </div>
    )
  }
}

export default withStyles(s)(Explorer)
