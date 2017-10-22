import React from 'react'
import PropTypes from 'prop-types'
import {findDOMNode} from 'react-dom'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import {themeShape} from '../../themes'

import s from './Scroller.css'

class Scroller extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    onScroll: PropTypes.func.isRequired,
    theme: themeShape.isRequired
  }

  static defaultProps = {
    children: null
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  componentWillReceiveProps(nextProps) {
    const prevTheme = this.props.theme
    const nextTheme = nextProps.theme
    const themeChange = nextTheme && prevTheme.key !== nextTheme.key

    if (themeChange) {
      this.preventScrollEvent = true
      findDOMNode(this).scrollTop = 0
    }
  }

  handleScroll = e => {
    if (!this.preventScrollEvent) {
      this.props.onScroll(e)
    }

    this.preventScrollEvent = false
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
    // return (
    //   <div className={s.scroller} onScroll={this.handleScroll}>
    //     {this.props.children}
    //   </div>
    // )
  }
}

export default withStyles(s)(Scroller)
