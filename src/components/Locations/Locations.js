/* global L */
import React from 'react'
import PropTypes from 'prop-types'
import {findDOMNode} from 'react-dom'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import s from './Locations.css'

class Locations extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.shape({
      _key: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      location: PropTypes.shape(
        {
          lat: PropTypes.number,
          lng: PropTypes.number,
        },
      ),
    })),
  };

  static defaultProps = {
    locations: [],
  }

  componentDidMount() {
    const {locations} = this.props
    require('mapbox.js'); // eslint-disable-line
    if (locations.length && locations[0].location) {
      L.mapbox.accessToken = 'pk.eyJ1IjoiZXZlbndlc3R2YW5nIiwiYSI6ImFBYWt4blUifQ.QwErrY0yQBcC9ST5UWp4Rg'
      this.map = L.mapbox.map(this._mapElement, 'evenwestvang.792b3ceb', {attributionControl: true})
      this.map.scrollWheelZoom.disable()
      this.addAllMarkers()
      const location = locations[0]
      const latlon = location && location.location
      this.map.setView([latlon.lat, latlon.lng], 5)
    }
  }

  setPopupElement = element => {
    this._popupElement = element
  }

  setMapElement = element => {
    this._mapElement = element
  }

  addAllMarkers() {
    this.markers = this.createMarkers()
    this.markers.forEach(marker => marker.addTo(this.map))
  }

  createMarkers() {
    const majorMarkerIcon = L.icon({
      iconUrl: '/images/map-marker.png',
      shadowUrl: '/images/map-marker-shadow.png',

      iconSize: [14, 14], // size of the icon
      shadowSize: [18, 18], // size of the shadow
      iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
      shadowAnchor: [9, 9],  // the same for the shadow
      popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor
    })

    const {locations} = this.props

    return locations.map(location => {
      const latlon = location.location

      if (!latlon) {
        return null
      }

      const marker = L.marker([latlon.lat, latlon.lng], {
        icon: majorMarkerIcon,
      })

      marker.on('popupopen', () => this.setState({popupProject: location}))
      marker.bindPopup(this.popupEl)
      return marker
    })
    .filter(Boolean)
  }


  render() {
    const {locations} = this.props

    if (!locations.length) {
      return false
    }

    return (
      <div className={s.root}>
        <div className={s.popup} ref={this.setPopupElement}>Popup</div>
        <div className={s.mapContainer} ref={this.setMapElement} />
        <ul className={s.list}>
          {
          locations.map(location => (
            <li key={location._key} className={s.item}>
              {location.city}, {location.country}&nbsp;
              {
                location.location && location.location.lat && location.location.lng && (
                  <a className={s.mapLink} href={`http://maps.google.com/?q=${location.location.lat},${location.location.lng}`}>Map</a>
                )
              }
            </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default withStyles(s)(Locations)
