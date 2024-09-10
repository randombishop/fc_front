import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { colors } from '../../utils';


interface PanelProps {
  title: string;
  backgroundColor?: string;
  children: React.ReactNode;
}

class Panel extends React.Component<PanelProps> {
  
  render() {
    const { title, children, backgroundColor} = this.props;
    return (
      <Paper sx={{borderColor: colors.light, borderWidth: '1px', borderStyle: 'solid', borderRadius: '0px', overflow: 'hidden'}}>
          <Box
            sx={{
              backgroundColor: colors.dark,
              color: colors.light, 
              borderBottom: '1px solid ' + colors.light, 
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px'
            }}
          >
            <Typography style={{fontSize: '1rem', fontWeight: 'bold'}}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ padding: 4, backgroundColor: backgroundColor }}>
            {children}
          </Box>
      </Paper>
    );
  }
}

export default Panel;
