import React from 'react';
import { filter } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import themeShape from './themeShape';
import Theme from './Theme';
import Link from '../Link/Link';
import MatrixCamera from '../MatrixCamera/MatrixCamera';
import MatrixElement from '../MatrixElement/MatrixElement';

import s from './Explorer.css';

class Explorer extends React.Component {
  static propTypes = {
    theme: themeShape.isRequired
  }

  state = {
    scroll: 0
  }

  onScroll = () => {
    this.setState({
      scroll: window.scrollY
    })
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
  }

  render() {
    const { theme } = this.props
    const { scroll } = this.state
    const tangents = theme.tangents || []

    return (
      <div>
        <Theme theme={theme} active />

        {tangents.map(tangent => (
          <Theme key={tangent.key} theme={tangent} />
        ))}
      </div>
    )

    // const items = theme.items.map((item, i) => ({
    //   heading: item.title || item.name,
    //
    //   text: 'Text',
    //
    //   styles: {
    //     container: {
    //       width: '80vw',
    //       color: `hsl(${(i * 400) % 360}, 100%, 50%)`,
    //       background: `rgba(255, 0, 0, 0.1)`,
    //       pointerEvents: 'none'
    //     },
    //
    //     heading: {
    //       cursor: 'pointer',
    //       textDecoration: 'underline',
    //       pointerEvents: 'all',
    //       textTransform: 'uppercase',
    //       fontWeight: 'normal',
    //       fontSize: '1em'
    //     }
    //   },
    //
    //   position: [
    //     0,
    //     i * 200,
    //     (Math.sin(i) * 0.5 + 0.5) * -200
    //   ],
    //
    //   rotation: [
    //     Math.sin(i) / 2,
    //     [
    //       1,
    //       i / 2,
    //       0
    //     ]
    //   ]
    // }))

    // return (
    //   <div>
    //     <MatrixCamera target={items[0]} scroll={scroll}>
    //       {items.map((item, i) => (
    //         <MatrixElement
    //           key={i}
    //           position={item.position}
    //           rotation={item.rotation}
    //           style={item.styles.container}
    //           children={(
    //             <div>
    //               <h1 style={item.styles.heading}>
    //                 <Link to={`/explore/${i}`}>
    //                   {item.heading}
    //                 </Link>
    //               </h1>
    //               <p>
    //                 {item.text}
    //               </p>
    //             </div>
    //           )}
    //         />
    //       ))}
    //     </MatrixCamera>
    //   </div>
    // );
  }
}

export default withStyles(s)(Explorer);
