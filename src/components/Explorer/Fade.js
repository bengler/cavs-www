import React from 'react'
import {CSSTransition} from 'react-transition-group'

import './Fade.css'

export default ({children, ...props}) => {
  return (
    <CSSTransition
      {...props}
      timeout={300}
      classNames="fade"
    >
      {children}
    </CSSTransition>
  )
}
