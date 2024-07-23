import React from 'react';
import { Grid, TextField } from '@mui/material';
import ScoreGauge from '../common/ScoreGauge';
import Panel from '../common/Panel'; 
import ChartExplain from './ChartExplain';
import LikeMeterCandidateList from './LikeMeterCandidateList';
import { birdScoreThresholds } from '../../utils';




class LikeMeterResult extends React.Component<{ task: any }> {
  

  render() {
    const task = this.props.task ;
    const score = task.result.score ;
    let scoreLabel = 'Good! 😍'
    if (score < birdScoreThresholds.scoreLow) {
      scoreLabel = 'Low 😔'
    } else if (score < birdScoreThresholds.scoreMedium) {
      scoreLabel = 'Medium 😐'
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TextField 
            label="Analyzed Cast Text"
            value={task.result.text}
            InputProps={{
              style: {height: 125}
            }}
            multiline
            maxRows={5}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Score"
            value={scoreLabel}
            InputProps={{
              style: {height: 125, fontSize: '32px', fontWeight: 'bold'},
              startAdornment: (
                <ScoreGauge value={score} 
                      text={''+score}
                      valueRed={birdScoreThresholds.scoreLow}
                      valueOrange={birdScoreThresholds.scoreMedium}
                      valueMax={birdScoreThresholds.scoreMax}
                      size={100} />
              )
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Panel title="Explain">
            <ChartExplain data={task.result} />
          </Panel>
        </Grid>
        <Grid item xs={12} md={6}>
          <Panel title="Improve">
            <LikeMeterCandidateList data={task.result} />
          </Panel>
        </Grid>
      </Grid>
    );
  }
}

export default LikeMeterResult;
