const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['agent', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(v) {
        // Allow both ObjectId and string 'anonymous'
        return mongoose.Types.ObjectId.isValid(v) || v === 'anonymous';
      },
      message: props => `${props.value} is not a valid user ID or 'anonymous'`
    }
  },
  scenario: {
    type: String,
    required: true,
    enum: [
      'income', 'area', 'insurance', 'credit_score',
      'credit-card', 'personal-loan', 'business-loan',
      'savings', 'demat', 'investment',
      'product-credit-card', 'product-personal-loan', 'product-business-loan',
      'product-savings', 'product-demat', 'product-investment'
    ]
  },
  messages: [messageSchema],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    suggestions: [String],
    areasForImprovement: [String],
    score: {
      type: [Number],
      default: [0, 0, 0, 0],
      validate: {
        validator: function(v) {
          return v.length === 4 && v.every(num => num >= 0 && num <= 100);
        },
        message: 'Score array must contain exactly 4 numbers between 0 and 100'
      }
    },
    detailedSuggestions: {
      conversationFlow: [String],
      productKnowledge: [String],
      communicationStyle: [String]
    }
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isTemporary: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Add a method to cleanup temporary conversations
conversationSchema.statics.cleanupTemporary = async function(userId) {
  return this.deleteMany({ userId, isTemporary: true });
};

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
