import React from 'react'
import bus from './bus'
import style from '../App.css'

export default class DElement extends React.Component {
  static propTypes = {
    space: React.PropTypes.object,
    children: React.PropTypes.element,
    name: React.PropTypes.string
  }

  state = {
    ready: false
  }

  elementMounted = element => {
    this.props.space._elementMounted(this.props.name, element)
  }

  handleClick = event => {
    bus.dispatch({
      event: 'clickedComponent',
      name: this.props.name
    })
    event.stopPropagation()
  }

  render() {
    return (
      <div
        className={style.dElement}
        ref={this.elementMounted}
        onClick={this.handleClick}
        style={this.props.space.computeStyleForObject(this.props.name)}
      >
        {this.props.children}
      </div>
    )
  }
}
