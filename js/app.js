import {ipcRenderer} from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import DevTools from './DevTools.js';
import _ from 'lodash';

import Application from './components/Application.jsx';

const initialState = {
  nickname: null,
  connected: false,
  connection: null,
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
        connected: true,
        connection: action.connection
      });
    case 'state_change':
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
    connection: state.connection,
    board: state.board,
    nickname: state.nickname
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
}

const ConnectedApplication = connect(
  mapStateToProps,
  mapDispatchToProps
)(Application);

import Connection from './Connection.js';

let socketURL = ipcRenderer.sendSync('get-pandemic-socket-url');
let connection = new Connection(socketURL, (state) => {
  console.log('Received game:state_change', state);
  store.dispatch({type: 'state_change', state: state});
});

const connectToServer = () => {
  store.dispatch({type: 'connect', connection: connection});
  connection.connect(store.getState().nickname);
}

let devTools = null;
if (process.env.DEBUG) {
  devTools = <DevTools />
}

ReactDOM.render(
  <Provider store={store}>
    <div>
      <ConnectedApplication connection={connection} dispatch={store.dispatch} connectToServer={connectToServer} />
      {devTools}
    </div>
  </Provider>,
  document.getElementById('container'));
