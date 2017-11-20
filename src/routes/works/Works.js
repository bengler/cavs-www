import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import PropTypes from 'prop-types'

// import Link from '../../components/Link/Resolver';
import Menu from './Menu.js'
import ReferenceGrid from '../../components/ReferenceGrid/ReferenceGrid'
import s from './Works.css'

class Works extends React.PureComponent {

  static propTypes = {
    works: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        references: PropTypes.number,
      }),
    )
  }

  static defaultProps = {
    works: [],
  }

  render() {
    const {works} = this.props
    return (
      <div className={s.root}>
        <Menu />
        <div className={s.container}>
          <ReferenceGrid references={works} />
        </div>
      </div>
    )
  }
}

export default withStyles(s)(Works)
