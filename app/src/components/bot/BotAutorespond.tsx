import React from 'react';
import { Container, Box, Button, Paper, TextField } from '@mui/material';
import { AppContext } from '../../AppContext';
import Loading from '../common/Loading';
import RequireSignIn from '../common/RequireSignIn';
import HelpBox from './tabs/HelpBox';


class BotAutorespond1 extends React.Component {
  static contextType = AppContext;

  state = {
    config: null as any,
    editedConfig: null as any,
    saving: false
  };

  componentDidMount = () => {
    this.loadConfig();
  }

  loadConfig = () => {
    const context: any = this.context;
    context.backendGET('/bot/config', (data: any) => {
      this.setState({ 
        config: data,
        editedConfig: JSON.parse(JSON.stringify(data)),
      });
    });
  }

  saveConfig = () => {
    const context: any = this.context;
    this.setState({ saving: true }, () => {
      context.backendPOST('/bot/config', this.state.editedConfig, (data: any) => {
        if (data.error) {
          context.newAlert({type: 'error', message: data.error});
        } else {
          this.setState({ 
            config: JSON.parse(JSON.stringify(this.state.editedConfig)),
            saving: false
          });
          context.newAlert({type: 'success', message: 'Bot updated'});
        }
      });
    });
  }

  renderEditor = () => {
    const { editedConfig } = this.state;
    const isDirty = JSON.stringify(editedConfig) !== JSON.stringify(this.state.config);
    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ mb: 3, p: 3 }}>
          <HelpBox 
            title="When should your bot autorespond (when tagged or replied to)?"
            content="Enter your rules to determine if the bot should continue a conversation. Use examples like if X, continue the conversation. If Y, do not continue."
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Continue Instructions"
            value={editedConfig?.prompt_continue || ''}
            onChange={(e) => this.setState({
              editedConfig: { ...editedConfig, prompt_continue: e.target.value }
            })}
            sx={{ mb: 4 }}
          />

          <HelpBox 
            title="Like Prompt"
            content="Enter the prompt that will be used to determine if the bot should like a cast. Use examples like: if X, like / if Y, do not like."
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Like Prompt"
            value={editedConfig?.prompt_like || ''}
            onChange={(e) => this.setState({
              editedConfig: { ...editedConfig, prompt_like: e.target.value }
            })}
          />
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button 
            variant="contained" 
            color="primary"
            disabled={this.state.saving || (!isDirty)}
            onClick={this.saveConfig}
          >
            {isDirty ? 'Save Changes' : 'Saved'}
          </Button>
        </Box>
      </Box>
    );
  }

  renderPage = () => {
    if (this.state.config) {
      return this.renderEditor();
    } else {
      return <Loading />;
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

const BotAutorespond = () => {
  return RequireSignIn(<BotAutorespond1 />);
};

export default BotAutorespond;
