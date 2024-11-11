const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: String },
  
  images: { type: [String], default: [] },
  feedbackType: {
    type: String,
    enum: ['Positive', 'Negative'], // Restrict the types of feedback
    required: true,
  },
  feedbackFor: {
    type: String,
    enum: ['Shop', 'Item'], // Can be for Shop or Item
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  itemName: {  // Add this field to capture the item name
    type: String,
    
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model('Feedback', feedbackSchema);

module.exports = Review;
