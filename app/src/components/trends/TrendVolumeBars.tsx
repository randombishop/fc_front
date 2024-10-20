import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

import { fontFamily, getColorForArray } from '../../utils';



class TrendVolumeBars extends React.Component<{ items: string[], data: any }> {

  prepareChartData() {
    const labels = [] ;
    let values = [] ;
    for (const item of this.props.items) {
      try {
        const num = this.props.data[item].data.global.num_casts ;
        if (num > 0) {
          labels.push(item) ;
          values.push(num) ;
        }
      } catch (e) {}
    }
    return {
      labels: labels,
      datasets: [
        {
          label: 'Number of casts',
          data: values,
          backgroundColor: getColorForArray('dark', values.length),
          borderColor: getColorForArray('dark', values.length)        
        }
      ]
    };
  }

  render() {
    const chartData = this.prepareChartData();
    if (chartData === null || chartData.labels.length === 0) {
      return null ;
    }
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Total number of casts by item',
          font: {
            family: fontFamily
          }
        },
        legend: {
          display: false,
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
              text: 'Number of casts'
            },
            grid: {
              drawOnChartArea: false
            }
        }
      }
    };
    return (
      <Bar data={chartData} 
           options={options} 
           height={400}    
      />
    ) ;
  }

}

export default TrendVolumeBars;
