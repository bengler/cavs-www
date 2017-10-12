import React from 'react'
import {filter, last, findIndex, values} from 'lodash'
import {Motion, spring} from 'react-motion'
import mat4 from 'gl-mat4'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import {themeShape} from '../../themes'
import Theme from './Theme'
import Scroller from './Scroller'
import MatrixCamera from './MatrixCamera'
import MatrixElement from './MatrixElement'

import s from './Explorer.css'

const nextCache = {}

function getViewMatrix(target, scroll = 0) {
  const view = mat4.create()

  mat4.translate(view, view, target.position)
  mat4.rotate(view, view, ...target.rotation)
  mat4.translate(view, view, [0, scroll, 400])
  mat4.invert(view, view)

  return view
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
      view: getViewMatrix(this.state.active, e.currentTarget.scrollTop)
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
            const next = themes.map(theme => ({
              theme: theme,
              position: [
                active.position[0],
                active.position[1] + 150,
                active.position[2]
              ],
              rotation: [
                (Math.random() - 0.5) * 2,
                [
                  Math.random() - 0.5,
                  Math.random() - 0.5,
                  (Math.random() - 0.5) * 2
                ]
              ]
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
    // Has previous state
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
        view: getViewMatrix(nextActive)
      }
    }

    if (existsInPrevious) {
      const nextActive = previous[previousIndex]
      return {
        animate: true,
        previous: previous.slice(0, previousIndex),
        next: [],
        active: nextActive,
        view: getViewMatrix(nextActive)
      }
    }

    const nextActive = {
      position: [0, 0, 0],
      rotation: [0, [0, 0, 0]],
      theme: nextTheme
    }

    return {
      previous: [],
      next: [],
      active: nextActive,
      view: getViewMatrix(nextActive)
    }
  }

  render() {
    const {previous, next, active, view, animate} = this.state

    const items = filter([
      last(previous),
      active,
      ...next
    ])

    const viewPlainArray = [...view]
    const motion = Object.assign({}, animate ? viewPlainArray.map(value => (
      spring(value)
    )) : viewPlainArray)

    return (
      <Motion style={motion} onRest={this.handleAnimationRest}>
        {interpolated => {
          const interpolatedView = values(interpolated)

          return (
            <Scroller onScroll={this.handleScroll} theme={active.theme}>
              <div className={s.spacer} />

              <MatrixCamera view={interpolatedView}>
                {items.map(item => (
                  <MatrixElement key={item.theme.key} position={item.position} rotation={item.rotation}>
                    <Theme
                      theme={item.theme}
                      active={item === active}
                    />
                  </MatrixElement>
                ))}
              </MatrixCamera>
            </Scroller>
          )
        }}
      </Motion>
    )
  }
}

export default withStyles(s)(Explorer)
