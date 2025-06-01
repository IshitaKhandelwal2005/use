import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

const InfoCard = ({ title, level, difficulty, children }) => {
  return (
    <Card sx={{ 
      p: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      height: '100%',
      width: '100%'
    }}>
      <CardContent sx={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title} 
        </Typography>
        
        {level !== undefined && difficulty !== undefined && (
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', mb: 2 }}>
            <Chip 
              label={`LEVEL: ${level}`}
              sx={{ 
                fontSize: '0.9rem', 
                fontWeight: 'medium', 
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                color: 'text.primary',
                padding: '8px 12px'
              }} 
            />
            <Chip 
              label={`Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`}
              color={difficulty === 'easy' ? 'success' : 'warning'} // Assuming 'easy', 'medium', 'hard', 'expert'
              sx={{ fontSize: '0.9rem', fontWeight: 'medium', padding: '8px 12px' }}
            />
          </Box>
        )}

        {/* Doughnut chart and analysis text are removed */}
        
        {/* Render children directly */}
        {children && (
          <Box sx={{ mt: 2, flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard; 