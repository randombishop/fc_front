import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Button, Typography, MobileStepper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { banners } from '../../utils';


class DigestCard extends React.Component<{data: any}> {
  
  render() {
    const data = this.props.data ;
    const key: string = data.key ;
    const banner = banners[key] ;
    const title: string = data.title ;
    const summary: string[] = data.summary.split('. ') ;
    return (
      <Card style={{marginBottom: '30px'}}>
          <CardMedia
            component="img"
            alt={data.key}
            width="100%"
            image={banner}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {summary.map((paragraph, index) => (
                <span key={index}>
                  {paragraph} <br/><br/>
                </span>
              ))}
            </Typography>
          </CardContent>
          <CardActions>
            <MobileStepper
              variant="dots"
              style={{ width: '100%' }}
              steps={6}
              position="static"
              activeStep={3}
              nextButton={
                <Button size="small"  disabled={true}>
                  Next
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button size="small"  disabled={false}>
                  <KeyboardArrowLeft />
                  Back
                </Button>
              }
            />
          </CardActions>
        </Card>
      
    );
  }
}

export default DigestCard;
