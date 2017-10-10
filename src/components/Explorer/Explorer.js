import React from 'react'
import {findIndex} from 'lodash'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import {themeShape} from '../../themes'

import Theme from './Theme'
// import Link from '../Link/Link'
// import MatrixCamera from '../MatrixCamera/MatrixCamera'
// import MatrixElement from '../MatrixElement/MatrixElement'

import s from './Explorer.css'

const nextCache = {}

class Explorer extends React.Component {
  static propTypes = {
    theme: themeShape.isRequired
  }

  constructor(props) {
    super(props)

    const placements = this.getPlacements(props.theme)

    this.state = {
      scroll: 0,
      placements
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevTheme = this.props.theme
    const nextTheme = nextProps.theme
    const themeChange = nextTheme && prevTheme.key !== nextTheme.key

    if (themeChange) {
      const placements = this.getPlacements(nextProps.theme)

      this.setState({
        placements
      }, () => {
        this.getNext()
      })
    }
  }

  componentDidMount() {
    this.mounted = true
    this.getNext()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  getNext() {
    const {active} = this.state.placements
    const cacheKey = `${active.theme.type}:${active.theme.key}`
    const cached = nextCache[cacheKey]

    if (cached) {
      this.onNext(cached)
    } else {
      active.theme.getRelated().then(themes => {
        if (this.mounted) {
          nextCache[cacheKey] = themes
          this.onNext(themes)
        }
      })
    }
  }

  onNext(themes) {
    this.setState({
      placements: {
        ...this.state.placements,
        next: themes.map(theme => ({
          position: [0, 0, 0],
          rotation: [0, [0, 0, 0]],
          theme: theme
        }))
      }
    })
  }

  getPlacements(active) {
    if (!this.state) {
      // Initial placements
      return {
        previous: [],
        next: [],
        active: {
          position: [0, 0, 0],
          rotation: [0, [0, 0, 0]],
          theme: active
        }
      }
    }

    // Has previous state
    const {previous, next} = this.state.placements
    const prevActive = this.state.placements.active
    const nextIndex = findIndex(next, item => item.theme.key === active.key)
    const previousIndex = findIndex(previous, item => item.theme.key === active.key)

    if (nextIndex > -1) {
      // Changed to one of the next
      return {
        previous: [...previous, prevActive],
        next: [],
        active: next[nextIndex]
      }
    } else if (previousIndex > -1) {
      // Changed to one of the previous
      return {
        previous: previous.slice(0, previousIndex),
        next: [],
        active: previous[previousIndex]
      }
    }

    // Changed to something different
    return {
      previous: [],
      next: [],
      active: {
        position: [0, 0, 0],
        rotation: [0, [0, 0, 0]],
        theme: active
      }
    }
  }

  render() {
    const {placements} = this.state

    const items = [
      ...placements.previous,
      placements.active,
      ...placements.next
    ].map(item => (
      <Theme
        key={item.theme.key}
        theme={item.theme}
        active={item === placements.active}
      />
    ))

    return (
      <div>
        {items}
      </div>
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
