import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

import { dateYYYY_MM_DD, getBackendUrl, fontFamily, colors, hexToRGBA } from '../../utils';
import Panel from '../common/Panel'; 
import Loading from '../common/Loading';


class Quality extends React.Component<{}, { data: any[] }> {

  constructor(props: {}) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    fetch(`${getBackendUrl()}/dashboard/quality`)
      .then(response => response.json())
      .then(data => this.setState({ data }))
      .catch(error => alert('Error:' + error));
  }

  prepareChartData() {
    if (this.state.data.length === 0) throw new Error('No data');
    this.state.data.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
    const labels = this.state.data.map(item => dateYYYY_MM_DD(new Date(item.day))) ;
    const values = this.state.data.map(item => item.predict_like);
    return {
      labels,
      datasets: [
        {
          label: 'Likemeter Score',
          data: values,
          borderColor: colors.primary,
          backgroundColor: hexToRGBA(colors.primary, 0.5),
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
          text: 'Daily average outputs from like-prediction model applied to casts',
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
              text: 'Like-meter'
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
      <Panel title="Quality">
        {this.state.data.length > 0 ? this.renderChart() : <Loading />}
      </Panel>
    );
  }

}

export default Quality;
