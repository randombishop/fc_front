import React from 'react';
import { TextField } from '@mui/material';
import { birdScoreThresholds } from '../../utils';
import ScoreGauge from '../common/ScoreGauge';


class LikeMeterCandidateList extends React.Component<{ data: any }> {
  
  render() {
    const data = this.props.data ;
    const texts = data.candidates ;
    const scores = data.candidates_scores ;
    const candidates = [] ;
    for (let i=0; i<texts.length; i++) {
      const text = texts[i] ;
      const score = scores[i] ;
      const delta = score - data.score ;
      const deltaText = delta > 0 ? '+' + delta : delta ;
      const deltaColor = delta > 0 ? 'lightgreen' : 'palevioletred' ;
      candidates.push({text, score, delta, deltaText, deltaColor}) ;
    }
    candidates.sort((a: any, b: any) => b.score - a.score) ;
    return (
      <React.Fragment>
        {candidates.map((candidate: any, index: number) => (
          <TextField 
            label="Variation"
            value={candidate.text}
            InputProps={{
              style: {height: 125, marginBottom: '25px'},
              startAdornment: (
                <ScoreGauge value={candidate.score} 
                      text={''+candidate.score}
                      valueRed={birdScoreThresholds.scoreLow}
                      valueOrange={birdScoreThresholds.scoreMedium}
                      valueMax={birdScoreThresholds.scoreMax}
                      size={100} />
              ),
              endAdornment: (
                <div style={{fontSize: '24px', fontWeight: 'bold', color: candidate.deltaColor}}>{candidate.deltaText}</div>  
              )
            }}
            multiline
            maxRows={5}
            fullWidth
          />
        ))}
      </React.Fragment>
    );
  }

}

export default LikeMeterCandidateList;
