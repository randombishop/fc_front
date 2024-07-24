import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

import { fontFamily, getColorForArray, hexToRGBA } from '../../utils';



class TrendVolumeLines extends React.Component<{ items: string[], data: any }> {

  prepareChartData() {
    const validItems:string[] = [] ;
    const days:any = {} ;
    const values:any = {} ;
    const colorsArray = getColorForArray('light', this.props.items.length) ;
    const colorsMap:any = {} ;
    for (let i=0 ; i< this.props.items.length ; i++) {
      try {
        const item = this.props.items[i] ;
        colorsMap[item] = colorsArray[i] ;
        const num_casts = Number(this.props.data[item].data.global.num_casts) ;
        const num_records = this.props.data[item].data.daily.length ;
        if (num_casts > 0 && num_records > 0) {
          validItems.push(item) ;
          values[item] = {} ;
          for (const record of this.props.data[item].data.daily) {
            const day = record.day.slice(0, 10)  ;
            if (!days[day]) {
              days[day] = 0 ;
            }
            days[day] += 1 ;
            values[item][day] = Number(record.num) ;
          }
        }
      } catch (e) {}
    }
    const labels = Object.keys(days).sort((a, b) => a.localeCompare(b)) ;
    const datasets = validItems.map(item => {
      const series = labels.map(day => values[item][day]?values[item][day]:0) ;
      return {
        label: item,
        data: series,
        borderColor: colorsMap[item],
        backgroundColor: hexToRGBA(colorsMap[item], 0.5)
      }
    }) ;      
    const data = {
      labels,
      datasets
    } ;
    return data
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
          text: 'Number of daily casts by item',
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
              text: 'Number of observations / 100k casts'
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

}

export default TrendVolumeLines;
