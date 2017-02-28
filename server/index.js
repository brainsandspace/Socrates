// The unix command finally worked!!!
// The following command needs to be run before running this script.
/** $ xinput list |   grep -Po 'id=\K\d+(?=.*slave\s*keyboard)' |   xargs -P0 -n1 xinput test | tee /dev/tty | nc -l 3333 -k
 */
import http from 'http';
import url from 'url';

let localIP;
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  localIP = add;
  console.log(`point any browser on the same local network to ${add}:1234`);
});

/**************************** WEBSOCKET SERVER ******************************/
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 5000 });
wss.on('connection', (ws) => {
  const location = url.parse(ws.upgradeReq.url, true);
  console.log('connected to web socket, location', location);

  ws.send('hey client');

  ws.on('message', (message) => {
    console.log(`received: ${message}`);
  });

  ws.on('close', () => {
    console.log('closing connection');
  });
});
/*__________________________________________________________________________*/

/** keymapping stuff below */

import keymap from './keymap.js';

const net = require('net');

// TCP socket listening to netcat on local port 3333 (assumes local ip of 192.168.0.15)
const client = new net.Socket();
client.connect(3333, '192.168.0.15', () => {
  console.log('connected to tcp socket');
});

client.on('data', (data) => {
  const num = parseInt(data.toString().match(/\d+/)[0]);

  console.log(keymap.get(num))
  console.log('data', data.toString());
  if (data.toString().includes('press')) {
    wss.clients.forEach((client) => {
      client.send(keymap.get(num));
    })
  }
})

client.on('close', () => {
  console.log('closed');
});