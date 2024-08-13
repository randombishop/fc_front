import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';


class DigestCard extends React.Component<{data: any}> {
  
  render() {
    const data = this.props.data ;
    const title: string = data.title ;
    const summary: string[] = data.summary ;
    return (
      <Card>
          <CardContent>

            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            
            {summary.map((paragraph, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                {paragraph}
              </Typography>
            ))}

          </CardContent>
      </Card>
    );
  }
}

export default DigestCard;
