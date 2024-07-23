import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';


class ScoreGauge extends React.Component<{ value: number, 
                                           text: string,
                                           size: number,
                                           valueRed: number,
                                           valueOrange: number,
                                           valueMax: number
                                        }> {


  render() {
    const { value, text, size, valueRed, valueOrange, valueMax } = this.props;
    let valueNormalized = 100 * value / valueMax ;
    if (valueNormalized < 0) {
      valueNormalized = 0;
    } else if (valueNormalized > 100) {
      valueNormalized = 100;
    }
    let color = 'lightgreen';
    if (value < valueRed) {
      color = 'palevioletred';
    } else if (value < valueOrange) {
      color = 'orange';
    }
    return (
      <Box
        position="relative"
        display="inline-flex"
        justifyContent="center"
        alignItems="center"
        width={size}
        height={size}
      >

        <CircularProgress
          variant="determinate"
          value={valueNormalized}
          size={size-20}
          thickness={5}
          sx={{
            color: color,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />

        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            color: color,
          }}
        >
          <Typography component="div" style={{ fontSize: 24, fontWeight: 'bold', color: color }}>
            {text}
          </Typography>
        </Box>

      </Box>
    );
  }
}

export default ScoreGauge;