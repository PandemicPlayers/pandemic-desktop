import React from 'react';

export default class Player extends React.Component {
  render() {
    return (
      <p>{this.props.name}: {this.props.city}</p>
    );
  }
}
