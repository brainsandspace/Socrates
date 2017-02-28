import './main.scss';
import * as d3 from 'd3';

const transcriptEl = document.querySelector('#transcript');

const ws = new WebSocket(`ws://localhost:5000`);

ws.onopen = (evt) => {
  console.log('open evt', evt);
};

ws.onmessage = (evt) => {
  console.log('data', evt.data.toString());
  evt.target.send('hello server');
  document.querySelector('#transcript').innerHTML += evt.data;
  
  // flags.binary will be set if a binary data is received. 
  // flags.masked will be set if the data was masked. 
};

console.log('whaddup');
