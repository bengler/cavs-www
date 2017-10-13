import React from 'react'
import PropTypes from 'prop-types'
import Link from './Link'

class LinkResolver extends React.Component {
  static propTypes = {
    item: PropTypes.shape({
      _id: PropTypes.string,
      identifier: PropTypes.string,
    }),
    children: PropTypes.node,
  };

  static defaultProps = {
    item: {},
    children: null,
  }

  render() {
    const {item, children, ...rest} = this.props
    if (item.identifier) {
      return (
        <Link to={`/item/${item.identifier}`} {...rest}>
          {children || item.title || item.name || 'Untitled'}
        </Link>
      )
    }
    if (!item.identifier && item._id) {
      return (
        <Link to={`/group/${item._id}`} {...rest}>
          {children || item.title || item.name || 'Untitled'}
        </Link>
      )
    }
    return (
      <span {...rest}>
        Could not resolve link
        {children || item.title || item.name || 'Untitled'}
      </span>
    )
  }
}

export default LinkResolver
