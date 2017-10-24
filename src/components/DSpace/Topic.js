import React from 'react'
import styles from './App.css'

export default class BlimBlam extends React.PureComponent {
  state = {
    height: 400,
    text: 'Lorem ipsum dolor sit amet.'
  }

  constructor(props) {
    super(props)
  }

  handleClick = e => {
  }

  render() {
    return (
      <div style={{ width: '800px' }}>
        <img
          src="projects/blur-building/cloud22.jpg"
          onClick={this.handleClick}
          style={{ height: `${this.state.height}px` }}
        />
        <div className={styles.someText}>{this.state.text}</div>
      </div>
    )
  }
}
