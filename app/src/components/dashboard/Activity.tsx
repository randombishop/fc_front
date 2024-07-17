import React from 'react';
import { Line } from 'react-chartjs-2';
import { Typography } from '@mui/material';
import 'chart.js/auto';

import { getBackendUrl, fontFamily, colors, hexToRGBA } from '../../utils';
import TerminalWindow from '../common/TerminalWindow'; 

interface ActivityState {
  data: {
    day: string;
    num_cast: number;
    num_fid: number;
  }[] | null;
}

class Activity extends React.Component<{}, ActivityState> {

  constructor(props: {}) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount() {
    fetch(`${getBackendUrl()}/dashboard/activity`)
      .then(response => response.json())
      .then(data => this.setState({ data }))
      .catch(error => console.error('Error:', error));
  }

  prepareChartData() {
    if (!this.state.data) throw new Error('No data');
    this.state.data.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
    const labels = this.state.data.map(item => new Date(item.day).toLocaleDateString());
    const numCastData = this.state.data.map(item => item.num_cast);
    const numFidData = this.state.data.map(item => item.num_fid);
    return {
      labels,
      datasets: [
        {
          label: 'Num Cast',
          data: numCastData,
          borderColor: colors.primary,
          backgroundColor: hexToRGBA(colors.primary, 0.5),
          yAxisID: 'y1', 
          tension: 0.3,
          pointRadius: 0
        },
        {
          label: 'Num Fid',
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
          y1: {
              title: {
                display: true,
                text: 'Number of casts'
              },
              position: 'left' as const,
              grid: {
                drawOnChartArea: false
              }
          },
          y2: {
              title: {
                display: true,
                text: 'Unique Users',
              },
              position: 'right' as const,
              grid: {
                drawOnChartArea: false
              }
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
      <TerminalWindow title="Activity">
        {this.state.data ? this.renderChart() : <Typography>Loading...</Typography>}
      </TerminalWindow>
    );
  }
}

export default Activity;
