import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { getBackendUrl } from '../../utils';
import TerminalWindow from '../common/TerminalWindow'; 
import { Typography } from '@mui/material';


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
          data: numCastData
        },
        {
          label: 'Num Fid',
          data: numFidData,
        }
      ],
    };
  }

  renderChart() {
    const chartData = this.prepareChartData();
    return (
      <Line data={chartData}  height={200} />
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
