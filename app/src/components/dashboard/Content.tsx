import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

import { fontFamily, castCategories, getColorForArray, hexToRGBA } from '../../utils';
import Panel from '../common/Panel'; 
import Loading from '../common/Loading';
import { AppContext } from '../../AppContext';

class Content extends React.Component<{}, { data: any[] }> {

  static contextType = AppContext ;

  constructor(props: {}) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    const context:any = this.context ;
    context.backendGET('/dashboard/categories', (data: any) => {
      this.setState({ data });
    });
  }

  prepareChartData() {
    if (this.state.data.length === 0) throw new Error('No data');
    const array = Object.entries(this.state.data[0]).filter(([key, value]) => castCategories[key]) ;
    array.sort((a, b) => (Number(b[1]) - Number(a[1]))) ;
    const labels = array.map(([key, value]) => castCategories[key]) ;
    const values = array.map(([key, value]) => value) ;
    return {
      labels: labels,
      datasets: [
        {
          label: "Cast Categories",
          data: values,
          backgroundColor: getColorForArray('dark', values.length),
          borderColor: getColorForArray('light', values.length).map(c=>hexToRGBA(c, 0.5)) ,        
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
          text: "Yesterday's Casts Categories",
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
