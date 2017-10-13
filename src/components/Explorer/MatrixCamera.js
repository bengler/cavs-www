import React from 'react'
import {create, perspective, multiply} from 'gl-mat4'

import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './MatrixCamera.css'

const MatrixCamera = ({
  children,
  projection = perspective([], 0.005, 1, 2, 1),
  view = create(),
  animate = false
}) => {
  const matrix = create()

  multiply(matrix, matrix, projection)
  multiply(matrix, matrix, view)

  const style = {
    transform: `
      translate3d(-50%, -50%, 0)
      matrix3d(${matrix.join()})
    `
  }

  console.log(animate)

  return (
    <div className={animate ? s.cameraAnimated : s.camera} style={style}>
      {children}
    </div>
  )
}

export default withStyles(s)(MatrixCamera)
