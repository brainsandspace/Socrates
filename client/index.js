import './main.scss';
import * as d3 from 'd3';
import keymap from './keymap.js';

try {
  const transcriptEl = document.querySelector('#transcript');

  const ws = new WebSocket(`ws://localhost:5000`);

  ws.onopen = (evt) => {
    console.log('open evt', evt);
  };

  ws.onmessage = (evt) => {
    console.log(evt.data)
    console.log(evt.data.toString());
    evt.target.send('hello server');
    updateData(evt.data.toString());
  };

  /**
   * d3 stuff below
   */
  let margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const x = d3.scaleBand().range([0, width]).padding(0.05)
  const y = d3.scaleLinear().range([height, 0]);

  let xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  const svg = d3.select('svg')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const tooltip = d3.select('body').insert('div', 'first-child').attr('class', 'tooltip');
  // svg.call(tip);Selection.insert("div",":first-child");
  x.domain(keymap.map((d) => d.character));
  y.domain([0, d3.max(keymap, (d) => d.frequency)]);

  svg.selectAll('.bar')
    .data(keymap)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    // .attr('id', d => d.character)
    .attr('x', d => x(d.character))
    .attr('y', d => y(d.frequency))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.frequency))
    .on('mousemove', d => {
      tooltip.style('left', `${d3.event.pageX - 20}px`)
        .style('top', `${d3.event.pageY - 70}px`)
        .style('display', `block`)
        .html(`<b>${d.character}</b><p>${d.frequency}</p>`)
    })
    .on('mouseout', d => {
      tooltip.style('display', 'none');
    })

  // add the x Axis
  svg.append("g")
    .attr('class', 'x-axis')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
    .call(d3.axisLeft(y));

  const updatedKeymap = localStorage.getItem('keyCounts') ? JSON.parse(localStorage.keyCounts) : [...keymap];


  function updateData(char) {

    // const updatedKeymap = [...keymap];
    updatedKeymap.forEach((key, ind) => {
      if (key.character === char) {
        updatedKeymap[ind].frequency++;
        console.log(key, updatedKeymap[ind]);
      }
    });
    updatedKeymap.sort((a, b) => b.frequency - a.frequency);
    y.domain([0, d3.max(updatedKeymap, (d) => d.frequency)]);
    x.domain(updatedKeymap.map((d) => d.character));
    // svg.transition();
    svg.selectAll(`.bar`)
      //  .duration(50)
      .data(updatedKeymap)
      .attr('class', d => {
        if (d.character === char) {
          return 'bar latest';
        } else {
          return 'bar';
        }
      })
      .attr('x', d => x(d.character))
      .attr('y', d => y(d.frequency))
      .attr('height', d => height - y(d.frequency))

    svg.select('.x-axis').call(xAxis);

    localStorage.setItem('keyCounts', JSON.stringify(updatedKeymap))
  }
}

catch (e) {
  console.error('my error', e);
  if (ws) ws.send('error sir,', e)
}