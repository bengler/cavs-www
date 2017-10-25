import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Link from '../Link/Link'
import bus from './DSpace/bus'

import s from './Item.css'

class Item extends React.Component {
  static propTypes = {
    item: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {linkLatch: false}
  }

  handleClick = event => {
    bus.dispatch({event: 'clearLinkLatches'})
    this.setState({linkLatch: true})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.item.url !== this.props.item.url || this.state.linkLatch != nextState.linkLatch
  }

  handleMessage = msg => {
    if (msg.event == 'clearLinkLatches') {
      this.setState({linkLatch: false})
    }
  }

  componentDidMount() {
    bus.subscribe(this.handleMessage)
  }

  componentWillUnmount() {
    bus.unsubscribe(this.handleMessage)
  }

  render() {
    const {item} = this.props
    return (
      <div className={s.root}>
        { this.state.linkLatch
          && <Link to={`/item/${item.identifier}`} className={s.link}>
          LINK
          </Link>
        }
        <img
          onClick={this.handleClick}
          src={`${item.url}?w=600`}
          width="600"
          sizes="50vw"
          srcSet={`
            ${item.url}?w=300 300w,
            ${item.url}?w=600 600w
          `}
          style={{display: 'block'}}
        />
      </div>
    )
  }
}

export default withStyles(s)(Item)
