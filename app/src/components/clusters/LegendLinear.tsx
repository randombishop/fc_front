import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LegendLinear = ({ width = 300, title = 'Scale' }) => {
  const legendRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(legendRef.current)
      .attr('width', width)
      .attr('height', 40);
    svg.selectAll('*').remove();
    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient');
    const numStops = 10;
    const colorRange = d3.range(0, 1.1, 1.0 / (numStops - 1)); // 10 stops
    colorRange.forEach((d, i) => {
      linearGradient.append('stop')
        .attr('offset', `${(d * 100)}%`)
        .attr('stop-color', d3.interpolateViridis(d));
    });
    svg.append('rect')
      .attr('x', 30)
      .attr('y', 0)
      .attr('width', width-60)
      .attr('height', 20)
      .style('fill', 'url(#legend-gradient)');
    svg.append('text')
      .attr('x', 0)
      .attr('y', 15)
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('text-anchor', 'start')
      .text('MIN');
    svg.append('text')
      .attr('x', width)
      .attr('y', 15)
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('text-anchor', 'end')
      .text('MAX');

  }, [width]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div>{title}</div>
      <svg ref={legendRef}></svg>
    </div>
  );
};

export default LegendLinear;
