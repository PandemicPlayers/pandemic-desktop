import React from 'react';

export default class Action extends React.Component {
  moveTo(e) {
    let city = e.currentTarget.dataset.city;
    this.props.connection.pushAction({type: 'move', city: city});
  }

  treat(e) {
    this.props.connection.pushAction({type: 'treat'});
  }

  render() {
    let infectionCount = this.props.cities[this.props.currentCity].infection_count;
    let treat = null;
    if (infectionCount > 0) {
      treat = <button onClick={this.treat.bind(this)}>Treat</button>
    }
    return (
      <div>
        <h2>Actions {this.props.actionsRemaining}</h2>
        <p>In {this.props.currentCity}; {infectionCount} infections</p>
        {_.map(this.props.connections, (connection) => {
          let city = this.props.cities[connection];
          if (city) {
            let infectionCount = city.infection_count;
            return <button
                     key={connection}
                     data-city={connection}
                     onClick={this.moveTo.bind(this)}>
                     Move To {connection} ({infectionCount})
                   </button>
          }
        })}
        {treat}
      </div>
    );
  }
}
