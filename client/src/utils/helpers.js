// Format date to a readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format time duration (in minutes) to a readable string
export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// Get scenario display name
export const getScenarioName = (scenario) => {
  const scenarioNames = {
    income: 'Income-Based',
    area: 'Area-Based',
    insurance: 'Insurance',
    credit_score: 'Credit Score'
  };
  
  return scenarioNames[scenario] || scenario.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Calculate average rating from an array of sessions
export const calculateAverageRating = (sessions) => {
  const ratedSessions = sessions.filter(session => session.feedback?.rating);
  
  if (ratedSessions.length === 0) return 0;
  
  const sum = ratedSessions.reduce(
    (acc, curr) => acc + (curr.feedback?.rating || 0), 
    0
  );
  
  return sum / ratedSessions.length;
};

// Truncate text to a certain length and add ellipsis if needed
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

// Format a number with commas as thousands separators
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Generate a random ID (useful for mock data)
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

// Debounce function to limit how often a function can be called
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
