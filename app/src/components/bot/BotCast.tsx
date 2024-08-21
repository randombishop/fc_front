import React from 'react';
import {Box} from '@mui/material';
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";
import ErrorBoundary from '../common/ErrorBoundary';
import "react-farcaster-embed/dist/styles.css";


class BotCast extends React.Component<{cast:any}> {

  renderText() {
    const cast = this.props.cast ;
    if (cast.text) {
      return (
        <Box sx={{backgroundColor: 'white',
                  color: 'black',
                fontFamily: 'system-ui',
                borderRadius: '20px',
                margin: '20px',
                padding: '20px' }}>
          <pre style={{whiteSpace: 'pre-wrap'}}>
            {cast.text}
          </pre>
        </Box>
      );
    }
  }

  renderEmbeds() {
    const cast = this.props.cast ;
    if (cast && cast.embeds && cast.embeds.length > 0) {
      return (
        cast.embeds.map((embed: any, index: number) => (this.renderEmbed(index, embed)))
      );
    }
  }

  renderEmbed(key: number, embed: any) {
    console.log(embed) ;
    if (embed.user_name && embed.hash) {
      const user = embed.user_name ;
      const hash = '0x'+embed.hash ;
      return (
        <Box key={key} sx={{backgroundColor: 'white',
                  color: 'black',
                  fontFamily: 'system-ui',
                  borderRadius: '20px',
                  margin: '20px',
                  padding: '20px' }}>
          <ErrorBoundary>
            <FarcasterEmbed username={user} hash={hash} />
          </ErrorBoundary>
        </Box>
      ) ;
    } else if (typeof embed === 'string') {
      return (
        <Box key={key} sx={{backgroundColor: 'white',
                  color: 'black',
                  fontFamily: 'system-ui',
                  borderRadius: '20px',
                  margin: '20px',
                  padding: '20px' }}>
          <img src={embed} />
        </Box>
      )
    } else {
      console.warn('Embed is not a string and doesnt have user_name/hash') ;
      return null ;
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.renderText()}
        {this.renderEmbeds()}
      </React.Fragment>
    );
  }
}


export default BotCast ;