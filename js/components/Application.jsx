import React from 'react';
import Board from './Board.jsx'

export default class Application extends React.Component {
  updateNickname(e) {
    this.props.dispatch({type: 'update_nickname', nickname: e.target.value});
  }

  render() {
    if (this.props.connected) {
      let board = null;
      if (this.props.board.players) {
        board = <Board
                  connection={this.props.connection}
                  currentPlayer={this.props.nickname}
                  board={this.props.board}
                  nickname={this.props.nickname} />;
      }
      return (
        <div id="app">
          <h1>Pandemic</h1>
          <p>
            <strong>{this.props.board.state}</strong> as <strong>{this.props.nickname}</strong>
          </p>
          {board}
          <strong>State:</strong>
          <pre>{JSON.stringify(this.props.board, null, 2)}</pre>
        </div>
      );
    } else {
      return (
        <div>
          <input defaultValue={this.props.nickname} onChange={this.updateNickname.bind(this)} />
          <button onClick={this.props.connectToServer}>Connect</button>
        </div>
      )
    }
  }
}
