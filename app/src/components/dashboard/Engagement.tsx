import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

import { getBackendUrl, fontFamily, colors, hexToRGBA } from '../../utils';
import Panel from '../common/Panel'; 
import Loading from '../common/Loading';


class Engagement extends React.Component<{}, { data: any[] }> {

  constructor(props: {}) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    fetch(`${getBackendUrl()}/dashboard/engagement`)
      .then(response => response.json())
      .then(data => this.setState({ data }))
      .catch(error => console.error('Error:' + error));
  }

  prepareChartData() {
    if (this.state.data.length === 0) throw new Error('No data');
    this.state.data.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
    const labels = this.state.data.map(item => item.day.slice(0, 10)) ;
    const num_likes = this.state.data.map(item => item.num_likes);
    const num_recasts = this.state.data.map(item => item.num_recasts);
    const num_replies = this.state.data.map(item => item.num_replies);
    return {
      labels,
      datasets: [
        {
          label: 'Likes',
          data: num_likes,
          borderColor: colors.primary,
          backgroundColor: hexToRGBA(colors.primary, 0.5),
          tension: 0.3,
          pointRadius: 0
        },
        {
          label: 'Recasts',
          data: num_recasts,
          borderColor: colors.secondary,
          backgroundColor: hexToRGBA(colors.secondary, 0.5),
          tension: 0.3,
          pointRadius: 0
        },
        {
          label: 'Replies',
          data: num_replies,
          borderColor: colors.third,
          backgroundColor: hexToRGBA(colors.third, 0.5),
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
          text: 'Average 36-hours reaction count per cast',
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
        y: {
            title: {
              display: true,
              text: 'Count per cast'
            },
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
      <Panel title="Engagement">
        {this.state.data.length > 0 ? this.renderChart() : <Loading />}
      </Panel>
    );
  }

}

export default Engagement;
