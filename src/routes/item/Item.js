/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import dateFns from 'date-fns'
import {get, compact} from 'lodash'
import embed from 'embed-video'
import s from './Item.css'
import ImageGallery from '../../components/ImageGallery/ImageGallery'
import PartOf from '../../components/PartOf/PartOf'
import LinkResolver from '../../components/Link/Resolver'
import Subjects from '../../components/Subjects/Subjects'
import Creators from '../../components/Creators/Creators'
import Formats from '../../components/Formats/Formats'
import Rights from '../../components/Rights/Rights'
import ResolveType from '../../components/ResolveType'
import ImageFlipper from '../../components/ImageFlipper/ImageFlipper'
import ReferenceGrid from '../../components/ReferenceGrid/ReferenceGrid'

class Item extends React.PureComponent {

  static propTypes = {
    currentImageKey: PropTypes.string,
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
    const {item, currentImageKey} = this.props
    const {
      _id,
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
      videoUrl
    } = item

    if (!item) {
      return <div>Nothing here</div>
    }

    console.log('imageAssets', imageAssets)

    return (
      <div className={s.root}>
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
        {
          imageAssets && imageAssets.length > 0
          && (
            <div className={s.mainImage} key={_id}>
              <ImageFlipper
                url={`/item/${item.identifier}`}
                currentImageKey={currentImageKey}
                images={imageAssets}
              />
            </div>
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
            <span className={s.titleWork}>{title}</span>, {this.getYear(date)}
            {
              creators && creators.length > 0 && (
                <span>,&nbsp;
                  <span className={s.creatorsType}>
                    <ResolveType type={_type} />
                  </span>
                  &nbsp;by <Creators creators={creators} />
                </span>
              )
            }
          </h1>
          <p className={s.description}>
            {description || 'No description'}
          </p>

          <div className={s.meta}>
            {
              subjects && compact(subjects).length > 0 && (
                <span><Subjects subjects={compact(subjects)} />&emsp;</span>
              )
            }
            <Formats formats={format} />
          </div>
          <div className={s.rights}>
            <Rights rights={rights} />
          </div>
          {
            imageAssets && imageAssets > 1 && (
              <div className={s.imageGallery}>
                <ImageGallery images={imageAssets} excludeFirst />
              </div>
            )
          }

          {
            partOf && partOf.length > 0 && (
              <div className={s.references}>
                {
                  partOf.map(part => {
                    if (!part.references || part.references.length === 0) {
                      return false
                    }
                    if (part.references.length === 1 && part.references[0]._id === item._id) {
                      return false
                    }
                    return (
                      <div key={part._id}>
                        <h2>Also from <LinkResolver item={part}>{part.name}</LinkResolver></h2>
                        <ReferenceGrid references={part.references.filter(i => i._id != item._id)} />
                      </div>
                    )
                  })
                }
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default withStyles(s)(Item)
