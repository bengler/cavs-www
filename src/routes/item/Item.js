/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import dateFns from 'date-fns'
import {get} from 'lodash'
import embed from 'embed-video'
import s from './Item.css'
import ImageGallery from '../../components/ImageGallery/ImageGallery'
import PartOf from '../../components/PartOf/PartOf'
import Subjects from '../../components/Subjects/Subjects'
import Creators from '../../components/Creators/Creators'
import Formats from '../../components/Formats/Formats'
import Rights from '../../components/Rights/Rights'
import ResolveType from '../../components/ResolveType'


class Item extends React.PureComponent {

  static propTypes = {
    item: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      identifier: PropTypes.string,
      date: PropTypes.object,
      subjects: PropTypes.arrayOf(
        PropTypes.string,
      ),
      format: PropTypes.arrayOf(
        PropTypes.string,
      ),
      rights: PropTypes.shape({
        holdingInstitution: PropTypes.string,
      }),
      imageAssets: PropTypes.array,
      creators: PropTypes.array,
      videoUrl: PropTypes.string,
      partOf: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          _id: PropTypes.string,
          imageAssets: PropTypes.array,
        }),
      ),
    }),
  }

  static defaultProps = {
    item: {
      title: 'Untitled',
    },
  }

  getYear = date => {
    const utc = get(date, 'date.utc')
    if (utc) {
      return dateFns.format(new Date(utc), 'YYYY')
    }

    return ''
  }

  render() {
    const {item} = this.props
    const {
      _type,
      title,
      description,
      date,
      imageAssets,
      rights = {},
      format = [],
      creators = [],
      subjects = [],
      partOf = [],
      videoUrl,
    } = item

    if (!item) {
      return <div>Nothing here</div>
    }

    return (
      <div className={s.root}>
        {
          imageAssets && imageAssets[0]
          && (
            <img
              className={s.mainImage}
              src={`${imageAssets[0].asset.url}?w=1200&fit=max`}
              alt=""
            />
          )
        }
        <div className={s.container}>
          {
            partOf && partOf.length > 0 && partOf[0].name && (
              <div className={s.partOf}>
                <PartOf partOf={partOf} showCreators />
              </div>
            )
          }

          <h1 className={s.title}>
            {title}, {this.getYear(date)}
            {
              creators && creators.length > 0 && (
                <span>,&nbsp;
                  <span className={s.creatorsType}>
                    <ResolveType type={_type} />
                  </span>
                  &nbsp; by <Creators creators={creators} />
                </span>
              )
            }
          </h1>
          <p className={s.description}>
            {description || 'No description'}
          </p>

          <div className={s.meta}>
            <Subjects subjects={subjects} />&nbsp;
            <Formats formats={format} />
          </div>
          <Rights rights={rights} />
          {
            _type === 'movingImage' && videoUrl && (
              <div
                className={s.video}
                dangerouslySetInnerHTML={{
                  __html: embed(videoUrl, {image: 'thumbnail_large'}),
                }}
              />
            )
          }
          <ImageGallery images={imageAssets} excludeFirst />
        </div>
      </div>
    )
  }
}

export default withStyles(s)(Item)
