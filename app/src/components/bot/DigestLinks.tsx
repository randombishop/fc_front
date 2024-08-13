import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";
import ErrorBoundary from '../common/ErrorBoundary';
import "react-farcaster-embed/dist/styles.css";



class DigestLinks extends React.Component<{links: any}> {
  
  render() {
    const links = this.props.links ;
    if (links.length === 0) {
      return null ;
    }
    return (
      <React.Fragment>
        {links.map((link: any, index: number) => (
          <Grid item xs={4} key={index}>
            <Typography>{link.comment}</Typography>
            <Box sx={{backgroundColor: 'white',
                      color: 'black',
                      fontFamily: 'system-ui',
                      borderRadius: '20px',
                      marginTop: '20px'}}>
              <ErrorBoundary>
                <FarcasterEmbed username={link.user_name} hash={'0x'+link.id} />
              </ErrorBoundary>
            </Box>
          </Grid>
        ))}
      </React.Fragment>
    );
  }
}

export default DigestLinks;
