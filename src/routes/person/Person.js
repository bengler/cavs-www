import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Person.css'
import ImageGallery from '../../components/ImageGallery/ImageGallery'
import ReferenceGrid from '../../components/ReferenceGrid/ReferenceGrid'

class Persons extends React.Component {

  static propTypes = {
    person: PropTypes.shape({
      name: PropTypes.string,
      portraits: PropTypes.array,
    }),
  }

  static defaultProps = {
    person: {
      name: 'Untitled',
      portraits: [],
    },
  }

  render() {
    const {person} = this.props
    const {name, portraits, shortBio, references = []} = person
    return (
      <div>
        <div className={s.container}>
          <h1 className={s.title}>{name}</h1>
          <p className={s.shortBio}>{shortBio}</p>
          {
            portraits && portraits[0]
            && (
              <img
                className={s.mainImage}
                src={`${portraits[0].asset.url}?w=2000&fit=max`} alt=""
              />
            )
          }
          <ImageGallery images={portraits} excludeFirst />
          {
            references && references.length > 0 && (
              <h2>Related work:</h2>
            )
          }
          <ReferenceGrid references={references} />
        </div>
      </div>
    )
  }
}

export default withStyles(s)(Persons)
