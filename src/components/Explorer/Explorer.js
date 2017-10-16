import React from 'react'
import {filter, last, findIndex, camelCase} from 'lodash'
import mat4 from 'gl-mat4'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import {themeShape} from '../../themes'
import Theme from './Theme'
import Scroller from './Scroller'
import MatrixCamera from './MatrixCamera'
import MatrixElement from './MatrixElement'

import s from './Explorer.css'

const nextCache = {}

const Fade = ({children, ...props}) => {
  return (
    <CSSTransition
      {...props}
      timeout={1000}
      classNames="fade"
    >
      {children}
    </CSSTransition>
  )
}

function transformMatrix(matrix, transforms) {
  const clone = mat4.clone(matrix)

  transforms.forEach(([key, ...params]) => {
    mat4[key](clone, clone, ...params)
  })

  return clone
}

function getCameraMatrix(source, scroll = 0, distance = 400) {
  return transformMatrix(source, [
    ['translate', [0, scroll, distance]],
    ['invert']
  ])
}

class Explorer extends React.Component {
  static propTypes = {
    theme: themeShape.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      view: null,
      animate: false,
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
      animate: false,
      view: getCameraMatrix(
        this.state.active.matrix,
        e.currentTarget.scrollTop
      )
    })
  }

  handleAnimationRest = () => {
    this.setState({
      animate: false
    })
  }

  getNext = () => {
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
          if (this.mounted) {
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
      }, 1000)
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
    const {previous, next, active, view, animate} = this.state

    const items = filter([
      last(previous),
      active,
      ...next
    ])

    return (
      <Scroller onScroll={this.handleScroll} theme={active.theme}>
        <div className={s.spacer} />

        <MatrixCamera view={view} animate={animate}>
          <TransitionGroup>
            {items.map(item => (
              <Fade key={item.theme.key}>
                <MatrixElement key={item.theme.key} matrix={item.matrix}>
                  <Theme
                    theme={item.theme}
                    active={item === active}
                  />
                </MatrixElement>
              </Fade>
            ))}
          </TransitionGroup>
        </MatrixCamera>
      </Scroller>
    )
  }
}

export default withStyles(s)(Explorer)
