import React from 'react';
import { Container, Box } from '@mui/material';
import { colors } from '../../utils' ;
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";
import ErrorBoundary from '../common/ErrorBoundary';
import "react-farcaster-embed/dist/styles.css";



class DigestCardLinks extends React.Component<{links: any}> {
  
  render() {
    const links = this.props.links ;
    if (links.length === 0) {
      return null ;
    }
    return (
      <Container style={{ position: 'relative', 
                          width: '100%', 
                          padding: '20px',
                          backgroundColor: colors.dark
                        }}>

        {links.map((link: any, index: number) => (
          <Box key={index} 
               sx={{  backgroundColor: 'white',
                      color: 'black',
                      fontFamily: 'system-ui',
                      borderRadius: '20px',
                      marginBottom: '20px'  }}>
            <ErrorBoundary>
                <FarcasterEmbed username={link.user} hash={link.hash} />
            </ErrorBoundary>
          </Box>
        ))}

    </Container>
    );
  }
}

export default DigestCardLinks;
