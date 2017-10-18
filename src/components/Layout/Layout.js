import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css'
import s from './Layout.css'
import Header from '../Header'
import Footer from '../Footer'


class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    showHeader: PropTypes.bool,
    inverted: PropTypes.bool
  };

  static defaultProps = {
    showHeader: true
  }

  render() {
    const {showHeader, inverted} = this.props
    return (
      <div className={inverted ? s.inverted : ''}>
        {
          showHeader && (
            <Header />
          )
        }
        <div className={s.content}>
          {this.props.children}
        </div>
        <Footer />
      </div>
    )
  }
}

export default withStyles(normalizeCss, s)(Layout)
