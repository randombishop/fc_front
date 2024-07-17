import React from 'react';
import { Typography, Box } from '@mui/material';

interface TerminalWindowProps {
  title: string;
  children: React.ReactNode;
}

class TerminalWindow extends React.Component<TerminalWindowProps> {
  render() {
    const { title, children } = this.props;

    return (
      <Box
        sx={{
          backgroundColor: 'aliceblue', 
          border: '2px solid #808080', 
          fontFamily: '"Courier New", Courier, monospace',
          maxWidth: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#808080',
            color: '#ffffff', 
            borderBottom: '1px solid white', 
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px'
          }}
        >
          <Typography style={{fontSize: '1rem', fontWeight: 'bold'}}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ padding: 4 }}>
            {children}
        </Box>
      </Box>
    );
  }
}

export default TerminalWindow;
