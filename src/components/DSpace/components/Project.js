import React from 'react'

export default class Project extends React.PureComponent {
  render() {
    return (
      <div style={{width: '800px'}}>
        <img src={this.props.project.img}/>
      </div>
    )
  }
}
