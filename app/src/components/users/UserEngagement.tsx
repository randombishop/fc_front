import React from 'react';
import { FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { Line } from 'react-chartjs-2';
import Panel from '../common/Panel'; 
import { fontFamily, colors, hexToRGBA } from '../../utils';


class UserEngagement extends React.Component< {data: any}> {
  
  state = {
    mode: 'total'
  }

  render() {
    const data = this.props.data ;
    if (!data || !data.engagement) {
      return null ;
    }
    const mode = this.state.mode ;
    const labels = data.engagement.map((item:any) => item.day) ;
    const likes = data.engagement.map((item:any) => mode==='total' ? item.likes_num : item.likes_ufids) ;
    const recasts = data.engagement.map((item:any) => mode==='total' ? item.recasts_num : item.recasts_ufids) ;
    const replies = data.engagement.map((item:any) => mode==='total' ? item.replies_num : item.replies_ufids) ;
    const chartData:any = {
      labels,
      datasets: [
        {
          label: 'Recasts',
          data: recasts,
          borderColor: colors.primary,
          backgroundColor: hexToRGBA(colors.primary, 0.5)
        },
        {
          label: 'Likes',
          data: likes,
          borderColor: colors.secondary,
          backgroundColor: hexToRGBA(colors.secondary, 0.5)
        },
        {
          label: 'Replies',
          data: replies,
          borderColor: colors.third,
          backgroundColor: hexToRGBA(colors.third, 0.5)
        }
      ]
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Daily engagement received ('+(mode==='total' ? 'Total reactions' : 'Unique Users')+')',
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
      <Panel title="Engagement Received">
        <FormControl>
          <RadioGroup
            row
            aria-label="engagement-view"
            name="engagement-view"
            value={this.state.mode}
            onChange={(e) => this.setState({ mode: e.target.value })}
          >
            <FormControlLabel value="total" control={<Radio />} label="Total Reactions" />
            <FormControlLabel value="unique" control={<Radio />} label="Unique Users" />
          </RadioGroup>
        </FormControl>
        <Line data={chartData} 
            options={options} 
            height='200px'      
        />
      </Panel>
    );
  }

}

export default UserEngagement;