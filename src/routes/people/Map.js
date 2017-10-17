/* global L */
import React from 'react'
import PropTypes from 'prop-types'
import {get} from 'lodash'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Menu from './Menu'
import s from './Map.css'

class Persons extends React.Component {

  static propTypes = {
    people: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    )
  }

  createPopUp = person => {
    const src = get(person, 'portraits[0].asset.url')
    return `
      <a href="/person/${person._id}">
        ${src ? `<img src="${src}?w=300&fit=max" />` : ''}
        <span clasa="${s.popupTitle}">${person.name}</span>
      </a>
    `
  }

  componentDidMount() {
    const {people} = this.props

    require('mapbox.js') // eslint-disable-line
    require('leaflet.markercluster')

    if (people.length) {
      L.mapbox.accessToken = 'pk.eyJ1IjoiZXZlbndlc3R2YW5nIiwiYSI6ImFBYWt4blUifQ.QwErrY0yQBcC9ST5UWp4Rg'

      this.map = L.mapbox.map(
        this._mapElement, 'evenwestvang.792b3ceb', {attributionControl: true}
      )
      this.map.scrollWheelZoom.disable()

      const markers = new L.MarkerClusterGroup()

      const majorMarkerIcon = L.icon({
        iconUrl: '/images/map-marker.png',
        iconSize: [24, 24], // size of the icon
        iconAnchor: [12, 24], // point of the icon which will correspond to marker's location
        popupAnchor: [-12, -18], // point from which the popup should open relative to the iconAnchor
      })

      people.forEach(person => {
        const title = person.name
        const lat = get(person, 'placeOfBirth.location.lat')
        const lng = get(person, 'placeOfBirth.location.lng')
        if (!lat || !lng) {
          return
        }
        const marker = L.marker(new L.LatLng(lat, lng), {
          icon: majorMarkerIcon,
          title: title
        })
        marker.bindPopup(this.createPopUp(person))
        markers.addLayer(marker)
      })
      this.map.addLayer(markers)
    }
  }

  setMapElement = element => {
    this._mapElement = element
  }

  render() {
    return (
      <div className={s.root}>
        <Menu />
        <div className={s.map} ref={this.setMapElement} />
      </div>
    )
  }
}

export default withStyles(s)(Persons)
