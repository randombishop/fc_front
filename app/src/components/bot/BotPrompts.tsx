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
import { AppContext } from '../../AppContext';
import Loading from '../common/Loading';
import HelpBox from './tabs/HelpBox';
import RequireSignIn from '../common/RequireSignIn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PromptEditor from './PromptEditor';
import AddIcon from '@mui/icons-material/Add';

interface ChannelInfo {
  id: string;
  name: string;
}

interface Prompt {
  id: string;
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

  deletePrompt = (promptId: string) => {
    const context: any = this.context;
    this.setState({ saving: true }, () => {
      context.backendPOST('/bot/delete_prompt', promptId, (data: any) => {
        if (data.error) {
          context.newAlert({type: 'error', message: data.error});
        } else {
          this.setState({ 
            prompts: data.prompts,
            saving: false
          });
          context.newAlert({type: 'success', message: 'Prompt deleted'});
        }
      });
    });
  }

  handleEdit = (prompt: Prompt) => {
    this.setState({ editingPrompt: prompt });
  };

  handleClose = () => {
    this.setState({ editingPrompt: null });
    this.loadPrompts(); // Refresh the list
  };

  handleNew = () => {
    const newPrompt: Prompt = {
      id: '', // Will be assigned by backend
      name: '',
      min_hours: 24,
      min_activity: 1,
      channel: '',
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
                      <IconButton edge="end" onClick={() => this.deletePrompt(prompt.id)}>
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
