import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

import { getBackendUrl, fontFamily, castCategories, pieChartPalette, hexToRGBA } from '../../utils';
import Panel from '../common/Panel'; 
import Loading from '../common/Loading';


class Content extends React.Component<{}, { data: any[] }> {

  constructor(props: {}) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    fetch(`${getBackendUrl()}/dashboard/categories`)
      .then(response => response.json())
      .then(data => this.setState({ data }))
      .catch(error => alert('Error:' + error));
  }

  prepareChartData() {
    if (this.state.data.length === 0) throw new Error('No data');
    const array = Object.entries(this.state.data[0]).filter(([key, value]) => castCategories[key]) ;
    array.sort((a, b) => (Number(b[1]) - Number(a[1]))) ;
    const labels = array.map(([key, value]) => castCategories[key]) ;
    const values = array.map(([key, value]) => value) ;
    const colors = pieChartPalette.slice(0, values.length) ;
    const colors2 = colors.map(c => hexToRGBA(c, 0.5)) ;
    return {
      labels: labels,
      datasets: [
        {
          label: 'Cast Categories',
          data: values,
          backgroundColor: colors,
          borderColor: colors2,        
        }
      ]
    };
  }

  renderChart() {
    const chartData = this.prepareChartData();
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Cast categories observed on July 16 2024',
          font: {
            family: fontFamily
          }
        }
      }
    };
    return (
      <Pie data={chartData} 
           options={options} 
      />
    ) ;
  }

  render() {
    return (
      <Panel title="Content">
        {this.state.data.length > 0 ? this.renderChart() : <Loading />}
      </Panel>
    );
  }

}

export default Content;