import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PerformanceChart = ({ title, score, size = 'normal' }) => {
  const getScoreColor = (score) => {
    // Modern, soothing yet eye-catching color palette
    const colors = {
      10: 'rgba(255, 105, 120, 0.85)',  // Soft coral red
      20: 'rgba(255, 95, 109, 0.85)',   // Salmon pink
      30: 'rgba(255, 123, 84, 0.85)',   // Peach
      40: 'rgba(255, 159, 67, 0.85)',   // Warm orange
      50: 'rgba(255, 192, 67, 0.85)',   // Golden yellow
      60: 'rgba(247, 208, 56, 0.85)',   // Sunshine yellow
      70: 'rgba(163, 203, 56, 0.85)',   // Fresh lime
      80: 'rgba(106, 199, 143, 0.85)',  // Mint green
      90: 'rgba(72, 190, 178, 0.85)',   // Turquoise
      100: 'rgba(46, 213, 115, 0.85)'   // Emerald green
    };

    const threshold = Math.ceil(score / 10) * 10;
    return colors[threshold] || colors[10];
  };

  const getBorderColor = (score) => {
    // Deeper versions of the main colors for borders
    const colors = {
      10: 'rgba(235, 85, 100, 1)',    // Deeper coral
      20: 'rgba(235, 75, 89, 1)',     // Deeper salmon
      30: 'rgba(235, 103, 64, 1)',    // Deeper peach
      40: 'rgba(235, 139, 47, 1)',    // Deeper orange
      50: 'rgba(235, 172, 47, 1)',    // Deeper golden
      60: 'rgba(227, 188, 36, 1)',    // Deeper sunshine
      70: 'rgba(143, 183, 36, 1)',    // Deeper lime
      80: 'rgba(86, 179, 123, 1)',    // Deeper mint
      90: 'rgba(52, 170, 158, 1)',    // Deeper turquoise
      100: 'rgba(26, 193, 95, 1)'     // Deeper emerald
    };

    const threshold = Math.ceil(score / 10) * 10;
    return colors[threshold] || colors[10];
  };

  const data = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [
          getScoreColor(score),
          'rgba(237, 242, 247, 0.4)',  // Lighter gray background
        ],
        borderColor: [
          getBorderColor(score),
          'rgba(226, 232, 240, 0.5)',  // Lighter border
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const chartSize = size === 'large' ? '240px' : '160px';
  const titleSize = size === 'large' ? 'h3' : 'h5';
  const scoreSize = size === 'large' ? '2.5rem' : '1.5rem';

  return (
    <div className="performance-chart">
      <div className="text-center mb-2">
        <h5 className={titleSize}>{title}</h5>
        <div style={{ position: 'relative', height: chartSize, width: '100%' }}>
          <Doughnut data={data} options={options} />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div style={{ 
              fontSize: scoreSize, 
              fontWeight: 'bold',
              color: getBorderColor(score)
            }}>
              {score}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart; 