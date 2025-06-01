import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './IntermediatePage.css'; // We'll create this CSS file next
import TopRightIcon from '../components/TopRightIcon';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import VideoGallery from '../components/VideoGallery'; // Import VideoGallery
import { productVideoData } from '../utils/productVideoData'; // Import video data
// Import MUI components for difficulty selection
import { Box, Typography, ToggleButtonGroup, ToggleButton, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import TrainingOverviewCard from '../components/TrainingOverviewCard'; // Import the new card
import InfoCard from '../components/InfoCard';

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
  const { user, loading: authLoading } = useAuth(); // Get user data and auth loading state

  // State for difficulty selection, initialized from user profile or default
  const [difficulty, setDifficulty] = useState('easy'); 
  // User level, initialized from user profile or default
  const [userLevel, setUserLevel] = useState(5); 
  const [highestPastScore, setHighestPastScore] = useState(null); // Default to null or 0
  const [fetchingScore, setFetchingScore] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (user && user._id) { // Ensure user and user._id exist
      setDifficulty(user.difficulty || 'easy'); 
      setUserLevel(user.level || 5); 

      const fetchHighestScore = async () => {
        setFetchingScore(true);
        try {
          // Assuming your API is setup to be called like this
          // And you have a way to get the auth token, e.g., from useAuth or context
          const response = await fetch('/api/conversations/highest-score', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Add Authorization header if your endpoint is protected
              // 'Authorization': `Bearer ${yourAuthToken}` 
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setHighestPastScore(data.highestScore); // data.highestScore could be null or a number
        } catch (error) {
          console.error("Failed to fetch highest past score:", error);
          setHighestPastScore(0); // Fallback to 0 in case of error, or handle appropriately
        }
        setFetchingScore(false);
      };

      fetchHighestScore();
    }
  }, [user]); // Re-run when user object changes

  const productTitle = productDetailsMap[scenarioId]?.title || 'Selected Product'; // Fallback title
  const videosForProduct = productVideoData[scenarioId] || []; // Get videos for current product

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

  // Handler for changing difficulty
  const handleDifficultyChange = (event, newDifficulty) => {
    if (newDifficulty !== null) { // Ensure a value is always selected for ToggleButtonGroup
      setDifficulty(newDifficulty);
    }
  };

  const handleStartTraining = () => {
    // Pass difficulty along with other state to the next page
    navigate(`/enhanced-conversation/${scenarioId}`, {
      state: {
        difficulty: difficulty,
        // You might want to pass other relevant data from this page if needed
        // customerProfile: someProfileData, 
        // skipConfiguration: true/false 
      }
    });
  };

  // Chart data and options (adapted from Home.js/Feedback.js)
  // const chartData = { ... }; // This is now handled by TrainingOverviewCard
  // const chartOptions = { ... }; // This is now handled by TrainingOverviewCard

  return (
    <div className="intermediate-page-container">
        <div className="page-header-info">
          <span className="product-title-top-left">{productTitle}</span>
          <TopRightIcon /> {/* Removed count prop, will be handled by streak logic */}
        </div>

        {/* New Training Section Layout based on image */}
        <div className="page-section training-section-new">
          {/* training-header content (TRAINING title, LEVEL button) is removed as it's in the card now */}
          {/* 
          <div className="training-header">
            <h1 className="training-title-main">TRAINING</h1>
            <button className="training-level-button" disabled>
              LEVEL: {authLoading ? '...' : userLevel}
            </button>
          </div> 
          */}

<div className="training-content-new" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginTop: '20px' }}>
  {/* Left card */}
  <div className="training-column previous-stage" style={{ flex: 0.75, height: '350px', marginTop: '20px' }}>
    {!authLoading ? (
      <InfoCard title="PREVIOUS STAGE" level={userLevel > 1 ? userLevel - 1 : 1} difficulty={difficulty} />
    ) : (
      <Typography>Loading Current Stage...</Typography>
    )}
  </div>

  {/* Middle card */}
  <div className="training-column current-stage" style={{ flex: 2, height: '450px' }}>
    {!authLoading ? (
      <TrainingOverviewCard
        title="CURRENT STAGE"
        level={userLevel}
        difficulty={difficulty}
        performanceScore={fetchingScore ? null : highestPastScore} // Pass fetched score, handle loading state
      >
        <Box sx={{ mt: 'auto', pt: 2, width: '100%' }}>
          <p className="ai-bot-area-title" style={{ textAlign: 'center', marginBottom: '8px' }}>
            START WHERE YOU LEFT OF
          </p>
          <button onClick={handleStartTraining} className="action-button ai-training-bot-button" style={{ width: '100%' }}>
            AI TRAINING BOT
          </button>
        </Box>
      </TrainingOverviewCard>
    ) : (
      <Typography>Loading Current Stage...</Typography>
    )}
  </div>

  {/* Right card */}
  <div className="training-column next-stage" style={{ flex: 1, height: '350px', marginTop: '20px' }}>
    {!authLoading ? (
      <InfoCard title="NEXT STAGE" level={userLevel + 1} difficulty={difficulty} />
    ) : (
      <Typography>Loading Current Stage...</Typography>
    )}
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