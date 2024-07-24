import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

import { dateYYYY_MM_DD,getBackendUrl, fontFamily, colors, hexToRGBA } from '../../utils';
import Panel from '../common/Panel'; 
import Loading from '../common/Loading';


class Sentiment extends React.Component<{}, { data: any[] }> {

  constructor(props: {}) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    fetch(`${getBackendUrl()}/dashboard/sentiment`)
      .then(response => response.json())
      .then(data => this.setState({ data }))
      .catch(error => alert('Error:' + error));
  }

  prepareChartData() {
    if (this.state.data.length === 0) throw new Error('No data');
    this.state.data.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
    const labels = this.state.data.map(item => dateYYYY_MM_DD(new Date(item.day)));
    const happy = this.state.data.map(item => item.q_happiness);
    const funny = this.state.data.map(item => item.q_funny);
    const info = this.state.data.map(item => item.q_info);
    return {
      labels,
      datasets: [
        {
          label: 'Happy',
          data: happy,
          borderColor: colors.primary,
          backgroundColor: hexToRGBA(colors.primary, 0.5),
          tension: 0.3,
          pointRadius: 0
        },
        {
          label: 'Funny',
          data: funny,
          borderColor: colors.secondary,
          backgroundColor: hexToRGBA(colors.secondary, 0.5),
          tension: 0.3,
          pointRadius: 0
        },
        {
          label: 'Informational',
          data: info,
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
          text: 'Daily average outputs from qualitative model applied to casts',
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
              text: 'Model outputs'
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
      <Panel title="Sentiment">
        {this.state.data.length > 0 ? this.renderChart() : <Loading />}
      </Panel>
    );
  }

}

export default Sentiment;
