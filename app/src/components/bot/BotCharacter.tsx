import React from 'react';
import { Container, Tabs, Tab, Box, TextField, Button, Paper } from '@mui/material';
import { AppContext } from '../../AppContext';
import Loading from '../common/Loading';
import RequireSignIn from '../common/RequireSignIn';
import BioTab from './tabs/BioTab';
import LoreTab from './tabs/LoreTab';
import StyleTab from './tabs/StyleTab';

interface TabPanelProps {
  children?: React.ReactNode;
  active: boolean;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, active, ...other } = props;
  return (
    <div 
      role="tabpanel" 
      hidden={!active}
      style={{ 
        height: 'calc(100vh - 400px)', // Adjust based on your layout
        overflowY: 'auto'
      }}
      {...other}
    >
      {active && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

class BotCharacter1 extends React.Component {
  static contextType = AppContext;

  state = {
    currentTab: 0,
    character: null as any,
    editedCharacter: null as any,
    saving: false
  };

  componentDidMount = () => {
    this.loadCharacter();
  }

  loadCharacter = () => {
    const context: any = this.context;
    context.backendGET('/bot/character', (data: any) => {
      this.setState({ 
        character: data.character,
        editedCharacter: JSON.parse(JSON.stringify(data.character)),
      });
    });
  }

  saveCharacter = () => {
    const context: any = this.context;
    this.setState({ saving: true }, () => {
      context.backendPOST('/bot/character', this.state.editedCharacter, (data: any) => {
        if (data.error) {
          context.newAlert({type: 'error', message: data.error});
        } else {
          this.setState({ 
            character: JSON.parse(JSON.stringify(this.state.editedCharacter)),
            saving: false
          });
          context.newAlert({type: 'success', message: 'Bot updated'});
        }
      });
    });
  }

  handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    this.setState({ currentTab: newValue });
  }

  handleContentUpdate = (updatedCharacter: any) => {
    this.setState({ 
      editedCharacter: updatedCharacter
    });
  }

  renderEditor = () => {
    const { currentTab, editedCharacter } = this.state;
    const isDirty = JSON.stringify(editedCharacter) !== JSON.stringify(this.state.character);
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Bot Name"
            variant="outlined"
            value={editedCharacter.name}
            disabled={true}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={this.handleTabChange}>
              <Tab label="Bio" />
              <Tab label="Lore" />
              <Tab label="Style" />
            </Tabs>
          </Box>
          
          <TabPanel active={currentTab === 0}>
            <BioTab character={editedCharacter} onUpdate={this.handleContentUpdate} />
          </TabPanel>
          
          <TabPanel active={currentTab === 1}>
            <LoreTab character={editedCharacter} onUpdate={this.handleContentUpdate} />
          </TabPanel>
          
          <TabPanel active={currentTab === 2}>
            <StyleTab character={editedCharacter} onUpdate={this.handleContentUpdate} />
          </TabPanel>
          
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button 
            variant="contained" 
            color="primary"
            disabled={this.state.saving || (!isDirty)}
            onClick={this.saveCharacter}
          >
            {isDirty ? 'Save Changes' : 'Saved'}
          </Button>
        </Box>

      </Box>
    );
  }

  renderPage = () => {
    if (this.state.character) {
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

const BotCharacter = () => {
  return RequireSignIn(<BotCharacter1 />);
};

export default BotCharacter;
