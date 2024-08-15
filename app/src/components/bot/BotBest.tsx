import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";
import ErrorBoundary from '../common/ErrorBoundary';
import "react-farcaster-embed/dist/styles.css";


class BotDigest extends React.Component<{result:any}> {
  
  render() {
    const data = this.props.result ;
    const comment: string = data.comment ;
    return (
      <Grid container spacing={3}>

        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Best Cast!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                  {comment}
              </Typography>    
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{backgroundColor: 'white',
                      color: 'black',
                      fontFamily: 'system-ui',
                      borderRadius: '20px'}}>
              <ErrorBoundary>
                <FarcasterEmbed username={data.user_name} hash={'0x'+data.id} />
              </ErrorBoundary>
          </Box>
        </Grid>

      </Grid>
    );
  }
  
}

export default BotDigest;
