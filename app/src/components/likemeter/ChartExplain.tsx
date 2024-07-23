import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

import { featureTranslation, fontFamily, lightColors, darkColors, hexToRGBA } from '../../utils';



class ChartExplain extends React.Component<{ data: any }> {

  prepareChartData() {
    let data = this.props.data ;
    data.sort((a: any, b: any) => Math.abs(b.effect) - Math.abs(a.effect)) ;
    data = data.slice(0, 7) ;
    const labels = data.map((d: any) => featureTranslation[d.feature]) ;
    const values = data.map((d: any) => d.effect) ;
    const backgroundColors = values.map((v: number) => {
      const c =  v>0 ? darkColors[0] : darkColors[1] ;
      return hexToRGBA(c, 0.5) ;
    }) ;
    const borderColors = values.map((v: number) => {
      return v>0 ? lightColors[0] : lightColors[1] ;
    }) ;
    const chartData = {
      labels: labels,
      datasets: [{
        axis: 'y',
        label: 'Effects',
        data: values,
        fill: false,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    };
    return chartData ;
  }

  render() {
    const chartData = this.prepareChartData();
    if (chartData.labels.length === 0) {
      return null ;
    }
    const options = {
      indexAxis: 'y' as const,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Effects of model features on the prediction',
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

export default ChartExplain;
