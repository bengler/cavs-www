import React from 'react';
import PropTypes from 'prop-types';

class Rights extends React.Component {
  static propTypes = {
    rights: PropTypes.shape({
      copyrightHolders: PropTypes.arrayOf(PropTypes.string),
      holdingInstitution: PropTypes.string,
    }),
  };

  static defaultProps = {
    rights: {},
  }

  render() {
    const { rights } = this.props;
    return (
      <div>
        <h2>Rights</h2>


        {
          rights.holdingInstitution && (
            <div>
              <h3>Holding Institution</h3>
              <p>{rights.holdingInstitution}</p>
            </div>
          )
        }

        {
          rights.copyrightHolders && rights.copyrightHolders.length && (
            <div>
              <h3>Copyright Holders</h3>
              {
                rights.copyrightHolders.map(holder => <li key={holder}>{holder}</li>)
              }
            </div>
          )
        }

      </div>
    );
  }
}

export default Rights;
