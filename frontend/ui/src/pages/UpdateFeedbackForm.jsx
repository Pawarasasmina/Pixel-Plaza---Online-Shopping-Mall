import React, { useState } from 'react';
import axios from 'axios';
import './FeedbackList.css'; // Ensure this file contains the correct styles

const UpdateFeedbackForm = ({ review, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: review.title,
    content: review.content,
    rating: review.rating,
    feedbackType: review.feedbackType || '',
    feedbackFor: review.feedbackFor || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(`http://localhost:3000/api/feedback/${review._id}`, formData);
      onUpdate(res.data);
    } catch (error) {
      setError('Failed to update feedback. Please try again.');
      console.error("Error updating review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-form-container">
      <h2>Update Feedback</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <select id="rating" name="rating" value={formData.rating} onChange={handleChange} required>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>

        <div className="form-group">
          <label>Feedback Type</label>
          <div className="feedback-type">
            <label className="radio-label">
              <input
                type="radio"
                name="feedbackType"
                value="Positive"
                checked={formData.feedbackType === 'Positive'}
                onChange={handleChange}
                required
              />
              <span>Positive</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="feedbackType"
                value="Negative"
                checked={formData.feedbackType === 'Negative'}
                onChange={handleChange}
                required
              />
              <span>Negative</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="feedbackFor">Category</label>
          <select
            id="feedbackFor"
            name="feedbackFor"
            value={formData.feedbackFor}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Category</option>
            <option value="Shop">For Shops</option>
            <option value="Item">For Items</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="update-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateFeedbackForm;
