import _ from 'lodash';
import { Socket } from 'phoenix_js';

export default class Connection {
  constructor(url, onGameStateChange) {
    this.socket = new Socket(url);
    this.onGameStateChange = onGameStateChange;
    this.nickname = null;
  }

  connect(nickname) {
    this.nickname = nickname;

    console.log('Connecting to socket...');
    this.socket.connect();
    this.socket.onClose(this.onClose)

    console.log('Connecting to channel as', nickname, '...');
    this.channel = this.socket.channel('game', {});
    this.channel.join()
      .receive('ok', (response) => console.log('Joined channel.', response))
      .receive('error', () => console.log('Failed to connect to channel.'));
    this.channel.on('game:state_change', this.onGameStateChange);
    this.channel.push('game:action', {type: 'connect', nickname: this.nickname});
    this.channel.push('game:state')
      .receive('ok', this.onGameStateChange);
  }

  onClose(e) {
    console.log('Socket connection closed.', e)
  }

  pushAction(payload) {
    let mergedPayload = _.merge({nickname: this.nickname}, payload);
    this.channel.push('game:action', mergedPayload)
      .receive('error', (response) => {
        console.log('Push action error:', response);
      });
  }
}
