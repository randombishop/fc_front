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
          backgroundColor: 'aliceblue', // Dark gray background
          border: '2px solid #808080', // Gray border
          fontFamily: '"Courier New", Courier, monospace', // Use monospace font
          color: '#ffffff', // White text color
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
        <Box sx={{ padding: 2 }}>
            {children}
        </Box>
      </Box>
    );
  }
}

export default TerminalWindow;
