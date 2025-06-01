const User = require('../models/User'); // Assuming your User model path
const moment = require('moment-timezone'); // Great for handling dates and timezones

// Set the desired timezone for consistency (e.g., 'Asia/Kolkata' for Gurugram)
const TIMEZONE = 'Asia/Kolkata'; // Or whatever your application's primary timezone is

exports.updateUserStreak = async (req, res) => {
    const { userId } = req.params; // Get user ID from URL parameter
    const { overallScoreToday } = req.body; // Get today's score from the request body

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Get today's date in the consistent timezone, without time components
        const today = moment.tz(TIMEZONE).startOf('day');

        // Convert stored lastPerformanceDate to the same timezone and start of day for comparison
        const lastPerformanceMoment = user.lastPerformanceDate ?
            moment.tz(user.lastPerformanceDate, TIMEZONE).startOf('day') : null;

        let newStreak = user.currentStreak;
        let message = '';
        let scoreToRecord = overallScoreToday; // This is the score received from frontend for today

        // If overallScoreToday is not provided, it means the user just reloaded the page
        // without submitting a new test for today. In this case, we check for a missed day.
        if (overallScoreToday === undefined || overallScoreToday === null) {
            // Check for missed day ONLY if lastPerformanceMoment exists and it's a new day
            if (lastPerformanceMoment && today.isAfter(lastPerformanceMoment)) {
                // If today is more than one day after the last performance, streak is broken
                if (today.diff(lastPerformanceMoment, 'days') > 1) {
                    newStreak = 0;
                    message = 'Streak reset due to a missed day.';
                } else if (today.diff(lastPerformanceMoment, 'days') === 1) {
                    // It's the very next day. Check previous day's score.
                    if (user.lastPerformanceScore < 50) {
                        newStreak = 0;
                        message = 'Streak reset due to poor performance on the previous day.';
                    } else {
                        // If previous day's score was good, but no score for today yet,
                        // streak is currently maintained but needs today's score to continue.
                        message = "Awaiting today's performance. Streak remains as per last performance.";
                    }
                }
            } else if (!lastPerformanceMoment) {
                // First time checking streak for this user
                newStreak = 0;
                message = "No previous performance data. Streak initialized to 0.";
            } else if (today.isSame(lastPerformanceMoment)) {
                // Same day, no new score provided. Streak doesn't change on reload unless score changed
                message = "Reloaded on the same day. Streak unchanged.";
            }

            // No score for today provided by the frontend, so we don't update lastPerformanceDate/Score
            // unless a reset was triggered by a missed day.
            if (message.includes("Streak reset due to a missed day.") || message.includes("Streak reset due to poor performance on the previous day.")) {
                user.currentStreak = newStreak;
                // No update to lastPerformanceDate or lastPerformanceScore in backend for the current day yet,
                // as no performance recorded for today. We only reflect the streak reset.
                await user.save(); // Save the reset streak
            }
            return res.status(200).json({ currentStreak: user.currentStreak, message });

        } else { // overallScoreToday is provided, meaning a test was just completed/updated
            scoreToRecord = parseInt(overallScoreToday, 10); // Ensure it's a number

            // Check if today's score is a new score for today, or an update to an existing one
            const existingDailyScoreIndex = user.dailyScores.findIndex(
                s => moment.tz(s.date, TIMEZONE).startOf('day').isSame(today)
            );

            if (existingDailyScoreIndex !== -1) {
                // Update existing score for today
                user.dailyScores[existingDailyScoreIndex].score = scoreToRecord;
            } else {
                // Add new score for today
                user.dailyScores.push({ date: today.toDate(), score: scoreToRecord });
            }

            // Sort daily scores to ensure consistency, though not strictly required for streak logic
            user.dailyScores.sort((a, b) => a.date.getTime() - b.date.getTime());

            if (scoreToRecord >= 50) {
                // Check if streak was valid leading up to today
                if (lastPerformanceMoment && today.diff(lastPerformanceMoment, 'days') === 1 && user.lastPerformanceScore >= 50) {
                    newStreak = user.currentStreak + 1;
                    message = 'Streak continued! Great job today.';
                } else if (lastPerformanceMoment && today.isSame(lastPerformanceMoment) && user.lastPerformanceScore >=50 ) {
                     // Same day, score is good, and it was good before. Streak doesn't change.
                     newStreak = user.currentStreak;
                     message = 'Streak maintained. Performance updated for today.';
                }
                else {
                    // New streak if no prior good performance or a gap in days but today is good
                    newStreak = 1;
                    message = 'New streak started!';
                }
            } else { // scoreToRecord < 50
                newStreak = 0;
                message = 'Streak reset due to poor performance today.';
            }

            // Update user's streak, last performance date, and last performance score
            user.currentStreak = newStreak;
            user.lastPerformanceDate = today.toDate(); // Store as JavaScript Date object
            user.lastPerformanceScore = scoreToRecord;

            await user.save();

            return res.status(200).json({ currentStreak: newStreak, message });
        }

    } catch (error) {
        console.error('Error updating user streak:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// You might also want an API to just get the current streak without updating
exports.getStreak = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select('currentStreak lastPerformanceDate lastPerformanceScore');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // You might want to run the full streak logic here too if you need to ensure
        // the streak is always accurate on retrieval, even if the user hasn't
        // done a test today. For simplicity, we'll just return the stored value.
        // For a more robust solution, call updateUserStreak with null overallScoreToday
        // or a similar check.

        // Example of how to integrate the update logic for accuracy on GET
        // (This would involve calling the main logic to perform the date check)
        const today = moment.tz(TIMEZONE).startOf('day');
        const lastPerformanceMoment = user.lastPerformanceDate ?
            moment.tz(user.lastPerformanceDate, TIMEZONE).startOf('day') : null;

        let currentStreak = user.currentStreak;
        let message = "Current streak retrieved.";

        if (lastPerformanceMoment && today.isAfter(lastPerformanceMoment)) {
            // If today is more than one day after the last performance, streak is broken
            if (today.diff(lastPerformanceMoment, 'days') > 1) {
                currentStreak = 0;
                message = 'Streak was reset due to a missed day. Current streak is 0.';
            } else if (today.diff(lastPerformanceMoment, 'days') === 1) {
                // It's the very next day. Check previous day's score.
                if (user.lastPerformanceScore < 50) {
                    currentStreak = 0;
                    message = 'Streak was reset due to poor performance on the previous day. Current streak is 0.';
                }
            }
            // Update the user's streak in the DB if it changed here
            if (currentStreak !== user.currentStreak) {
                user.currentStreak = currentStreak;
                // Ensure user object is saved after modification if it's fetched for update
                // Since this getStreak might modify, we might need to fetch the full user object
                // or reconsider if GET should modify data.
                // For now, let's assume we need to save if we change the streak here.
                const userToUpdate = await User.findById(userId); // Re-fetch to ensure we have full model for save
                if (userToUpdate) {
                    userToUpdate.currentStreak = currentStreak;
                    await userToUpdate.save();
                }
            }
        }


        res.status(200).json({
            currentStreak: currentStreak,
            lastPerformanceDate: user.lastPerformanceDate,
            lastPerformanceScore: user.lastPerformanceScore,
            message: message
        });

    } catch (error) {
        console.error('Error fetching user streak:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
}; 