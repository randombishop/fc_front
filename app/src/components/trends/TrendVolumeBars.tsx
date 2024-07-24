import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

import { fontFamily, getColorForArray, dateYYYY_MM_DD, numDaysBetween } from '../../utils';



class TrendVolumeBars extends React.Component<{ items: string[], data: any }> {

  prepareChartData() {
    const labels = [] ;
    let values = [] ;
    const days:any = {} ;
    for (const item of this.props.items) {
      try {
        const num = Number(this.props.data[item].data.global.num_casts) ;
        if (num > 0) {
          labels.push(item) ;
          values.push(num) ;
          for (const record of this.props.data[item].data.daily) {
            const day = dateYYYY_MM_DD(new Date(record.day))  ;
            if (!days[day]) {
              days[day] = 0 ;
            }
            days[day] += 1 ;
          }
        }
      } catch (e) {}
    }
    const days_range = Object.keys(days).sort() ;
    if (days_range.length === 0) {
      return null ;
    }
    const first_day = days_range[0] ;
    const last_day = days_range[days_range.length-1] ;
    const num_days = numDaysBetween(first_day, last_day) ;
    console.log('Date range', first_day, last_day, num_days) ;
    values = values.map((value) => value / num_days) ;
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
          text: 'Number of observations by item',
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
              text: 'Number of observations / 100k casts'
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
           height={300}
      />
    ) ;
  }

}

export default TrendVolumeBars;
