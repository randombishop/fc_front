import React from 'react';
import { 
  Container, 
  Box, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
} from '@mui/material';
import { AppContext } from '../../AppContext';
import Loading from '../common/Loading';
import RequireSignIn from '../common/RequireSignIn';


class BotStats1 extends React.Component {
  static contextType = AppContext;

  state = {
    stats: null as any[] | null
  };

  componentDidMount = () => {
    this.loadStats();
  }

  loadStats() {
    const context:any = this.context;
    context.backendGET('/bot/stats', (data: any) => {
      this.setState({ stats: data });
    });
  }

  renderList = () => {
    const { stats } = this.state;
    if (!stats) return null;
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Bot Stats</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your bot stats are calculated on the first 3 days after posting only.
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Prompt</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell align="right">Threads</TableCell>
                <TableCell align="right">Casts</TableCell>
                <TableCell align="right">Replies</TableCell>
                <TableCell align="right">Likes</TableCell>
                <TableCell align="right">Recasts</TableCell>
                <TableCell align="right">
                  <Tooltip title="Engagement = replies x1 + likes x2 + recasts x3" arrow>
                    <span>Engagement</span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.prompt}</TableCell>
                  <TableCell>{row.channel}</TableCell>
                  <TableCell align="right">{row.num_threads}</TableCell>
                  <TableCell align="right">{row.num_casts}</TableCell>
                  <TableCell align="right">{row.num_replies}</TableCell>
                  <TableCell align="right">{row.num_likes}</TableCell>
                  <TableCell align="right">{row.num_recasts}</TableCell>
                  <TableCell align="right">{row.engagement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  renderPage = () => {
    const { stats } = this.state;
    if (!stats) {
      return <Loading />;
    } else {
      return this.renderList();
    }
  }

  render() {
    return (
      <Container>
        {this.renderPage()}
      </Container>
    );
  }
}

const BotStats = () => {
  return RequireSignIn(<BotStats1 />);
};

export default BotStats;
