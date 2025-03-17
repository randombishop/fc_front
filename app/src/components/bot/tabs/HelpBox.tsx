import React from 'react';
import { Paper, Typography } from '@mui/material';
import { colors } from '../../../utils';

interface HelpBoxProps {
  title: string;
  content: string;
}

const HelpBox = ({ title, content }: HelpBoxProps) => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6" gutterBottom sx={{ color: colors.light }}>{title}</Typography>
    <Typography variant="body2" sx={{ color: colors.light }}>{content}</Typography>
  </Paper>
);

export default HelpBox; 