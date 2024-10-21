import React from 'react';
import { Box, Button, Alert } from '@mui/material';


const boxStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 1,
    justifyContent: 'right',
    alignItems: 'center',
    padding: '0px 50px 15px 50px',
    borderTop: '2px dashed #333',
    marginTop: '25px'
}

const linkStyle = {
    margin: '0 10px'
}

class Footer extends React.Component {

    openDocumentation() {
        window.open('https://github.com/randombishop/fc_docs', '_blank');
    }

    openContact() {
        window.open('https://warpcast.com/randombishop', '_blank');
    }

    render() {
      return (
        <Box sx={boxStyle}>
            <Alert severity="info">Prototype is still a work in progress. Data is incomplete at this time.</Alert>
            <Button sx={linkStyle} color="inherit" onClick={this.openDocumentation}>Documentation</Button>
            <Button sx={linkStyle} color="inherit" onClick={this.openContact}>@randombishop</Button>
        </Box>
      );
    }

}


export default Footer ;