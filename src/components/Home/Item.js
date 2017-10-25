import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Link from '../Link/Link'

import s from './Item.css'

class Item extends React.Component {
  static propTypes = {
    item: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {isToggleOn: true}

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }))
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.item._id !== this.props.item._id
  }

  render() {
    const {item} = this.props

    return (
      <div onClick={this.handleClick} className={s.root}>
        { this.state.isToggleOn
          && <Link to={`/item/${item.identifier}`} className={s.link}>
          >>
          </Link>
        }
        <img src={`${item.url}?w=600`} alt="" />
      </div>
    )
  }
}

export default withStyles(s)(Item)
