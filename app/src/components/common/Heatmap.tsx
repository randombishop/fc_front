import React, { Component } from 'react';
import * as d3 from 'd3';

class Heatmap extends Component<{ matrix: any, maxDistance: number, width: number, height: number }> {

  heatmapRef: any;
  legendRef: any;

  constructor(props: any) {
    super(props);
    this.heatmapRef = React.createRef();  // Reference to the SVG element
    this.legendRef = React.createRef();    // Reference to the legend element
  }

  // Method to draw the heatmap using D3.js
  drawHeatmap = () => {
    const matrix = this.props.matrix;
    const maxDistance = this.props.maxDistance;
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    // Keep the overall heatmap size fixed to this.props.width and this.props.height
    const width = this.props.width;
    const height = this.props.height;

    // Calculate the cell size based on the fixed width and height
    const cellWidth = width / numCols;
    const cellHeight = height / numRows;

    // Color scale
    const colorScale = d3.scaleSequential(d3.interpolateWarm).domain([0, maxDistance]);

    // Select the SVG element and set its dimensions
    const svg = d3.select(this.heatmapRef.current)
      .attr('width', width)
      .attr('height', height);

    // Bind data to rect elements
    const heatmap: any = svg.selectAll('rect')
      .data(matrix.flat());

    // Handle exiting elements
    heatmap.exit().remove();

    // Handle entering and updating elements
    heatmap.enter()
      .append('rect')
      .merge(heatmap)
      .attr('x', (d: any, i: any) => (i % numCols) * cellWidth)
      .attr('y', (d: any, i: any) => Math.floor(i / numCols) * cellHeight)
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('fill', (d: any) => (d === Infinity ? 'black' : colorScale(d)));

    this.drawLegend(maxDistance, colorScale);
  };

  // Method to draw the legend
  drawLegend = (maxDistance: number, colorScale: any) => {
    const legendWidth = 150;  // Width of the legend
    const legendHeight = 20;   // Height of the legend

    const svg = d3.select(this.legendRef.current)
      .attr('width', legendWidth)
      .attr('height', legendHeight + 30);  // Added extra space for labels

    // Create a linear gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    // Define the gradient stops
    gradient.selectAll("stop")
      .data(d3.range(0, 1, 0.01).map(d => ({
        offset: `${d * 100}%`,
        color: colorScale(d * maxDistance)
      })))
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    // Draw the rectangle for the legend
    svg.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#gradient)");

    // Add labels for the legend
    svg.append("text")
      .attr("x", 0)
      .attr("y", legendHeight + 15)  // Adjust position to below the rectangle
      .text("0")
      .style("font-size", "12px")
      .style("fill", "white");

    svg.append("text")
      .attr("x", legendWidth)
      .attr("y", legendHeight + 15)  // Adjust position to below the rectangle
      .attr("text-anchor", "end")
      .text(maxDistance)
      .style("font-size", "12px")
      .style("fill", "white");
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
      <div>
        <svg ref={this.heatmapRef} width={this.props.width} height={this.props.height} />
        <svg ref={this.legendRef} width={150} height={50} style={{ marginTop: '10px' }} />
      </div>
    );
  }
}

export default Heatmap;
