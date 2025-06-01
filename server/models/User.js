const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['agent', 'admin'],
    default: 'agent'
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  lastPerformanceDate: {
    type: Date,
    default: null
  },
  lastPerformanceScore: {
    type: Number,
    default: 0
  },
  dailyScores: [
    {
      date: { type: Date, required: true },
      score: { type: Number, required: true }
    }
  ],
  difficulty: {
    type: String,
    enum: ['easy', 'hard'],
    default: 'easy'
  },
  level: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
