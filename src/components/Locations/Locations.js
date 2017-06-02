
/* global L */
import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import s from './Locations.css';

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
    // const { locations } = this.props;
    // require('mapbox.js');
    // if (locations.length) {
    //   L.mapbox.accessToken = 'pk.eyJ1IjoiZXZlbndlc3R2YW5nIiwiYSI6ImFBYWt4blUifQ.QwErrY0yQBcC9ST5UWp4Rg';
    //
    //   this.map = L.mapbox.map(findDOMNode(this._mapElement), 'evenwestvang.792b3ceb', { attributionControl: true });
    //   this.map.scrollWheelZoom.disable();
    //   // this.popupEl = ReactDOM.findDOMNode(this.refs.popup);
    //
    //   // this.addAllMarkers();
    //
    //
    //   const location = this.props.locations[0];
    //   const latlon = location && location.location;
    //   this.map.setView([latlon.lat, latlon.lng], 10);
    // }
  }

  // setMapElement = (element) => {
  //   this._mapElement = element;
  // }

  // createMarkers() {
  //   const majorMarkerIcon = L.icon({
  //     iconUrl: '/map-marker.png',
  //     shadowUrl: '/map-marker-shadow.png',
  //
  //     iconSize: [14, 14], // size of the icon
  //     shadowSize: [18, 18], // size of the shadow
  //     iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
  //     shadowAnchor: [9, 9],  // the same for the shadow
  //     popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor
  //   });
  //
  //   const { locations } = this.props;
  //
  //   return locations.map((location) => {
  //     const latlon = location.location;
  //
  //     if (!latlon) {
  //       return null;
  //     }
  //
  //     const marker = L.marker([latlon.lat, latlon.lng], {
  //       icon: majorMarkerIcon,
  //     });
  //
  //     marker.on('popupopen', () => this.setState({ popupProject: location }));
  //     marker.bindPopup(this.popupEl);
  //     return marker;
  //   })
  //   .filter(Boolean);
  // }


  render() {
    const { locations } = this.props;

    if (!locations.length) {
      return false;
    }
    return (
      <div className={s.root}>
        <h2>Locations</h2>
        {/* <div ref={this.setPopupElement} className={s.popup} /> */}
        <div className={s.map}>
          {/* <div ref={this.setMapElement} className={s.leaflet} /> */}
        </div>
        <ul>
          {
          locations.map(location => (
            <li key={location._key}>
              {location.city}, {location.country}&nbsp;
              {
                location.location && location.location.lat && location.location.lng && (
                  <a href={`http://maps.google.com/?q=${location.location.lat},${location.location.lng}`}>Map</a>
                )
              }
            </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default Locations;
