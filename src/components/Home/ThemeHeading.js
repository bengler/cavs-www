import React from 'react'

import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import s from './ThemeHeading.css'

import {themeShape} from '../../themes'
import Link from '../Link/Link'
import Item from './Item'


class ThemeHeading extends React.PureComponent {
  static propTypes = {
    theme: themeShape.isRequired
  }

  state = {
    height: 400,
    text: 'Lorem ipsum dolor sit amet.'
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {theme} = this.props
    const {kind, key, title} = theme

    const titleStyle = {
      borderColor: theme.color,
      color: theme.color
    }

    return (
      <section className={s.root}>
        <h2 className={s.heading}>
          <span style={titleStyle} className={s.title}>
            {title}
          </span>
        </h2>
      </section>
    )
  }
}

export default withStyles(s)(ThemeHeading)