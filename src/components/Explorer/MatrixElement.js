import React from 'react'
import mat4 from 'gl-mat4'

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import css from './MatrixElement.css';

const MatrixElement = ({
  component = 'div',
  transforms,
  ...props
}) => {
  const matrix = mat4.create()

  transforms.forEach(([key, ...params]) => {
    mat4[key](matrix, matrix, ...params)
  })

  return React.createElement(component, {
    ...props,
    className: css.root,
    style: {
      ...props.style,
      transformOrigin: 'top center',
      transform: `
        translate(-50%, 0)
        matrix3d(${matrix.join()})
      `
    }
  })
}

export default withStyles(css)(MatrixElement)
