import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Person.css'
import ImageGallery from '../../components/ImageGallery/ImageGallery'
import ReferenceGrid from '../../components/ReferenceGrid/ReferenceGrid'
import approximationDate from '../../components/ApproximationDate/ApproximationDate'
import AffiliationsPeriods from '../../components/AffiliationsPeriods/AffiliationsPeriods'
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

  renderDates = (deceased, dob) => {
    if (dob && deceased) {
      return (
        <span
          title={`Born:${approximationDate(dob)} Deceased ${approximationDate(deceased)}`}
        >
          {approximationDate(dob)}&#8202;–&#8202;{approximationDate(deceased)}
        </span>)
    }
    if (dob) {
      return <span>Born {approximationDate(dob)}</span>
    }
    if (deceased) {
      return <span titile={`Deceased ${approximationDate(deceased)}`}>†{approximationDate(deceased)}</span>
    }
    return ''
  }

  render() {
    const {person} = this.props
    const {name, portraits, shortBio, deceased, dob, affiliationsPeriods, references = []} = person
    return (
      <div>
        <div className={s.container}>
          <h1 className={s.title}>{name}</h1>
          <p className={s.shortBio}>{shortBio}</p>
          <div>
            <AffiliationsPeriods affiliationsPeriods={affiliationsPeriods} />
          </div>
          <div>
            {this.renderDates(deceased, dob)}
          </div>
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
          <div className={s.referenceGrid}>
            <ReferenceGrid references={references} />
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(Persons)
