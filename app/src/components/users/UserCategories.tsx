import React from 'react';
import { Bar } from 'react-chartjs-2';
import Panel from '../common/Panel'; 
import { castCategories, fontFamily, lightColors, darkColors, hexToRGBA } from '../../utils';


class UserCategories extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data) {
      return null ;
    }
    const keys = Object.keys(castCategories) ;
    const labels = keys.map(k => castCategories[k]) ;
    const fields = keys.map(k => 'prefs_' + k) ;
    const datasets:any[] = [] ;
    if (data.features && data.features[fields[0]]) {
      datasets.push({
          label: data.info.user_name,
          data: fields.map(f => data.features[f]),
          borderColor: hexToRGBA(lightColors[0], 0.5),
          backgroundColor: darkColors[0]
      }) ;
    }
    if (data.statsFollowers && data.statsFollowers[fields[0]]) {
      datasets.push({
          label: data.info.user_name+ "'s followers",
          data: fields.map(f => data.statsFollowers[f]),
          borderColor: hexToRGBA(lightColors[1], 0.5),
          backgroundColor: darkColors[1]
      }) ;
    }
    if (data.statsFollowing && data.statsFollowing[fields[0]]) {
      datasets.push({
          label: 'Followed by '+data.info.user_name,
          data: fields.map(f => data.statsFollowing[f]),
          borderColor: hexToRGBA(lightColors[2], 0.5),
          backgroundColor: darkColors[2]
      }) ;
    }
    if (data.statsGlobal && data.statsGlobal[fields[0]]) {
      datasets.push({
          label: 'All Users Benchmark',
          data: fields.map(f => data.statsGlobal[f]),
          borderColor: hexToRGBA(lightColors[3], 0.5),
          backgroundColor: darkColors[3]
      }) ;
    }
    const chartData:any = {
      labels: labels,
      datasets: datasets
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Comparison of Categories Preferences',
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
      <Panel title="Categories">
        <Bar data={chartData} 
           options={options} 
           height={300}
        />
      </Panel>
    );
  }

}

export default UserCategories;