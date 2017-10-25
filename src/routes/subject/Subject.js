import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Subject.css'
import ReferenceGrid from '../../components/ReferenceGrid/ReferenceGrid'

class Subject extends React.PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
    })),
    subject: PropTypes.string.isRequired,
  }

  static defaultProps = {
    items: [],
  }

  render() {
    const {items, subject} = this.props
    return (
      <div className={s.container}>
        <h1 className={s.title}>{subject}</h1>
        <ReferenceGrid references={items} />
      </div>
    )
  }
}

export default withStyles(s)(Subject)
