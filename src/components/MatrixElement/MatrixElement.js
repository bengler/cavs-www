import React from 'react'
import { create, translate, rotate } from 'gl-mat4'

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import css from './MatrixElement.css';

const MatrixElement = ({
  component = 'div',
  position = [0, 0, 0],
  rotation = [0, [0, 0, 0]],
  ...props
}) => {
  const matrix = create()

  translate(matrix, matrix, position)
  rotate(matrix, matrix, ...rotation)

  return React.createElement(component, {
    ...props,
    className: css.root,
    style: {
      ...props.style,
      transform: `
        translate(-50%, -50%)
        matrix3d(${matrix.join()})
      `
    }
  })
}

export default withStyles(css)(MatrixElement)
