import React, { useState } from 'react';
import { Grid, Box, TextField, IconButton, List, ListItem, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import HelpBox from './HelpBox';

interface ListEditorProps {
  items: string[];
  section: string;
  helpTitle: string;
  helpContent: string;
  onUpdate: (items: string[]) => void;
}

const ListEditor = ({ items, section, helpTitle, helpContent, onUpdate }: ListEditorProps) => {
  const [editingItems, setEditingItems] = useState<string[]>(items);

  // Update parent when our local state changes
  React.useEffect(() => {
    onUpdate(editingItems);
  }, [editingItems, onUpdate]);

  // Update our local state when parent items change
  React.useEffect(() => {
    setEditingItems(items);
  }, [items]);

  const handleAddLine = () => {
    setEditingItems([...editingItems, '']);
  };

  const handleRemoveLine = (index: number) => {
    const newItems = [...editingItems];
    newItems.splice(index, 1);
    setEditingItems(newItems);
  };

  const handleUpdateLine = (index: number, value: string) => {
    const newItems = [...editingItems];
    newItems[index] = value;
    setEditingItems(newItems);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <List>
          {editingItems.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                pb: 2,
                alignItems: 'flex-start',
                '& .MuiIconButton-root': {
                  opacity: 0.3,
                  '&:hover': {
                    opacity: 1
                  }
                }
              }}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  onClick={() => handleRemoveLine(index)}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              <TextField
                fullWidth
                multiline
                variant="outlined"
                value={item}
                onChange={(e) => handleUpdateLine(index, e.target.value)}
                size="small"
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 2 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddLine}
            variant="outlined"
            size="small"
          >
            Add new line
          </Button>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <HelpBox title={helpTitle} content={helpContent} />
      </Grid>
    </Grid>
  );
};

export default ListEditor; 