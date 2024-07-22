import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { banners } from '../../utils';
import DigestCardLinks from './DigestCardLinks';


class DigestCard extends React.Component<{data: any}, {expanded: boolean}> {
  
  state = {
    expanded: false
  }

  renderExpandButton() {
    return (
      <IconButton onClick={() => this.setState({expanded: !this.state.expanded})}>
        {this.state.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    )
  }

  render() {
    const data = this.props.data ;
    const key: string = data.key ;
    const banner = banners[key] ;
    const title: string = data.title ;
    const summary: string[] = data.summary.split('. ') ;
    const links = data.links ;
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
            {this.renderExpandButton()}
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <DigestCardLinks links={links} />
          </Collapse>
        </Card>
      
    );
  }
}

export default DigestCard;
