import React, { useState, useEffect } from 'react';
import { FaLeaf } from 'react-icons/fa'; // Importing a leaf icon
import './TopRightIcon.css';
import UserStreak from './UserStreak'; // Import UserStreak

// In a real app, userId would come from authentication context or similar
const EXAMPLE_USER_ID = '60c72b2f9a2e6f0015b6d5c0'; // Replace with actual dynamic user ID later

const TopRightIcon = () => { 
  const [streakCount, setStreakCount] = useState(0);

  // Callback function for UserStreak to update the count
  const handleStreakUpdate = (newStreak) => {
    setStreakCount(newStreak);
  };

  return (
    <div className="top-right-icon-container">
      <FaLeaf className="leaf-icon" />
      <span className="icon-count">{streakCount}</span>
      {/* UserStreak component is used for logic, doesn't render UI itself here */}
      <UserStreak userId={EXAMPLE_USER_ID} onStreakUpdate={handleStreakUpdate} />
    </div>
  );
};

export default TopRightIcon; 