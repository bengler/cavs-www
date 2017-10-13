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
  const styles = {
    perspective: {
      transform: `
        matrix3d(${projection.join()})
      `
    },

    view: {
      transform: `
        matrix3d(${view.join()})
      `
    }
  }

  return (
    <div className={s.perspective} style={styles.perspective}>
      <div className={animate ? s.animated : s.camera} style={styles.view}>
        {children}
      </div>
    </div>
  )
}

export default withStyles(s)(MatrixCamera)
