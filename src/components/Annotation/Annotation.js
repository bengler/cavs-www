import React from 'react'
import PropTypes from 'prop-types'
// import Link from '../Link/Link'
import s from './Annotation.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

class Annotation extends React.Component {
  static propTypes = {
    annotation: PropTypes.shape({
      title: PropTypes.string,
      body: PropTypes.body
    }),
  };

  render() {
    const {annotation} = this.props
    const {title, body} = annotation
    return (
      <div className={s.root}>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    )
  }
}

export default withStyles(s)(Annotation)
