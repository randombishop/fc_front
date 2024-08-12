import React from 'react';
import 'chart.js/auto';
import { Radar } from 'react-chartjs-2';
import { fontFamily, getColorForArray, hexToRGBA } from '../../utils';


class TrendFeaturesRadar extends React.Component<{ items: string[], data: any }> {

  prepareChartData() {
    const labels = [
      'Casts/UniqueFID',
      'Followers',
      'Following',
      'Likes',
      'Recasts',
      'Replies',
      'Happy',
      'Funny',
      'Informative',
      'Likemeter'
    ] ;
    const fields: { [key: string]: string } = {
      'Casts/UniqueFID': 'casts_per_fid',
      'Followers': 'num_follower',
      'Following': 'num_following',
      'Likes': 'num_like',
      'Recasts': 'num_recast',
      'Replies': 'num_reply',
      'Happy': 'q_happiness',
      'Funny': 'q_funny',
      'Informative': 'q_info',
      'Likemeter': 'predict_like'
    }
    const lightColorsArray = getColorForArray('light', this.props.items.length) ;
    const darkColorsArray = getColorForArray('dark', this.props.items.length) ;
    const datasets = [] ;
    for (let i=0; i<this.props.items.length; i++) {
      try {
        const item = this.props.items[i] ;
        const num = this.props.data[item].data.global.num_casts ;
        if ( num > 0 ) {
          const values = [] ;
          for (const label of labels) {
            const field = fields[label] ;
            const value = this.props.data[item].data.global[field] ;
            values.push(Number(value)) ;
          }
          datasets.push({
            label: item,
            data: values,
            rawData: values.slice(),
            borderColor: lightColorsArray[i],
            backgroundColor: hexToRGBA(darkColorsArray[i], 0.25)
          })
        }
      } catch (e) {}
    }
    for (let i=0; i<labels.length; i++) {
      const labelValues = datasets.map((d) => d.data[i]) ;
      const maxValue = Math.max(...labelValues) ;
      for (const d of datasets) {
        d.data[i] = d.data[i] / maxValue ;
      }
    }
    const data = {
      labels,
      datasets
    };
    return data;
  }
  
  tooltip(tooltipItem: any) {
    const datasetIndex = tooltipItem.datasetIndex;
    const dataIndex = tooltipItem.dataIndex;
    const value = tooltipItem.chart.data.datasets[datasetIndex].rawData[dataIndex] ;
    return value.toFixed(2) ;
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
          text: 'Casts Features Radar',
          font: {
            family: fontFamily
          }
        },
        tooltip: {
          callbacks: {
            label: this.tooltip
          },
        }
      },
      elements: {
        line: {
          borderWidth: 3
        }
      },
      scales: {
        r: {
            ticks: {
              display: false
            },
            suggestedMin: 0,
            suggestedMax: 1
        }
      }
    };
    return (
      <Radar data={chartData} 
           options={options} 
           height={300}
      />
    );
  }

}

export default TrendFeaturesRadar;
