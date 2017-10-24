import React from 'react'
import styles from './App.css'

import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

import {themeShape} from '../../themes'
import Link from '../Link/Link'
import Item from './Item'

export default class ThemeHeading extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    theme: themeShape.isRequired
  }

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
