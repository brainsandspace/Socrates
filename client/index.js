import './main.scss';
import * as d3 from 'd3';
import keymap from './keymap.js';

const transcriptEl = document.querySelector('#transcript');

const ws = new WebSocket(`ws://localhost:5000`);

ws.onopen = (evt) => {
  console.log('open evt', evt);
};

ws.onmessage = (evt) => {
  console.log(evt.data.toString());
  evt.target.send('hello server');
  document.querySelector('#transcript').innerHTML += evt.data;
  updateData(evt.data.toString());
};

/**
 * d3 stuff below
 */
let margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

console.log(d3);
const x = d3.scaleBand().range([0, width]).padding(0.1);
const y = d3.scaleLinear().range([height, 0]);

const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

const svg = d3.select('svg')
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

x.domain(keymap.map((d) => d.character));
y.domain([0, d3.max(keymap, (d) => d.frequency)]);

console.log('max', d3.max(keymap, (d) => d.frequency))

svg.selectAll('.bar')
  .data(keymap)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  // .attr('id', d => d.character)
  .attr('x', d => x(d.character))
  .attr('y', d => y(d.frequency))
  .attr('width', x.bandwidth())
  .attr('height', d => height - y(d.frequency));

// add the x Axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// add the y Axis
svg.append("g")
  .call(d3.axisLeft(y));
console.log(svg);

const updatedKeymap = localStorage.getItem('keyCounts') ? JSON.parse(localStorage.keyCounts) : [...keymap];
function updateData(char) {

  // const updatedKeymap = [...keymap];
  updatedKeymap.forEach((key, ind) => {
    if (key.character === char) {
      updatedKeymap[ind].frequency++;
      console.log(updatedKeymap[ind]);
    }
  });
  console.log('char', char)
  y.domain([0, d3.max(updatedKeymap, (d) => d.frequency)]);

  svg.transition();
  svg.selectAll(`.bar`)
    //  .duration(50)
     .data(updatedKeymap)
     .attr('y', d => y(d.frequency))
     .attr('height', d => height - y(d.frequency))

  localStorage.setItem('keyCounts', JSON.stringify(updatedKeymap))
}