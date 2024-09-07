import React from 'react';
import { Line } from 'react-chartjs-2';
import Panel from '../common/Panel'; 
import { fontFamily, lightColors, darkColors, colors, hexToRGBA } from '../../utils';


class UserFollowers extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data || !data.features || !data.followers) {
      return null ;
    }
    const num_followers = data.features.followers_num ;
    const deltas = data.followers.sort((a: any, b: any) => b.day.localeCompare(a.day));
    const labels = [];
    const followers = [] ;
    const followers_add = [] ;
    const followers_del = [] ;
    let followers_day = num_followers ;
    for (const delta of deltas) {
      labels.push(delta.day) ;
      followers.push(followers_day) ;
      followers_add.push(delta.links_add) ;
      followers_del.push(-delta.links_del) ;
      followers_day -= (delta.links_add - delta.links_del) ;
      if (followers_day < 0) {
        followers_day = 0 ;
      }
    }
    labels.reverse() ;
    followers.reverse() ;
    followers_add.reverse() ;
    followers_del.reverse() ;
    const max_followers_add = Math.max(...followers_add)*10 ;
    const min_followers_del = Math.min(...followers_del)*10 ;
    const chartData:any = {
      labels,
      datasets: [
        {
          label: 'Followers Added',
          data: followers_add,
          backgroundColor: lightColors[0],
          borderColor: darkColors[0],
          yAxisID: 'y2', 
          type: 'bar'
        },
        {
          label: 'Followers Dropped',
          data: followers_del,
          backgroundColor: lightColors[1],
          borderColor: darkColors[1],
          yAxisID: 'y2', 
          type: 'bar'
        },
        {
          label: 'Followers',
          data: followers,
          borderColor: colors.primary,
          backgroundColor: hexToRGBA(colors.primary, 0.5),
          yAxisID: 'y1', 
          type: 'line'
        }
      ],
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Followers 30-day chart',
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
        y2: {
            position: 'right' as const,
            ticks: {
              display: false,
              stepSize: max_followers_add
            },
            grid: {
              display: true
            },
            min: min_followers_del,
            max: max_followers_add
        },
        y1: {
            position: 'left' as const,
            grid: {
              drawOnChartArea: true,
              color: 'darkgray'
            }
        }
      }
    };
    console.log(labels, followers_add, followers_del, followers, num_followers) ;
    return (
      <Panel title="Followers">
        <Line data={chartData} 
            options={options} 
            height={200}      
        />
      </Panel>
    );
  }

}

export default UserFollowers;