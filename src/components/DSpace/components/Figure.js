import React from 'react'
import style from './components.css'


function formatPlaintext(text) {
  if (!text) return null
  let i = 1
  return text.split('\n').map((para) => <p key={i++}>{para}</p>)
}

export default class Figure extends React.PureComponent {
  render() {
    const width = this.props.width
    const height = Math.round(this.props.width / this.props.item.image.asset.metadata.dimensions.aspectRatio)
    return (
      <div className={style.figure} style={{width: `${width}px`}}>
        <img style={{width: `${width}px`, height: `${height}px`}} src={`${this.props.item.image.asset.url}?w=${width * 2}`}/>
        <div className={style.caption}>
          <h3>{this.props.item.title}</h3>
          {formatPlaintext(this.props.item.caption)}
        </div>
      </div>
    )
  }
}