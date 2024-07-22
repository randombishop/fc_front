import React from 'react';
import 'chart.js/auto';
import { Radar } from 'react-chartjs-2';
import { fontFamily, getColorForArray, hexToRGBA } from '../../utils';


class TrendRadar extends React.Component<{ items: string[], data: any }> {

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
      'Quality'
    ] ;
    const fields: { [key: string]: string } = {
      'Followers': 'num_follower',
      'Following': 'num_following',
      'Likes': 'num_like',
      'Recasts': 'num_recast',
      'Replies': 'num_reply',
      'Happy': 'q_happiness',
      'Funny': 'q_funny',
      'Informative': 'q_info',
      'Quality': 'predict_like'
    }
    const lightColorsArray = getColorForArray('light', this.props.items.length) ;
    const darkColorsArray = getColorForArray('dark', this.props.items.length) ;
    const validItems = [] ;
    const itemValues = [] ;
    const borderColors = [] ;
    const backgroundColors = [] ;
    for (let i=0; i<this.props.items.length; i++) {
      try {
        const item = this.props.items[i] ;
        const num = Number(this.props.data[item].data.global.num_casts) ;
        const fids = Number(this.props.data[item].data.global.num_fids) ;
        if ( num > 0 && fids > 0) {
          const values = [] ;
          for (const label of labels) {
            if (label==='Casts/UniqueFID') {
              const value = num/fids ;
              values.push(value) ;
            } else {
              const field = fields[label] ;
              const value = this.props.data[item].data.global[field] ;
              values.push(Number(value)) ;
            }
          }
          validItems.push(item) ;
          itemValues.push(values) ;
          borderColors.push(lightColorsArray[i]) ;
          backgroundColors.push(hexToRGBA(darkColorsArray[i], 0.2)) ;
        }
      } catch (e) {}
    }
    for (let i=0; i<labels.length; i++) {
      const labelValues = itemValues.map((v) => v[i]) ;
      const maxValue = Math.max(...labelValues) ;
      //console.log('radar data normalization', labels[i], maxValue) ;
      for (let j=0; j<itemValues.length; j++) {
        itemValues[j][i] = itemValues[j][i] / maxValue ;
      }
    }
    const datasets = [] ;
    for (let i=0; i<validItems.length; i++) {
      datasets.push({
        label: validItems[i],
        data: itemValues[i],
        borderColor: borderColors[i],
        backgroundColor: backgroundColors[i]
      })
    }
    const data = {
      labels,
      datasets
    };
    return data;
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
          text: 'Radar Title',
          font: {
            family: fontFamily
          }
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

export default TrendRadar;
