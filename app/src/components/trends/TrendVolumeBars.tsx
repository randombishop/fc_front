import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

import { fontFamily, getPieChartPaletteForArray, hexToRGBA } from '../../utils';



class TrendVolumeBars extends React.Component<{ items: string[], data: any }> {

  prepareChartData() {
    const labels = [] ;
    const values = [] ;
    for (const item of this.props.items) {
      try {
        const num = this.props.data[item].data.global.num_casts ;
        if (num > 0) {
          labels.push(item) ;
          values.push(num) ;
        }
      } catch (e) {}
    }
    const colors = getPieChartPaletteForArray(values.length) ;
    const colors2 = colors.map(c => hexToRGBA(c, 0.5)) ;
    return {
      labels: labels,
      datasets: [
        {
          label: 'Number of casts',
          data: values,
          backgroundColor: colors,
          borderColor: colors2,        
        }
      ]
    };
  }

  render() {
    const chartData = this.prepareChartData();
    if (chartData.labels.length === 0) {
      return null ;
    }
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Number of observations by item',
          font: {
            family: fontFamily
          }
        },
        legend: {
          display: false,
        }
      }
    };
    return (
      <Bar data={chartData} 
           options={options} 
      />
    ) ;
  }

}

export default TrendVolumeBars;
