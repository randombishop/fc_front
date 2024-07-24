import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

import { getBackendUrl, fontFamily, colors, hexToRGBA } from '../../utils';
import Panel from '../common/Panel'; 
import Loading from '../common/Loading';


class Volume extends React.Component<{}, { data: any[] }> {

  constructor(props: {}) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    fetch(`${getBackendUrl()}/dashboard/volume`)
      .then(response => response.json())
      .then(data => this.setState({ data }))
      .catch(error => alert('Error:' + error));
  }

  prepareChartData() {
    if (this.state.data.length === 0) throw new Error('No data');
    this.state.data.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
    const labels = this.state.data.map(item => item.day.slice(0, 10));
    const numCastData = this.state.data.map(item => item.num_cast);
    const numFidData = this.state.data.map(item => item.num_fid);
    return {
      labels,
      datasets: [
        {
          label: 'Num Casts',
          data: numCastData,
          borderColor: colors.primary,
          backgroundColor: hexToRGBA(colors.primary, 0.5),
          yAxisID: 'y1', 
          tension: 0.3,
          pointRadius: 0
        },
        {
          label: 'Num Users',
          data: numFidData,
          borderColor: colors.secondary,
          backgroundColor: hexToRGBA(colors.secondary, 0.5),
          yAxisID: 'y2', 
          tension: 0.3,
          pointRadius: 0
        }
      ],
    };
  }

  renderChart() {
    const chartData = this.prepareChartData();
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Daily number of casts and unique casters',
          font: {
            family: fontFamily
          }
        }
      },
      scales: {
          x: {
            grid: {
              drawOnChartArea: false
            }
          },
          y1: {
              title: {
                display: true,
                text: 'Number of casts'
              },
              position: 'left' as const,
              grid: {
                drawOnChartArea: false
              },
              min: 0
          },
          y2: {
              title: {
                display: true,
                text: 'Unique Users',
              },
              position: 'right' as const,
              grid: {
                drawOnChartArea: false
              },
              min: 0
          }
      }
    };
    return (
      <Line data={chartData} 
            options={options} 
            height='200px'      
      />
    ) ;
  }

  render() {
    return (
      <Panel title="Volume">
        {this.state.data.length > 0 ? this.renderChart() : <Loading />}
      </Panel>
    );
  }
}

export default Volume;
