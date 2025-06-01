import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making HTTP requests

const API_BASE_URL = 'http://localhost:5000/api/streak'; // Updated to use streak specific path

function UserStreak({ userId, onStreakUpdate }) { // Added onStreakUpdate prop
    const [streak, setStreak] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch and update streak (called on page load and when userId changes)
    const fetchAndUpdateStreak = async () => {
        if (!userId) {
            setLoading(false);
            setError('User ID is required to fetch streak.');
            setStreak(0);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Call the API without providing a score to trigger the daily check
            // This now uses the GET endpoint for fetching initial streak
            const response = await axios.get(`${API_BASE_URL}/user/${userId}/streak`);
            setStreak(response.data.currentStreak);
            setMessage(response.data.message);
            if(onStreakUpdate) onStreakUpdate(response.data.currentStreak); // Notify parent
        } catch (err) {
            console.error('Error fetching streak:', err);
            setError('Failed to load streak. Please try again.');
            setMessage('');
            setStreak(0);
            if(onStreakUpdate) onStreakUpdate(0); // Notify parent of reset/error
        } finally {
            setLoading(false);
        }
    };

    // Function to handle submitting a test score (could be called from elsewhere)
    // This function might be better placed in the component that actually handles test submission.
    // For now, keeping it as per your provided code for potential direct use or reference.
    const handleTestCompletion = async (score) => {
        if (!userId) {
            setError('User ID is required to submit score.');
            return;
        }
        setLoading(true); // Consider if loading state here is disruptive if called from other components
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/user/${userId}/streak`, {
                overallScoreToday: score
            });
            setStreak(response.data.currentStreak);
            setMessage(response.data.message);
            if(onStreakUpdate) onStreakUpdate(response.data.currentStreak); // Notify parent
        } catch (err) {
            console.error('Error submitting score:', err);
            setError('Failed to submit score. Streak might be incorrect.');
            // setMessage(''); // Don't clear potentially useful message from fetch
        } finally {
            setLoading(false);
        }
    };

    // Effect to run on component mount or when userId changes
    useEffect(() => {
        fetchAndUpdateStreak();
    }, [userId]);

    // This component might not render anything itself if used by TopRightIcon
    // Or it could render the debug UI you had.
    // For now, let's assume it just passes data up via onStreakUpdate.
    // The debug UI from your example can be added if needed.

    // If you want to expose handleTestCompletion for other components:
    // useEffect(() => {
    //     if (onStreakUpdate) {
    //         // This is a way to expose an API, but might be better to lift state up
    //         // or use context if other components need to call handleTestCompletion.
    //     }
    // }, [handleTestCompletion, onStreakUpdate]);

    return null; // This component will be used by TopRightIcon, not rendered directly for UI
}

export default UserStreak; 