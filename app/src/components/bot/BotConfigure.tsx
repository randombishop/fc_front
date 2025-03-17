import React from 'react';
import { Container, Tabs, Tab, Box, TextField, Button, Paper } from '@mui/material';
import { AppContext } from '../../AppContext';
import Loading from '../common/Loading';
import RequireSignIn from '../common/RequireSignIn';
import BioTab from './tabs/BioTab';
import LoreTab from './tabs/LoreTab';
import StyleTab from './tabs/StyleTab';
import ActionsTab from './tabs/ActionsTab';

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
        height: 'calc(100vh - 300px)', // Adjust based on your layout
        overflowY: 'auto'
      }}
      {...other}
    >
      {active && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

class BotConfigure1 extends React.Component {
  static contextType = AppContext;

  state = {
    character: null as any,
    currentTab: 0,
    isDirty: false,
    editedCharacter: null as any
  };

  componentDidMount = () => {
    this.loadCharacter();
  }

  loadCharacter = () => {
    const context: any = this.context;
    context.backendGET('/bot/character', (data: any) => {
      this.setState({ 
        character: data,
        editedCharacter: JSON.parse(JSON.stringify(data))
      });
    });
  }

  handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    this.setState({ currentTab: newValue });
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const editedCharacter = { ...this.state.editedCharacter };
    editedCharacter.character.name = event.target.value;
    this.setState({ 
      editedCharacter,
      isDirty: true 
    });
  }

  handleContentUpdate = (updatedCharacter: any) => {
    this.setState({ 
      editedCharacter: updatedCharacter,
      isDirty: true 
    });
  }

  handleSave = () => {
    return;
    const context: any = this.context;
    context.backendPOST('/bot/character', this.state.editedCharacter, () => {
      this.setState({ 
        character: JSON.parse(JSON.stringify(this.state.editedCharacter)),
        isDirty: false 
      });
    });
  }

  renderEditor = () => {
    const { editedCharacter, isDirty, currentTab } = this.state;
    
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Bot Name"
            variant="outlined"
            value={editedCharacter.character.name}
            onChange={this.handleNameChange}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={this.handleTabChange}>
              <Tab label="Bio" />
              <Tab label="Lore" />
              <Tab label="Style" />
              <Tab label="Actions" />
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
          
          <TabPanel active={currentTab === 3}>
            <ActionsTab character={editedCharacter} onUpdate={this.handleContentUpdate} />
          </TabPanel>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button 
            variant="contained" 
            color="primary"
            disabled={!isDirty}
            onClick={this.handleSave}
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

const BotConfigure = () => {
  return RequireSignIn(<BotConfigure1 />);
};

export default BotConfigure;
