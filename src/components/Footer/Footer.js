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
          <a href="http://act.mit.edu/about-act/contact-and-locations/" rel="noopener noreferrer" target="_blank">
            Contact{', '}
          </a>
          <a href="http://act.mit.edu/about-act/about-the-site/" rel="noopener noreferrer" target="_blank">
            About&nbsp;the&nbsp;site
          </a>{', '}
          <a href="http://act.mit.edu/about-act/giving/" rel="noopener noreferrer" target="_blank">
            Giving
          </a>{', '}
          <a href="https://www.facebook.com/pages/MIT-Program-in-Art-Cultureand-Technology/270059363032046" rel="noopener noreferrer" target="_blank">
          Facebook
          </a>{', '}
          <a href="http://twitter.com/actmit" rel="noopener noreferrer" target="_blank">
            Twitter
          </a>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(Footer)
