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


class PromptEditor extends React.Component<any, any> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: any) {
    super(props);
    this.state = {
      editedPrompt: { ...props.prompt },
      saving: false
    };
  }

  handleChange = (field: string) => (event: any) => {
    this.setState((prevState: any) => ({
      editedPrompt: {
        ...prevState.editedPrompt,
        [field]: event.target.value
      }
    }));
  };

  handleSave = () => {
    this.setState({ saving: true }, () => {
      this.context.backendPOST('/bot/prompt/save', this.state.editedPrompt, (data: any) => {
        this.setState({ saving: false });
        if (data.error) {
          this.context.newAlert({type: 'error', message: data.error});
        } else {
          this.context.newAlert({
            type: 'success', 
            message: `Prompt ${this.props.isNew ? 'created' : 'updated'}`
          });
          this.props.onClose();
        }
      });
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
                onChange={(e: any) => this.setState((prevState: any) => ({
                  editedPrompt: {
                    ...prevState.editedPrompt,
                    channel: e.target.value
                  }
                }))}
                label="Channel"
              >
                <MenuItem value="#Autopilot#">Autopilot</MenuItem>
                {channels.map((channel: any) => (
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