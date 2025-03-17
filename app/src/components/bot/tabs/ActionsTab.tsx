import React from 'react';
import { Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const AVAILABLE_ACTIONS = [
  'Chat', 'FavoriteUsers', 'MoreLikeThis', 'MostActiveUsers', 'News',
  'Perplexity', 'Pick', 'Praise', 'Psycho', 'Roast', 'Summary',
  'WhoIs', 'WordCloud'
];

interface ActionsTabProps {
  character: any;
  onUpdate: (character: any) => void;
}

const ActionsTab = ({ character, onUpdate }: ActionsTabProps) => {
  const handleActionToggle = (action: string) => {
    const updatedCharacter = { ...character };
    const currentActions = updatedCharacter.character.action_steps;
    
    if (currentActions.includes(action)) {
      updatedCharacter.character.action_steps = currentActions.filter((a: string) => a !== action);
    } else {
      updatedCharacter.character.action_steps = [...currentActions, action];
    }
    onUpdate(updatedCharacter);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormGroup>
          {AVAILABLE_ACTIONS.map((action) => (
            <FormControlLabel
              key={action}
              control={
                <Checkbox
                  checked={character.character.action_steps.includes(action)}
                  onChange={() => handleActionToggle(action)}
                />
              }
              label={action}
            />
          ))}
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default ActionsTab; 