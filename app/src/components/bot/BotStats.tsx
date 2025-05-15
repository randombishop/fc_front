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
  Tooltip,
  Link,
  IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { AppContext } from '../../AppContext';
import Loading from '../common/Loading';
import RequireSignIn from '../common/RequireSignIn';
import { convertDateToTimeAgo } from '../../utils';


class BotStats1 extends React.Component {
  static contextType = AppContext;

  state = {
    user: null as any | null,
    stats: null as any[] | null,
    casts: null as any | null
  };

  componentDidMount = () => {
    this.loadUserData();
    this.loadStats();
    this.loadCasts();
  }

  loadUserData = () => {
    const context:any = this.context ;
    context.backendGET('/profile/current_user', (data: any) => {
      this.setState({ user: data });
    });
  }

  loadStats() {
    const context:any = this.context;
    context.backendGET('/bot/stats', (data: any) => {
      this.setState({ stats: data });
    });
  }

  loadCasts() {
    const context:any = this.context;
    context.backendGET('/bot/casts', (data: any) => {
      const casts_map:any = {};
      for (const cast of data) {
        const prompt_id = cast.action_id;
        const channel_id = cast.action_channel;
        const cast_key = prompt_id + '/' + channel_id;
        if (!casts_map[cast_key]) {
          casts_map[cast_key] = []
        }
        casts_map[cast_key].push(cast);
      }
      for (const k in casts_map) {
        casts_map[k].sort((a:any, b:any) => new Date(b.casted_at).getTime() - new Date(a.casted_at).getTime());
      }
      this.setState({ casts: casts_map });
    });
  }

  toggleShowChildren = (row: any) => () => {
    if (!this.state.stats) return ;
    row.showChildren = !row.showChildren ;
    const stats:any = [...this.state.stats] ;
    this.setState({ stats: stats });
  }

  renderPromptRow = (key: number, row: any) => {
    return (
      <TableRow key={key}>
        <TableCell>
          <IconButton onClick={this.toggleShowChildren(row)}>
            {row.showChildren ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.prompt}</TableCell>
        <TableCell>{row.channel}</TableCell>
        <TableCell align="right">{row.num_threads ? Number(row.num_threads).toFixed(1) : null}</TableCell>
        <TableCell align="right">{row.num_casts ? Number(row.num_casts).toFixed(1) : null}</TableCell>
        <TableCell align="right">{row.num_replies ? Number(row.num_replies).toFixed(1) : null}</TableCell>
        <TableCell align="right">{row.num_likes ? Number(row.num_likes).toFixed(1) : null}</TableCell>
        <TableCell align="right">{row.num_recasts ? Number(row.num_recasts).toFixed(1) : null}</TableCell>
        <TableCell align="right">{row.engagement ? Number(row.engagement).toFixed(1) : null}</TableCell>
      </TableRow>
    )
  }

  renderCastRow = (key: number, row: any) => {
    const userName = this.state.user?.user_name ;
    const timeAgo = convertDateToTimeAgo(row.casted_at);
    const href = `https://warpcast.com/${userName}/0x${row.cast_hash.slice(0, 8)}`;
    return (
      <TableRow key={key}>
        <TableCell colSpan={5} align="right"><Link target="_blank" href={href}>Posted {timeAgo}</Link></TableCell>
        <TableCell align="right">{row.num_replies ? Number(row.num_replies).toFixed(1) : null}</TableCell>
        <TableCell align="right">{row.num_likes ? Number(row.num_likes).toFixed(1) : null}</TableCell>
        <TableCell align="right">{row.num_recasts ? Number(row.num_recasts).toFixed(1) : null}</TableCell>
        <TableCell align="right">{row.engagement ? Number(row.engagement).toFixed(1) : null}</TableCell>
      </TableRow>
    )
  }

  renderRows = () => {
    const { stats, casts } = this.state;
    if (!stats) return null;
    const ans:any[] = [] ;
    let key:number = 0 ;
    for (const prompt of stats) {
      ans.push(this.renderPromptRow(key, prompt));
      key += 1 ;
      const cast_key = `${prompt.id}/${prompt.channel}`;
      const cast_list = casts ? casts[cast_key] : null;
      if (prompt.showChildren && cast_list && cast_list.length > 0) {
        for (const cast of cast_list) {
          ans.push(this.renderCastRow(key, cast));
          key += 1 ;
        }
      }
    }
    return ans ;
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
                <TableCell> </TableCell>
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
              {this.renderRows()}
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
