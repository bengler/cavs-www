import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Footer.css'

class Footer extends React.PureComponent {
  static propTypes = {
    inverted: PropTypes.bool
  }

  static defaultProps = {
    inverted: false
  }

  render() {
    return (
      <div className={s.root}>
        <img className={s.actLogo} src="/images/act_black_rgb_RZ.svg" />
        <div className={s.mit}>
          School of Architecture and Planning
          Massachusetts Institute of Technology
          Cambridge, Massachusetts
        </div>
        <div className={s.contact}>
          Contact, About the site, Giving, Facebook, Twitter
        </div>
      </div>
    )
  }
}

export default withStyles(s)(Footer)
