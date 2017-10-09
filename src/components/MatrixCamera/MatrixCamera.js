import React from 'react'
import { Motion, spring } from 'react-motion'
import { create, perspective, multiply, rotate, translate, invert } from 'gl-mat4'

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import css from './MatrixCamera.css';

const MatrixCamera = ({
  children,
  target,
  scroll = 0
}) => {
  const motion = Object.assign({}, [
    ...target.position,
    ...target.rotation[1],
    target.rotation[0]
  ].map(value => (
    spring(value, {
      stiffness: 50,
      damping: 20
    })
  )))

  return (
    <div>
      <div className={css.scroller} />
      <div className={css.view}>
        <Motion style={motion}>
          {interpolated => {
            const [ x, y, z, ...rotation ] = Object.values(interpolated)
            const [ axisX, axisY, axisZ, amount ] = rotation
            const view = create()

            translate(view, view, [x, y, z])
            rotate(view, view, amount, [axisX, axisY, axisZ])
            translate(view, view, [0, scroll, 400])
            invert(view, view)

            const matrix = create()
            const projection = perspective([], 0.005, 1, 2, 1)

            multiply(matrix, matrix, projection)
            multiply(matrix, matrix, view)

            return (
              <div
                children={children}
                className={css.camera}
                style={{
                  transform: `
                    translate3d(-50%, -50%, 0)
                    matrix3d(${matrix.join()})
                  `
                }}
              />
            )
          }}
        </Motion>
      </div>
    </div>
  )
}

export default withStyles(css)(MatrixCamera)
