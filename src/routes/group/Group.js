import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Group.css';
import ReferenceList from '../../components/ReferenceList/ReferenceList';
import Subjects from '../../components/Subjects/Subjects';
import Creators from '../../components/Creators/Creators';
import Locations from '../../components/Locations/Locations';
import Extents from '../../components/Extents/Extents';
import ResolveType from '../../components/ResolveType';

class Item extends React.Component {

  static propTypes = {
    group: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      subjects: PropTypes.arrayOf(PropTypes.string),
      creators: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        _id: PropTypes.string,
      })),
      extents: PropTypes.shape({
        depth: PropTypes.number,
        description: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number,
      }),
      locations: PropTypes.arrayOf(PropTypes.object),
      references: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.title,
      })),
    }),
  }

  static defaultProps = {
    group: {
      name: 'Untitled…',
    },
  }

  render() {
    const { group } = this.props;
    const {
      _type,
      name,
      description,
      subjects = [],
      creators = [],
      references = [],
      locations = [],
    } = group;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.type}><ResolveType type={_type} /></div>
          <h1 className={s.title}>{name}</h1>
          <p className={s.description}>{description}</p>

          <Creators creators={creators} />

          {
             (_type === 'work3d' || _type === 'work2d') && (
               <Extents extents={group.extents} type={group._type} />
             )
          }

          <h2>Documentation</h2>
          <ReferenceList references={references} />
          <Subjects subjects={subjects} />
        </div>
        <Locations locations={locations} />
      </div>
    );
  }
}

export default withStyles(s)(Item);
