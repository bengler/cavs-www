import React from 'react';
import PropTypes from 'prop-types';

import Link from './Link/Link';

export default class ResolveType extends React.Component {
  static propTypes = {
    type: PropTypes.string,
  };

  static defaultProps = {
    type: '',
  }

  HumanReadableType = (type) => {
    switch (type) {
      case 'building':
        return 'Building';
      case 'event':
        return 'Event';
      case 'exhibition':
        return 'Exhibition';
      case 'institution':
        return 'Institution';
      case 'multipleInstallation':
        return 'Multiple Installation';
      case 'multipleTimebased':
        return 'Multiple Timebased';
      case 'work2d':
        return '2D Work';
      case 'work3d':
        return '3D Work';
      case 'workTimebased':
        return 'Timebased';
      case 'audioRecording':
        return 'Audio Recording';
      case 'correspondence':
        return 'Correspondence';
      case 'document':
        return 'Document';
      case 'ephemera':
        return 'Ephemera';
      case 'eResource':
        return 'Electronic Resource';
      case 'floorplan':
        return 'Floorplan';
      case 'movingImage':
        return 'Moving Image';
      case 'newsClipping':
        return 'News Clipping';
      case 'poster':
        return 'Poster';
      case 'publication':
        return 'Publication';
      case 'stillImage':
        return 'Still Image';

      default:
        return 'default';
    }
  }

  render() {
    const { type } = this.props;
    return (
      <Link to={`/type/${type}`}>{this.HumanReadableType(type)}</Link>
    );
  }
}
