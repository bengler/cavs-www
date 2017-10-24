import React from 'react'
import {packer} from '../packer'
import data from '../data/metadata.json'

export default class PackerTest extends React.Component {
  state = {
    width: 1
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeypress)
  }

  handleKeypress = (event) => {
    if (event.key == 'ArrowLeft') {
      this.setState({width: this.state.width - 1})
    }
    if (event.key == 'ArrowRight') {
      this.setState({width: this.state.width + 1})
    }
  }

  render() {
    const texts = data.filter((item) => {
      return item.id !== 'info' && item.public && item.title.length > 30 && item.id !== 'have-you-ever-been'
    }).map((item) => item.title).reverse()
    texts.unshift('diller scofidio + renfro')
    texts.unshift('discofro sans by stefan ellmer')
    const lines = texts.map((line) => packer(line, this.state.width))
    let key = 10
    const fontSize = '50px'
    return (
      <div style={{fontFamily: 'DSPLUSR', fontSize: fontSize, lineHeight: fontSize, fontWeight: "medium", margin: '30px'}}>
      {lines.map((line) => <div style={{marginBottom: fontSize}} key={key++}>{line}</div>)}
      </div>
    )
  }
}
