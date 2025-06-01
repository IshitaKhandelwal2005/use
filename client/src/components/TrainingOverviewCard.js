import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

// Register Chart.js elements if not already registered globally
// ChartJS.register(ArcElement, Tooltip, Legend); // Usually done in a central place like App.js or main index.js

// Custom plugin for doughnut chart markings
const doughnutMarkingsPlugin = {
  id: 'doughnutMarkings',
  afterDraw: (chart, args, options) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return; // chartArea might not be available initially

    const { left, right, top, bottom } = chartArea;
    const meta = chart.getDatasetMeta(0);
    const element = meta && meta.data && meta.data[0];

    if (!element) return;

    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    const outerRadius = element.outerRadius;
    const innerRadius = element.innerRadius;
    const markerLength = (outerRadius - innerRadius) / 3; // Length of the marker line

    // --- Start: Configuration for markers and text ---
    const markerColor = '#000000'; // Black
    const markerLineWidth = 2;    // Bolder
    const cutoffTextColor = '#000000'; // Black
    const cutoffTextFont = 'bold 9px Arial';
    const centerPercentageFont = 'bold 18px Arial'; // Font for center text
    const centerPercentageColor = '#000000'; // Color for center text
    // --- End: Configuration for markers and text ---

    // Chart.js default rotation is -0.5 * Math.PI (starts at the top)
    const baseAngle = chart.options.rotation || -0.5 * Math.PI;
    const fullCircle = 2 * Math.PI;

    // Only calculate and draw for the 75% mark
    const cutoffAngle = baseAngle + 0.75 * fullCircle; // 75%

    ctx.save();
    ctx.strokeStyle = markerColor;
    ctx.lineWidth = markerLineWidth;

    // --- Draw only the 75% marker line ---
    const xMarkerStartCutoff = centerX + Math.cos(cutoffAngle) * (innerRadius + markerLength); 
    const yMarkerStartCutoff = centerY + Math.sin(cutoffAngle) * (innerRadius + markerLength); 
    const xMarkerEndCutoff = centerX + Math.cos(cutoffAngle) * innerRadius;
    const yMarkerEndCutoff = centerY + Math.sin(cutoffAngle) * innerRadius;

    ctx.beginPath();
    ctx.moveTo(xMarkerStartCutoff, yMarkerStartCutoff); 
    ctx.lineTo(xMarkerEndCutoff, yMarkerEndCutoff);
    ctx.stroke();
    // --- End drawing 75% marker line ---

    // --- Add "Cutoff Mark" text at 75% ---
    const textAngle = cutoffAngle;
    ctx.fillStyle = cutoffTextColor;
    ctx.font = cutoffTextFont;

    const textRadiusPadding = 10; // How far from the outer radius
    let textX = centerX + Math.cos(textAngle) * (outerRadius + textRadiusPadding);
    let textY = centerY + Math.sin(textAngle) * (outerRadius + textRadiusPadding);

    // Adjust text alignment and position based on angle
    if (Math.abs(Math.cos(textAngle)) > 0.9) { // predominantly horizontal (left/right sides)
        ctx.textAlign = Math.cos(textAngle) > 0 ? 'left' : 'right';
        textX += Math.cos(textAngle) > 0 ? 2 : -2; // Small horizontal nudge
    } else {
        ctx.textAlign = 'center';
    }

    if (Math.abs(Math.sin(textAngle)) > 0.9) { // predominantly vertical (top/bottom sides)
         ctx.textBaseline = Math.sin(textAngle) > 0 ? 'top' : 'bottom';
         textY += Math.sin(textAngle) > 0 ? 2 : -2; // Small vertical nudge
    } else {
         ctx.textBaseline = 'middle';
    }
    
    ctx.fillText('Cutoff', textX, textY - 4); // Line 1
    ctx.fillText('Mark', textX, textY + 6);   // Line 2 (below line 1)
    // --- End "Cutoff Mark" text ---

    // --- Start: Draw ACTUAL performanceScore in the center ---
    const actualScore = options.actualPerformanceScore; // Use score from plugin options
    if (actualScore !== undefined) {
      ctx.font = centerPercentageFont;
      ctx.fillStyle = centerPercentageColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(actualScore + '%', centerX, centerY);
    }
    // --- End: Draw percentage in the center ---

    ctx.restore();
  }
};

// Helper function to get score color (can be moved to a utils file if used elsewhere)
const getScoreColor = (score) => {
  if (score >= 90) return '#2E7D32'; // Dark Green
  if (score >= 75) return '#4CAF50'; // Green // This will be the color for the 75% visual segment
  if (score >= 60) return '#FFEB3B'; // Yellow
  if (score >= 40) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

const TrainingOverviewCard = ({ title, level, difficulty, performanceScore, children }) => {
  const visualScore = 75; // Fixed visual representation
  const chartData = performanceScore !== undefined ? {
    datasets: [{
      data: [visualScore, 100 - visualScore], // Always show 75% filled
      backgroundColor: [getScoreColor(visualScore), '#e0e0e0'], // Color based on 75%
      borderWidth: 0,
      cutout: '80%',
    }],
  } : null;

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      doughnutMarkings: { // Pass the actual performanceScore to the plugin
        actualPerformanceScore: performanceScore 
      }
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <Card sx={{ 
      p: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      height: '100%',
      width: '100%' // Ensure card takes full width of its container
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
                backgroundColor: 'rgba(0, 0, 0, 0.08)', // Light grey background for level
                color: 'text.primary',
                padding: '8px 12px'
              }} 
            />
            <Chip 
              label={`Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`}
              color={difficulty === 'easy' ? 'success' : 'warning'} // Assuming 'easy' and 'hard'
              sx={{ fontSize: '0.9rem', fontWeight: 'medium', padding: '8px 12px' }}
            />
          </Box>
        )}

        {chartData && (
          <Box sx={{ width: '120px', height: '120px', margin: '0 auto', position: 'relative', mb: 1 }}> {/* Slightly smaller chart */}
            <Doughnut data={chartData} options={chartOptions} plugins={[doughnutMarkingsPlugin]} />
          </Box>
        )}
        {performanceScore !== undefined && (
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
            Performance of Last Assesment
          </Typography>
        )}
        {/* Render children directly, allowing them to control their own layout (e.g. with mt: 'auto') */}
        {children}
      </CardContent>
    </Card>
  );
};

export default TrainingOverviewCard; 