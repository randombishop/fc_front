import React from 'react';
import { 
  Container, 
  Box, 
  Chip, 
  Select, 
  MenuItem, 
  Button,
  FormControl,
  InputLabel,
  Stack
} from '@mui/material';
import { AppContext } from '../../AppContext';
import Loading from '../common/Loading';
import HelpBox from './tabs/HelpBox';
import RequireSignIn from '../common/RequireSignIn';


interface ChannelInfo {
  id: string;
  name: string;
}

interface ChannelMap {
  [key: string]: string;  // id -> name mapping
}

class BotChannels1 extends React.Component {
  static contextType = AppContext;

  state = {
    channelMap: null as ChannelMap | null,
    channels: null as string[] | null,
    editedChannels: null as string[] | null,
    saving: false
  };

  componentDidMount = () => {
    this.loadCatalog();
    this.loadChannels();
  }

  loadCatalog() {
    const context:any = this.context;
    context.backendGET('/channels/list', (data: ChannelInfo[]) => {
      // Convert array to id -> name map for O(1) lookups
      const channelMap: ChannelMap = {};
      for (const channel of data) {
        channelMap[channel.id] = channel.name;
      }
      this.setState({ channelMap });
    });
  }

  loadChannels = () => {
    const context: any = this.context;
    context.backendGET('/bot/channels', (data: any) => {
      this.setState({ 
        channels: data,
        editedChannels: JSON.parse(JSON.stringify(data)),
      });
    });
  }

  saveChannels = () => {
    const context: any = this.context;
    this.setState({ saving: true }, () => {
      context.backendPOST('/bot/channels', this.state.editedChannels, (data: any) => {
        if (data.error) {
          context.newAlert({type: 'error', message: data.error});
        } else {
          this.setState({ 
            channels: JSON.parse(JSON.stringify(this.state.editedChannels)),
            saving: false
          });
          context.newAlert({type: 'success', message: 'Channels updated'});
        }
      });
    });
  }

  handleDelete = (channelId: string) => {
    const editedChannels = this.state.editedChannels?.filter(id => id !== channelId) ?? [];
    this.setState({ editedChannels });
  };

  handleAdd = (event: any) => {
    const channelId = event.target.value;
    if (channelId && !this.state.editedChannels?.includes(channelId)) {
      this.setState({
        editedChannels: [...(this.state.editedChannels ?? []), channelId]
      });
    }
  };

  renderEditor = () => {
    const { channelMap, editedChannels, channels } = this.state;
    if (!channelMap) {
      return null;
    }
    const isDirty = JSON.stringify(editedChannels) !== JSON.stringify(channels);
    const availableChannelIds = Object.keys(channelMap).filter(
      id => !editedChannels?.includes(id)
    );
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <Stack spacing={3}>

          <HelpBox title="Bot Channels" content="Select the channels where you want your bot to be active. You need to associate at least one channel to activate the autopilot mode. The current version doesn't support posting in the main feed." />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Add Channel</InputLabel>
            <Select
              value=""
              label="Add Channel"
              onChange={this.handleAdd}
              disabled={availableChannelIds.length === 0}
            >
              {availableChannelIds.map(id => (
                <MenuItem key={id} value={id}>
                  {channelMap[id]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {editedChannels?.map(channelId => (
              <Chip
                key={channelId}
                label={channelMap[channelId]}
                onDelete={() => this.handleDelete(channelId)}
                variant="outlined"
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <Button 
              variant="contained" 
              color="primary"
              disabled={this.state.saving || (!isDirty)}
              onClick={this.saveChannels}
            >
              {isDirty ? 'Save Changes' : 'Saved'}
            </Button>
          </Box>
        </Stack>
      </Box>
    );
  }

  renderPage = () => {
    if (this.state.channelMap && this.state.channels) {
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

const BotChannels = () => {
  return RequireSignIn(<BotChannels1 />);
};

export default BotChannels;
