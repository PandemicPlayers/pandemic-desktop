import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import { Socket } from 'phoenix_js';
import DevTools from './DevTools.js';
import _ from 'lodash';

class Player extends React.Component {
  render() {
    return (
      <p>{this.props.name}: {this.props.city}</p>
    );
  }
}

class Action extends React.Component {
  moveTo(e) {
    let city = e.currentTarget.dataset.city;
    channel.push('game:action', {type: 'move', nickname: this.props.nickname, city: city})
      .receive('error', (response) => {
        console.log('Response:', response);
      });
  }

  treat(e) {
    console.log('treat');
    channel.push('game:action', {type: 'treat', nickname: this.props.nickname})
      .receive('error', (response) => {
        console.log('Response:', response);
      });
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
            return <button key={connection} data-city={connection} onClick={this.moveTo.bind(this)}>Move To {connection} ({infectionCount})</button>
          }
        })}
        {treat}
      </div>
    );
  }
}

class Board extends React.Component {
  render() {
    let action = null;
    if (this.props.board.current_turn.player_id == this.props.nickname) {
      action = <Action
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
          // return <div><pre>{JSON.stringify([name, state])}</pre><br /></div>;
          return <Player key={name} name={name} city={state.current_city} />;
        })}
        {action}
      </div>
    );
  }
}

class App extends React.Component {
  updateNickName(e) {
    store.dispatch({type: 'update_nickname', nickname: e.target.value});
  }

  move() {
    console.log('moving');
    channel.push('game:action', {type: 'move', nickname: this.props.nickname, city: 'london'})
      .receive('error', (response) => {
        console.log('Response:', response);
      });
  }

  render() {
    let board = null;
    if (this.props.board.players) {
      board = <Board currentPlayer={this.props.nickname} board={this.props.board} nickname={this.props.nickname} />;
    }
    return (
      <div id="app">
        <h1>Pandemic</h1>
        <input defaultValue={this.props.nickname} onChange={this.updateNickName} />
        <strong>{this.props.board.state}</strong>
        {board}
        <strong>State:</strong>
        <pre>{JSON.stringify(this.props.board, null, 2)}</pre>
      </div>
    );
  }
}

const initialState = {
  nickname: 'Chris',
  connected: false,
  board: {}
};

function app(state = initialState, action) {
  switch (action.type) {
    case 'update_nickname':
      return Object.assign({}, state, {
        nickname: action.nickname
      });
    case 'connect':
      return Object.assign({}, state, {
        connected: true
      });
    case 'state_change':
      console.log('New state', action.state);
      // return action.state;
      return Object.assign({}, state, {
        board: action.state.board
      });
    default:
      return state;
  }
}

let store = createStore(app, DevTools.instrument());

const mapStateToProps = (state, ownProps) => {
  return {
    connected: state.connected,
    board: state.board,
    nickname: state.nickname
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
}

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <ConnectedApp />
      <DevTools />
    </div>
  </Provider>,
  document.getElementById('container'));

let socket = new Socket('ws://10.111.3.87:4000/socket');
socket.connect();
socket.onClose(e => console.log('Closed connection'));

var channel = socket.channel('game', {});
channel.join()
  .receive('ok', (response) => console.log('Ok', response))
  .receive('error', () => console.log('Connection error'));

// channel.on('pong', message => console.log('On Pong', message));

channel.on('game:state_change', state => {
  console.log('State Changed', state);
  store.dispatch({type: 'state_change', state: state});
});

// channel.push('ping')
//   .receive('ok', message => console.log('Ping Reply', message));

channel.push('game:action', {type: 'connect', nickname: 'Chris'});

channel.push('game:state')
  .receive('ok', state => {
    console.log('State', state)
    store.dispatch({type: 'state_change', state: state})
  });

// store.dispatch({type: 'board_state', board_state: 'playing'});
