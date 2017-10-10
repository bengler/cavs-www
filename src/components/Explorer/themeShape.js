import PropTypes from 'prop-types'

export default PropTypes.shape({
  key: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired
})
