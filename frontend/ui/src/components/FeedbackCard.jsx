import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import '../styles/FeedbackList.css';

const FeedbackCard = ({ review, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updatedReview, setUpdatedReview] = useState(review); // Initialize state with review

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this feedback?");
    if (confirmDelete) {
      setNotification('Deleting feedback...');
      try {
        await axios.delete(`http://localhost:3000/api/feedback/${review._id}`);
        setNotification('Feedback deleted successfully!');
        onDelete(review._id); // Call the parent delete handler
      } catch (error) {
        setNotification('Error deleting feedback');
        console.error("Error deleting review:", error);
      }
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedReview({ ...updatedReview, [name]: value });
  };

  const handleUpdateClick = async () => {
    setNotification('Updating feedback...');
    try {
      const res = await axios.put(`http://localhost:3000/api/feedback/${review._id}`, updatedReview);
      setNotification('Feedback updated successfully!');
      onUpdate(res.data); // Pass the updated review to parent component
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      setNotification('Error updating feedback');
      console.error("Error updating review:", error);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <Card sx={{ maxWidth: 345 }} className="card">
      {notification && <div className="notification">{notification}</div>}
      <CardMedia
        sx={{ height: 140 }}
        image="https://img.freepik.com/free-vector/medium-feedback-concept-illustrated_23-2148967056.jpg?size=626&ext=jpg&ga=GA1.2.2073079332.1713817285&semt=ais_hybrid"
        title="Feedback"
      />
      <CardContent>
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={updatedReview.title}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded mb-2 w-full bg-white text-black"
            />
            <textarea
              name="content"
              value={updatedReview.content}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded mb-2 w-full bg-white text-black"
            />
            <select
              name="rating"
              value={updatedReview.rating}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded mb-2 w-full bg-white text-black"
            >
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
            <Button 
              size="small" 
              onClick={handleUpdateClick} 
              className="bg-orange-500 text-white hover:bg-orange-700"
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Typography gutterBottom variant="h5" component="div">
              {review.title}
              
            </Typography>
            Review for : {review.itemName}
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {review.content}
              <br />
              Rating: {review.rating}
              <br />
              Category: {review.feedbackFor}
              <br />
              Feedback Type: {review.feedbackType}
              <br />
              Created At: {new Date(review.createdAt).toLocaleDateString()}
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions>
        {isEditing ? (
          <Button 
            size="small" 
            onClick={() => setIsEditing(false)} 
            className="bg-orange-500 text-white hover:bg-orange-700"
          >
            Cancel
          </Button>
        ) : (
          <Button 
            size="small" 
            onClick={() => setIsEditing(true)} 
            className="bg-orange-500 text-white hover:bg-orange-700"
          >
            Update
          </Button>
        )}
        <Button 
          size="small" 
          onClick={handleDeleteClick} 
          className="bg-orange-500 text-white hover:bg-orange-700"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default FeedbackCard;
