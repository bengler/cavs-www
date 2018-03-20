import React from 'react'
import DSpace from './DSpace/DSpace'
import {Space} from './DSpace/Space'
import bus from './DSpace/bus'

import Builder from './Builder'

// import Feature from './Feature'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.space = new Space()
    this.builder = new Builder(this.space, this.props.fetch)
    this.space.add(this.builder)
  }

  state = {
    mounted: false
  }

  componentDidMount() {
    this.setState({mounted: true})
    // document.addEventListener('keydown', this.handleKeyPress)
    bus.dispatch({event: 'setScroll', y: 0})
  }


  componentWillUnmount() {
    // stop when unmounting
    // document.removeEventListener(this.handleKeyPress)
    // this.subscription.unsubscribe()
  }

  render() {
    return (
      <div>
        { this.state.mounted
        && <DSpace space={this.space} />
        }
      </div>
    )
  }
}


  // handleKeyPress = event => {
  //   console.log(event)
  //   if (!event.metaKey && !event.altKey && !event.ctrlKey) {
  //     if (event.key === 'ArrowLeft')
  //       bus.dispatch({ event: 'navigate', to: 'previous' })
  //     if (event.key === 'ArrowRight')
  //       bus.dispatch({ event: 'navigate', to: 'next' })
  //     // if (event.key === 'Escape') history.back()
  //   }
  //   bus.dispatch({ event: 'keypress', key: event.key })
  // }

