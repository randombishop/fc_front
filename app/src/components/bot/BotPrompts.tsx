import React from 'react';
import { 
  Container, 
  Box, 
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
  Button
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
          
          <Paper elevation={2}>
            <List>
              {prompts.map((prompt: Prompt) => (
                <ListItem
                  key={prompt.id}
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" onClick={() => this.handleEdit(prompt)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => this.deletePrompt(prompt)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={prompt.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Channel: {prompt.channel === '#Autopilot#' ? 'Autopilot' : 
                            channels.find(c => c.id === prompt.channel)?.name || 'Unknown'}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Min Hours: {prompt.min_hours} | Min Activity: {prompt.min_activity}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
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
