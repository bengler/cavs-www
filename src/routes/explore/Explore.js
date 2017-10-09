import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';

import Link from '../../components/Link/Link'
import MatrixCamera from '../../components/MatrixCamera/MatrixCamera'
import MatrixElement from '../../components/MatrixElement/MatrixElement'

import s from './Explore.css';

const items = Array(20).fill().map((v, i) => ({
  heading: 'Title',

  text: 'Text',

  styles: {
    container: {
      width: '80vw',
      color: `hsl(${(i * 400) % 360}, 100%, 50%)`,
      background: `rgba(255, 0, 0, 0.1)`,
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
    scroll: 0
  }

  static defaultProps = {
    theme: 0
  }

  onScroll = () => {
    this.setState({
      scroll: window.scrollY
    })
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
  }

  render() {
    const { theme } = this.props
    const { scroll } = this.state

    console.log(theme)

    return (
      <div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Link to='/explore/0'>0</Link>
          <Link to='/explore/1'>1</Link>
          <Link to='/explore/2'>2</Link>

          {items.map((item, i) => (
            <Link to={`/explore/${i}`}>
              {i}
            </Link>
          ))}
        </div>

        <MatrixCamera target={items[theme]} scroll={scroll}>
          {items.map((item, i) => (
            <MatrixElement
              key={i}
              position={item.position}
              rotation={item.rotation}
              style={item.styles.container}
              children={(
                <div>
                  <h1 style={item.styles.heading}>
                    <Link to={`/explore/${i}`}>
                      {item.heading}
                    </Link>
                  </h1>
                  <p>
                    {item.text}
                  </p>
                </div>
              )}
            />
          ))}
        </MatrixCamera>
      </div>
    );
  }
}

export default withStyles(s)(Home);
