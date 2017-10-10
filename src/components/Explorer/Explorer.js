import React from 'react'
import {findIndex} from 'lodash'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import {themeShape} from '../../themes'

import Theme from './Theme'
// import Link from '../Link/Link'
import MatrixCamera from '../MatrixCamera/MatrixCamera'
import MatrixElement from '../MatrixElement/MatrixElement'

import s from './Explorer.css'

const nextCache = {}

class Explorer extends React.Component {
  static propTypes = {
    theme: themeShape.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      scroll: 0,
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
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    this.mounted = false
    window.removeEventListener('scroll', this.onScroll)
  }

  onScroll = () => {
    this.setState({
      scroll: window.scrollY
    })
  }

  getNext() {
    const {active} = this.state
    const cacheKey = `${active.theme.type}:${active.theme.key}`
    const cached = nextCache[cacheKey]

    if (cached) {
      this.setState({
        next: cached
      })
    } else {
      active.theme.getRelated().then(themes => {
        if (this.mounted) {
          const next = themes.map(theme => ({
            theme: theme,
            position: [
              active.position[0] + (Math.random() - 0.5) * 400,
              active.position[1] + (Math.random() - 0.5) * 400,
              active.position[2] + (Math.random() - 0.5) * 50
            ],
            rotation: [
              (Math.random() - 0.5) * 2,
              [
                (Math.random() - 0.5),
                (Math.random() - 0.5),
                (Math.random() - 0.5)
              ]
            ]
          }))

          nextCache[cacheKey] = next

          this.setState({
            next
          })
        }
      })
    }
  }

  onNext(themes) {
    this.setState({
      next: themes.map(theme => ({
        position: [Math.random() * 200, Math.random() * 200, Math.random() * 200],
        rotation: [Math.random(), [Math.random(), Math.random(), Math.random()]],
        theme: theme
      }))
    })
  }

  getPlacements(nextActive) {
    // Has previous state
    const {previous, next, active} = this.state
    const nextIndex = findIndex(next, item => item.theme.key === nextActive.key)
    const previousIndex = findIndex(previous, item => item.theme.key === nextActive.key)
    const existsInNext = nextIndex > -1
    const existsInPrevious = previousIndex > -1

    if (existsInNext) {
      return {
        previous: [...previous, active],
        next: [],
        active: next[nextIndex]
      }
    }

    if (existsInPrevious) {
      return {
        previous: previous.slice(0, previousIndex),
        next: [],
        active: previous[previousIndex]
      }
    }

    return {
      previous: [],
      next: [],
      active: {
        position: [0, 0, 0],
        rotation: [0, [0, 0, 0]],
        theme: nextActive
      }
    }
  }

  render() {
    const {previous, next, active, scroll} = this.state

    const items = [
      ...previous,
      active,
      ...next
    ]

    return (
      <MatrixCamera target={active} scroll={scroll}>
        {items.map(item => (
          <MatrixElement key={item.theme.key} position={item.position} rotation={item.rotation}>
            <Theme
              theme={item.theme}
              active={item === active}
            />
          </MatrixElement>
        ))}
      </MatrixCamera>
    )

    // const items = theme.items.map((item, i) => ({
    //   heading: item.title || item.name,
    //
    //   text: 'Text',
    //
    //   styles: {
    //     container: {
    //       width: '80vw',
    //       color: `hsl(${(i * 400) % 360}, 100%, 50%)`,
    //       background: `rgba(255, 0, 0, 0.1)`,
    //       pointerEvents: 'none'
    //     },
    //
    //     heading: {
    //       cursor: 'pointer',
    //       textDecoration: 'underline',
    //       pointerEvents: 'all',
    //       textTransform: 'uppercase',
    //       fontWeight: 'normal',
    //       fontSize: '1em'
    //     }
    //   },
    //
    //   position: [
    //     0,
    //     i * 200,
    //     (Math.sin(i) * 0.5 + 0.5) * -200
    //   ],
    //
    //   rotation: [
    //     Math.sin(i) / 2,
    //     [
    //       1,
    //       i / 2,
    //       0
    //     ]
    //   ]
    // }))

    // return (
    //   <div>
    //     <MatrixCamera target={items[0]} scroll={scroll}>
    //       {items.map((item, i) => (
    //         <MatrixElement
    //           key={i}
    //           position={item.position}
    //           rotation={item.rotation}
    //           style={item.styles.container}
    //           children={(
    //             <div>
    //               <h1 style={item.styles.heading}>
    //                 <Link to={`/explore/${i}`}>
    //                   {item.heading}
    //                 </Link>
    //               </h1>
    //               <p>
    //                 {item.text}
    //               </p>
    //             </div>
    //           )}
    //         />
    //       ))}
    //     </MatrixCamera>
    //   </div>
    // );
  }
}

export default withStyles(s)(Explorer)
