import React from 'react'
import PropTypes from 'prop-types'
import history from '../../history'

function isLeftClickEvent(event) {
  return event.button === 0
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

class Link extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    replace: PropTypes.bool
  };

  static defaultProps = {
    onClick: null,
    replace: false
  };

  handleClick = event => {
    if (this.props.onClick) {
      this.props.onClick(event)
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return
    }

    if (event.defaultPrevented === true) {
      return
    }

    event.preventDefault()

    if (this.props.replace) {
      history.replace(`/cavs${this.props.to}`)
    } else {
      history.push(`/cavs${this.props.to}`)
    }
  };

  render() {
    const {to, children, replace, ...props} = this.props
    return <a href={`/cavs${to}`} {...props} onClick={this.handleClick}>{children}</a>
  }
}

export default Link
