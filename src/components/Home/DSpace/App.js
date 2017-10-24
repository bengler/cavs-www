import React from 'react'
import styles from './App.css'
import DSpace from './DSpace'
import { Space } from './Space'
import bus from './bus'
// import Feature from './Feature'


export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
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

  render() {
    const {theme, intro} = this.props

    return (
      <div>
        { this.state.mounted &&
          <DSpace theme={theme} intro={intro} space={this.space} />
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

