import React from 'react';
import Action from './Action.jsx';
import Player from './Player.jsx';

export default class Board extends React.Component {
  render() {
    let action = null;
    if (this.props.board.current_turn.player_id == this.props.nickname) {
      action = <Action
                connection={this.props.connection}
                nickname={this.props.nickname}
                currentCity={this.props.board.players[this.props.nickname].current_city}
                connections={this.props.board.cities[this.props.board.players[this.props.nickname].current_city].connections}
                actionsRemaining={this.props.board.current_turn.actions_left}
                cities={this.props.board.cities} />;
    }
    return (
      <div>
        <h1>Board</h1>
        <h2>Players</h2>
        {_.map(this.props.board.players, (state, name) => {
          return <Player key={name} name={name} city={state.current_city} />;
        })}
        {action}
      </div>
    );
  }
}
