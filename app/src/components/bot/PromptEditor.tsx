import React from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Paper
} from '@mui/material';
import { AppContext } from '../../AppContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


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

interface PromptEditorProps {
  prompt: Prompt;
  channels: ChannelInfo[];
  onClose: () => void;
  isNew: boolean;
}

interface PromptEditorState {
  editedPrompt: Prompt;
  saving: boolean;
}

class PromptEditor extends React.Component<PromptEditorProps, PromptEditorState> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: PromptEditorProps) {
    super(props);
    this.state = {
      editedPrompt: { ...props.prompt },
      saving: false
    };
  }

  handleChange = (field: keyof Prompt) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(prevState => ({
      editedPrompt: {
        ...prevState.editedPrompt,
        [field]: event.target.value
      }
    }));
  };

  handleSave = () => {
    this.setState({ saving: true });
    const endpoint = this.props.isNew ? '/bot/create_prompt' : '/bot/update_prompt';
    this.context.backendPOST(endpoint, this.state.editedPrompt, (data: any) => {
      this.setState({ saving: false });
      if (data.error) {
        this.context.newAlert({type: 'error', message: data.error});
      } else {
        this.context.newAlert({
          type: 'success', 
          message: `Prompt ${this.props.isNew ? 'created' : 'updated'} successfully`
        });
        this.props.onClose();
      }
    });
  };

  render() {
    const { channels, onClose, isNew } = this.props;
    const { editedPrompt, saving } = this.state;
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onClose} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {isNew ? 'Create New Prompt' : 'Edit Prompt'}
          </Typography>
        </Box>

        <Paper elevation={2}>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              value={editedPrompt.name}
              onChange={this.handleChange('name')}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Channel</InputLabel>
              <Select
                value={editedPrompt.channel}
                onChange={(e) => this.setState(prevState => ({
                  editedPrompt: {
                    ...prevState.editedPrompt,
                    channel: e.target.value
                  }
                }))}
                label="Channel"
              >
                <MenuItem value="#Autopilot#">Autopilot</MenuItem>
                {channels.map(channel => (
                  <MenuItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Minimum Hours"
              type="number"
              value={editedPrompt.min_hours}
              onChange={this.handleChange('min_hours')}
              fullWidth
            />

            <TextField
              label="Minimum Activity"
              type="number"
              value={editedPrompt.min_activity}
              onChange={this.handleChange('min_activity')}
              fullWidth
            />

            <TextField
              label="Prompt"
              multiline
              rows={6}
              value={editedPrompt.prompt}
              onChange={this.handleChange('prompt')}
              fullWidth
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={this.handleSave} 
                variant="contained" 
                color="primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : (isNew ? 'Create' : 'Save')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }
}

export default PromptEditor; 