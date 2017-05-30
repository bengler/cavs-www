import React from 'react';
import PropTypes from 'prop-types';

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

  render() {
    const { locations } = this.props;
    if (!locations.length) {
      return false;
    }
    return (
      <div>
        <h2>Locations</h2>
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
