import React from 'react'
import mat4 from 'gl-mat4'

import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './MatrixCamera.css'

const MatrixCamera = ({
  children,
  projection = mat4.perspective([], 0.005, 1, 2, 1),
  view = mat4.create(),
  animate = false
}) => {
  const matrix = mat4.create()

  mat4.multiply(matrix, matrix, view)

  const pstyle = {
    transform: `
      matrix3d(${projection.join()})
    `
  }

  const style = {
    transform: `
      matrix3d(${matrix.join()})
    `
  }

  return (
    <div className={s.perspective} style={pstyle}>
      <div className={animate ? s.animated : s.camera} style={style}>
        {children}
      </div>
    </div>
  )
}

export default withStyles(s)(MatrixCamera)
