import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Footer.css'

class Footer extends React.PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <span className={s.text}>© MIT Center for Advanced Visual Studies Archive</span>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(Footer)
