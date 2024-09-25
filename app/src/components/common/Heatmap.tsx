import React, { Component } from 'react';
import * as d3 from 'd3';


class Heatmap extends Component<{matrix:any, maxDistance:number, width:number, height:number}> {

  heatmapRef: any ;

  constructor(props:any) {
    super(props);
    this.heatmapRef = React.createRef();  // Reference to the SVG element
  }

  // Method to draw the heatmap using D3.js
  drawHeatmap = () => {
    const matrix = this.props.matrix;
    const maxDistance = this.props.maxDistance ;
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    const cellSize = Math.min(Math.floor(this.props.width / numCols), Math.floor(this.props.height / numRows)) ;
    const width = cellSize * numCols;
    const height = cellSize * numRows;
    const colorScale = d3.scaleSequential()
      .domain([0, maxDistance])
      .interpolator(d3.interpolateRgb("red", "blue"));
    const svg = d3.select(this.heatmapRef.current)
      .attr('width', width)
      .attr('height', height);
    const heatmap:any = svg.selectAll('rect')
      .data(matrix.flat());
    heatmap.exit().remove();
    heatmap.enter()
      .append('rect')
      .merge(heatmap)
      .attr('x', (d:any, i:any) => (i % numCols) * cellSize)
      .attr('y', (d:any, i:any) => Math.floor(i / numCols) * cellSize)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', (d:any) => (d === Infinity ? 'black' : colorScale(d)))
      //.attr('stroke', 'white');  // Optional: add grid lines
  };

  // Called when the component is mounted
  componentDidMount() {
    this.drawHeatmap();
  }

  // Called when the component is updated (e.g., when props change)
  componentDidUpdate() {
    this.drawHeatmap();
  }

  render() {
    return (
      <svg ref={this.heatmapRef} width={this.props.width} height={this.props.height} />
    );
  }
}

export default Heatmap;
