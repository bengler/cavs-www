import React from 'react'

import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './MatrixElement.css'

const MatrixElement = ({
  matrix,
  children
}) => (
  <div
    className={s.root}
    style={{
      transformOrigin: 'top left',
      transform: `
        translate(0, 0)
        matrix3d(${matrix.join()})
      `
    }}
  >
    {children}
  </div>
)

export default withStyles(s)(MatrixElement)
