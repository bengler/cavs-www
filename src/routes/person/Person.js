import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {get} from 'lodash'
import dateFns from 'date-fns'
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

  renderDates = (deceased, dob) => {
    const start = get(dob, 'date.utc')
    const end = get(deceased, 'date.utc')
    if (start && end) {
      return (
        <span
          title={`Born:${dateFns.format(new Date(start), 'D MMMM YYYY')} Deceased ${dateFns.format(new Date(deceased), 'D MMMM YYYY')}`}
        >
          *{start.split('-')[0]} †{end.split('-')[0]}
        </span>)
    }
    if (start) {
      return <span title={`Born: ${dateFns.format(new Date(start), 'D MMMM YYYY')}`}>Born {start.split('-')[0]}</span>
    }
    if (end) {
      return <span titile={`Deceased ${dateFns.format(new Date(deceased), 'D MMMM YYYY')}`}>†{end.split('-')[0]}</span>
    }
    return ''
  }

  render() {
    const {person} = this.props
    const {name, portraits, shortBio, deceased, dob, references = []} = person
    console.log(person.name, person)
    return (
      <div>
        <div className={s.container}>
          <h1 className={s.title}>{name}</h1>
          <p className={s.shortBio}>{shortBio}</p>
          {this.renderDates(deceased, dob)}
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
