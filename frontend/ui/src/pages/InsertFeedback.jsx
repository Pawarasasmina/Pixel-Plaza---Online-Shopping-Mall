import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const InsertFeedback = () => {
    const userId = localStorage.getItem("userId"); 
    const location = useLocation(); // Get location state
    const itemName = location.state?.itemName || "Item"; // Default to "Item" if not set

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        rating: '',
        feedbackType: '',
        feedbackFor: '',
        itemName: itemName, // Set itemName in formData
        userId: userId || "exampleUserId",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/feedback/', formData);
            console.log('Feedback submitted successfully:', res.data);
            
            setFormData({
                title: '',
                content: '',
                rating: '',
                feedbackType: '',
                feedbackFor: '',
                itemName: itemName, // Keep itemName on form reset
            });

            navigate('/feedbacklist');

        } catch (err) {
            console.error('Error while submitting feedback:', err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-dark-100 p-6 w-[98vw]">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full transition-transform duration-300 hover:shadow-2xl">
                <h2 className="text-4xl font-bold text-center text-primary mb-6 font-poppins">Submit Your Feedback for {itemName}</h2> {/* Display item name */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-group">
                        <label htmlFor="feedbackFor" className="block text-lg font-semibold text-gray-700 mb-2">Category</label>
                        <select
                            id="feedbackFor"
                            name="feedbackFor"
                            value={formData.feedbackFor}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        >
                            <option value="" disabled>Select Category</option>
                            <option value="Shop">For Shops</option>
                            <option value="Item">For Items</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Feedback Type</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="feedbackType"
                                    value="Positive"
                                    checked={formData.feedbackType === 'Positive'}
                                    onChange={handleChange}
                                    className="form-radio text-primary focus:ring-2 focus:ring-primary"
                                    required
                                />
                                <span className="ml-2 text-gray-600 font-medium">Positive</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="feedbackType"
                                    value="Negative"
                                    checked={formData.feedbackType === 'Negative'}
                                    onChange={handleChange}
                                    className="form-radio text-primary focus:ring-2 focus:ring-primary"
                                    required
                                />
                                <span className="ml-2 text-gray-600 font-medium">Negative</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-2">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary h-24"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="rating" className="block text-lg font-semibold text-gray-700 mb-2">Rating</label>
                        <select
                            id="rating"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        >
                            <option value="" disabled>Select Rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition duration-300">
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InsertFeedback;
