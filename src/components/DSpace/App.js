import React from 'react'
import styles from './App.css'
import DSpace from './DSpace'
import { Space } from './Space'
import bus from './bus'
import sanity from './sanity'
import materializer from './materializer'
// import Feature from './Feature'
import content from './content.json'


export default class App extends React.Component {
  constructor(props) {
    super(props)

    bus.subscribe(msg => {
      if (msg.event === 'focus') {
        this.setState({ focusMode: msg.value })
      }
    })
  }

  state = {
    darkMode: false,
    focusMode: false,
    mounted: false
  }

  componentDidMount() {
    this.setState({mounted: true})
    document.addEventListener('keydown', this.handleKeyPress)
    bus.dispatch({ event: 'setScroll', y: 0 })

  }

  componendWillUnmount() {
    document.removeEventListener(this.handleKeyPress)
    this.subscription.unsubscribe()
  }

  handleKeyPress = event => {
    console.log(event)
    if (!event.metaKey && !event.altKey && !event.ctrlKey) {
      if (event.key === 'ArrowLeft')
        bus.dispatch({ event: 'navigate', to: 'previous' })
      if (event.key === 'ArrowRight')
        bus.dispatch({ event: 'navigate', to: 'next' })
      // if (event.key === 'Escape') history.back()
    }
    bus.dispatch({ event: 'keypress', key: event.key })
  }

  render() {
    return (
      <div>
        { this.state.mounted &&
          <DSpace theme={this.props.theme} intro={this.props.intro} space={this.space} />
        }
      </div>
    )
  }
}

