import React from 'react'
import mat4 from 'gl-mat4'

import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './MatrixCamera.css'

const MatrixCamera = ({
  children,
  projection = mat4.perspective([], 0.005, 1, 2, 1),
  view = mat4.create(),
  scroll = 0,
  animate = false
}) => {
  return (
    <div className={s.projection} style={{transform: `matrix3d(${projection.join()})`}}>
      <div className={s.view} style={{transform: `matrix3d(${view.join()})`}}>
        <div className={s.scroll} style={{transform: `matrix3d(${scroll.join()})`}}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default withStyles(s)(MatrixCamera)
