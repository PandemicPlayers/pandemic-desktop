import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import { Socket } from 'phoenix_js';

let socket = new Socket('ws://10.111.3.87:4000/socket');
socket.connect();
socket.onClose(e => console.log('Closed connection'));

var channel = socket.channel('game', {});
channel.join()
  .receive('ok', (response) => console.log('Ok', response))
  .receive('error', () => console.log('Connection error'));

channel.on('pong', message => console.log('On Pong', message));

channel.push('ping')
  .receive('ok', message => console.log('Ping Reply', message));

// class Board extends React.Component {
//   render() {
//
//   }
// }
//
// class App extends React.Component {
//   render() {
//     return (
//       <h1>Pandemic</h1>
//     );
//   }
// }
//
// const initialState = {
//   board: 'waiting'
// };
//
// function app(state = initialState, action) {
//   switch (action.type) {
//     default:
//       return state;
//   }
// }
//
// let store = createStore(app);
//
// const mapStateToProps = (state, ownProps) => {
//   return {
//     board:
//     foo: 'bar'
//   }
// }
//
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {};
// }
//
// const ConnectedApp = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(App);
//
// ReactDOM.render(
//   <Provider store={store}>
//     <ConnectedApp />
//   </Provider>,
//   document.getElementById('container'));
