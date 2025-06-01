import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './IntermediatePage.css'; // We'll create this CSS file next
import TopRightIcon from '../components/TopRightIcon';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import VideoGallery from '../components/VideoGallery'; // Import VideoGallery
import { productVideoData } from '../utils/productVideoData'; // Import video data

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Simplified product data for lookup by ID (scenarioId)
const productDetailsMap = {
  'credit-card': { title: 'Credit Card' },
  'personal-loan': { title: 'Personal Loan' },
  'business-loan': { title: 'Business Loan' },
  'savings': { title: 'Savings A/c' },
  'demat': { title: 'Demat A/c' },
  'investment': { title: 'Investment' },
  // Add other product IDs and titles if they exist
};

// Helper function to get score color (adapted from Feedback.js)
const getScoreColor = (score) => {
  if (score >= 90) return '#2E7D32';
  if (score >= 80) return '#43A047';
  if (score >= 70) return '#66BB6A';
  if (score >= 60) return '#FDD835';
  if (score >= 50) return '#FFEB3B';
  if (score >= 40) return '#FFF176';
  if (score >= 20) return '#E53935';
  return '#EF5350';
};


const IntermediatePage = (props) => {
  const navigate = useNavigate();
  const { scenarioId } = useParams(); // This is the product ID

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const productTitle = productDetailsMap[scenarioId]?.title || 'Selected Product'; // Fallback title
  const videosForProduct = productVideoData[scenarioId] || []; // Get videos for current product

  const [overallPerformance, setOverallPerformance] = useState(85); // Mock performance score
  const userLevel = 5; // Example level from image

  // Placeholder data for expertise and lacking areas
  const expertiseAreas = [
    'Product Knowledge',
    'Customer Engagement',
    'Objection Handling'
  ];
  const lackingAreas = [
    'Closing Techniques',
    'Complex Scenario Management',
    'Up-selling Strategies'
  ];

  const handleStartTraining = () => {
    navigate(`/enhanced-conversation/${scenarioId}`);
  };

  // Chart data and options (adapted from Home.js/Feedback.js)
  const chartData = {
    datasets: [{
      data: [overallPerformance, 100 - overallPerformance],
      backgroundColor: [getScoreColor(overallPerformance), '#e0e0e0'], // Adjusted default color
      borderWidth: 0,
      cutout: '80%', // Make donut thinner like image
    }],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="intermediate-page-container">
        <div className="page-header-info">
          <span className="product-title-top-left">{productTitle}</span>
          <TopRightIcon /> {/* Removed count prop, will be handled by streak logic */}
        </div>

        {/* New Training Section Layout based on image */}
        <div className="page-section training-section-new">
          <div className="training-header">
            <h1 className="training-title-main">TRAINING</h1>
            <button className="training-level-button" disabled>
              LEVEL: {userLevel}
            </button>
          </div>

          <div className="training-content-new">
            <div className="training-chart-area">
              <div className="chart-wrapper-new">
                <Doughnut data={chartData} options={chartOptions} />
                {/* The X on the chart is purely visual in the image, so not adding as dynamic element */}
              </div>
              <p className="chart-analysis-text">ANALYSIS OF PAST PERFORMANCE</p>
            </div>

            <div className="training-strengths-weaknesses">
              <h4>EXPERTIES</h4>
              <ul>
                {expertiseAreas.map((item, index) => <li key={`exp-${index}`}>{item}</li>)}
              </ul>
              <h4>AREA OF LACKING</h4>
              <ul>
                {lackingAreas.map((item, index) => <li key={`lack-${index}`}>{item}</li>)}
              </ul>
            </div>

            <div className="training-ai-bot-area">
              <p className="ai-bot-area-title">START WHERE YOU LEFT OF</p>
              <button onClick={handleStartTraining} className="action-button ai-training-bot-button">
                AI TRAINING BOT
              </button>
            </div>
          </div>
        </div>
        {/* End of New Training Section Layout */}

        <div className="page-section learning-section">
          <h2>LEARNING SECTION</h2>
          <VideoGallery videos={videosForProduct} />
        </div>
    </div>
  );
};

export default IntermediatePage;