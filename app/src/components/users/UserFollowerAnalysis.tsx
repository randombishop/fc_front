import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import Panel from '../common/Panel'; 
import { fontFamily, getAverage, lightColors, darkColors, hexToRGBA } from '../../utils' ;


class UserFollowerAnalysis extends React.Component< {data: any}> {
  
  state = {
    view: 'style'
  }

  renderViewStyle() {
    const sample = this.props.data.followerSample ;
    const global = this.props.data.statsGlobal ;
    const labels = ['Informative', 'Funny', 'Happy'] ;
    const datasets = [] ;
    datasets.push({
      label: 'Followers',
      data: [getAverage(sample, 'prefs_q_info'), getAverage(sample, 'prefs_q_funny'), getAverage(sample, 'prefs_q_happiness')],
      borderColor: hexToRGBA(lightColors[0], 0.5),
      backgroundColor: darkColors[0]
    }) ;
    datasets.push({
      label: 'Global',
      data: [global['prefs_q_info'], global['prefs_q_funny'], global['prefs_q_happiness']],
      borderColor: hexToRGBA(lightColors[1], 0.5),
      backgroundColor: darkColors[1]
    }) ;
    const chartData:any = {
      labels: labels,
      datasets: datasets
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Followers vs Global Benchmark',
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
    );
  }

  renderViewSpaminess() {
    const sample = this.props.data.followerSample ;
    const global = this.props.data.statsGlobal ;
    const labels = ['% of spammy users'] ;
    const datasets = [] ;
    datasets.push({
      label: 'Followers',
      data: [100 * getAverage(sample, 'spam_any_flag')],
      borderColor: hexToRGBA(lightColors[0], 0.5),
      backgroundColor: darkColors[0]
    }) ;
    datasets.push({
      label: 'Global',
      data: [100 * global['spam_any_flag']],
      borderColor: hexToRGBA(lightColors[1], 0.5),
      backgroundColor: darkColors[1]
    }) ;
    const chartData:any = {
      labels: labels,
      datasets: datasets
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Followers vs Global Benchmark',
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
    );
  }

  renderViewActive() {
    const sample = this.props.data.followerSample ;
    const global = this.props.data.statsGlobal ;
    const labels = ['% of active users over last 30 days'] ;
    const datasets = [] ;
    datasets.push({
      label: 'Followers',
      data: [100 * getAverage(sample, 'is_active')],
      borderColor: hexToRGBA(lightColors[0], 0.5),
      backgroundColor: darkColors[0]
    }) ;
    datasets.push({
      label: 'Global',
      data: [100 * global['is_active']],
      borderColor: hexToRGBA(lightColors[1], 0.5),
      backgroundColor: darkColors[1]
    }) ;
    const chartData:any = {
      labels: labels,
      datasets: datasets
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Followers vs Global Benchmark',
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
    );
  }

  renderView() {
    switch (this.state.view) {
      case 'style':
        return this.renderViewStyle() ;
      case 'spaminess':
        return this.renderViewSpaminess() ;
      case 'active':
        return this.renderViewActive() ;
    }
  }

  render() {
    const data = this.props.data ;
    if (!data || !data.followerSample || !data.statsGlobal) {
      return null ;
    }
    return (
      <Panel title="Followers Analysis">
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel id="view-select-label">View</InputLabel>
          <Select
            labelId="view-select-label"
            id="view-select"
            value={this.state.view}
            label="View"
            onChange={(e) => this.setState({ view: e.target.value })}
          >
            <MenuItem value="style">Style</MenuItem>
            <MenuItem value="spaminess">Spam %</MenuItem>
            <MenuItem value="active">Active last 30 days</MenuItem>
          </Select>
        </FormControl>
        {this.renderView()}
      </Panel>
    );
  }

}

export default UserFollowerAnalysis;