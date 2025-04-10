import React from 'react';
import { 
  Container, 
  Box, 
  Stack,
  IconButton,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AppContext } from '../../AppContext';
import Loading from '../common/Loading';
import HelpBox from './tabs/HelpBox';
import RequireSignIn from '../common/RequireSignIn';
import PromptEditor from './PromptEditor';


interface ChannelInfo {
  id: string;
  name: string;
}

interface Prompt {
  id: string | null;
  name: string;
  min_hours: number;
  min_activity: number;
  channel: string;
  prompt: string;
}

class BotPrompts1 extends React.Component {
  static contextType = AppContext;

  state = {
    channels: null as ChannelInfo[] | null,
    prompts: null as Prompt[] | null,
    editingPrompt: null as Prompt | null,
    saving: false
  };

  componentDidMount = () => {
    this.loadCatalog();
    this.loadPrompts();
  }

  loadCatalog() {
    const context:any = this.context;
    context.backendGET('/channels/list', (data: ChannelInfo[]) => {
      this.setState({ channels: data });
    });
  }

  loadPrompts = () => {
    const context: any = this.context;
    context.backendGET('/bot/prompts', (data: Prompt[]) => {
      this.setState({ 
        prompts: data,
      });
    });
  }

  deletePrompt = (prompt: any) => {
    const promptId = prompt.id;
    if (!promptId) return;
    const newPrompts = this.state.prompts?.filter((p: Prompt) => p.id !== promptId);
    const context: any = this.context;
    this.setState({ prompts: newPrompts, saving: true }, () => {
      context.backendPOST('/bot/prompt/delete', {prompt_id: promptId}, (data: any) => {
        if (data.error) {
          context.newAlert({type: 'error', message: data.error});
        } else {
          context.newAlert({type: 'success', message: 'Prompt deleted'});
          this.loadPrompts();
        }
      });
    });
  }

  handleEdit = (prompt: Prompt) => {
    this.setState({ editingPrompt: prompt });
  };

  handleClose = () => {
    this.setState({ editingPrompt: null });
    this.loadPrompts();
  };

  handleNew = () => {
    const newPrompt: Prompt = {
      id: null,
      name: '',
      min_hours: 24,
      min_activity: 10,
      channel: '#Autopilot#',
      prompt: ''
    };
    this.setState({ editingPrompt: newPrompt });
  };

  renderList = () => {
    const { prompts, channels } = this.state;
    if (!prompts || !channels) return null;
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <HelpBox title="Bot Prompts" content="Create the instructions for your bot to post in the selected channels." />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={this.handleNew}
            >
              New Prompt
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Tooltip title="Short name to reference a prompt">
                      <Typography>Name</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="The channel where this prompt will be used. Autopilot means the bot will automatically select a channel.">
                      <Typography>Channel</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Minimum hours that must pass before a prompt can be used again">
                      <Typography>Min Hours</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Minimum number of casts in the channel before this prompt can be used again">
                      <Typography>Min Activity</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prompts.map((prompt: Prompt) => (
                  <TableRow key={prompt.id}>
                    <TableCell>{prompt.name}</TableCell>
                    <TableCell>
                      {prompt.channel === '#Autopilot#' ? 'Autopilot' : 
                        channels.find(c => c.id === prompt.channel)?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>{prompt.min_hours}</TableCell>
                    <TableCell>{prompt.min_activity}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => this.handleEdit(prompt)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => this.deletePrompt(prompt)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    );
  };

  renderPage = () => {
    const { prompts, channels, editingPrompt } = this.state;
    if (!prompts || !channels) {
      return <Loading />;
    }
    if (editingPrompt) {
      return (
        <PromptEditor
          prompt={editingPrompt}
          channels={channels}
          onClose={this.handleClose}
          isNew={!editingPrompt.id}
        />
      );
    }
    return this.renderList();
  }

  render() {
    return (
      <Container>
        {this.renderPage()}
      </Container>
    );
  }
}

const BotPrompts = () => {
  return RequireSignIn(<BotPrompts1 />);
};

export default BotPrompts;
