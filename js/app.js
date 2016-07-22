import React from 'react';
import ReactDOM from 'react-dom';
import { Socket } from 'phoenix_js';

// let socket = new Socket('10.111.3.87/socket');
// socket.connect();

class Pandemic extends React.Component {
  render() {
    return (
      <h1>Pandemic</h1>
    );
  }
}

ReactDOM.render(<Pandemic />, document.getElementById('container'));
