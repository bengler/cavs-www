import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import MatrixCamera from '../../components/MatrixCamera/MatrixCamera'
import MatrixElement from '../../components/MatrixElement/MatrixElement'
import s from './Home.css'

const items = Array(20).fill().map((v, i) => ({
  key: i,
  heading: 'Title',

  text: 'Text',

  styles: {
    container: {
      width: '80vw',
      color: `hsl(${(i * 400) % 360}, 100%, 50%)`,
      background: 'rgba(255, 0, 0, 0.1)',
      pointerEvents: 'none'
    },

    heading: {
      cursor: 'pointer',
      textDecoration: 'underline',
      pointerEvents: 'all',
      textTransform: 'uppercase',
      fontWeight: 'normal',
      fontSize: '1em'
    }
  },

  position: [
    0,
    i * 200,
    (Math.sin(i) * 0.5 + 0.5) * -200
  ],

  rotation: [
    Math.sin(i) / 2,
    [
      1,
      i / 2,
      0
    ]
  ]
}))

class Home extends React.Component {
  state = {
    index: 0,
    scroll: 0
  }

  onScroll = () => {
    this.setState({
      scroll: window.scrollY
    })
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }

  render() {
    const {index, scroll} = this.state

    return (
      <MatrixCamera target={items[index]} scroll={scroll}>
        {items.map((item, i) => (
          <MatrixElement
            key={item.key}
            position={item.position}
            rotation={item.rotation}
            style={item.styles.container}
          >
            <div>
              <h1 style={item.styles.heading}>
                <span onClick={() => this.setState({index: i})}>
                  {item.heading}
                </span>
              </h1>
              <p>
                {item.text}
              </p>
            </div>
          </MatrixElement>
        ))}
      </MatrixCamera>
    )
  }
}

export default withStyles(s)(Home)
