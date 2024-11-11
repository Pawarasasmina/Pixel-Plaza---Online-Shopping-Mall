import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AdminFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All'); // Filter by positive/negative
    const [feedbackFor, setFeedbackFor] = useState('All'); // New filter for Item/Shop

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/feedback');
                setFeedbacks(res.data);
            } catch (error) {
                setError('Error fetching feedbacks');
                console.error("Error fetching feedbacks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    // Filter feedbacks by search term, feedback type, and feedbackFor type
    const filteredFeedbacks = feedbacks.filter((feedback) => {
        const matchesSearch = feedback.itemName && feedback.itemName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || feedback.feedbackType === filterType;
        const matchesFeedbackFor = feedbackFor === 'All' || feedback.feedbackFor === feedbackFor;

        return matchesSearch && matchesFilter && matchesFeedbackFor;
    });

    // Generate PDF report
    const generatePDFReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Filtered Feedback Report', 10, 10);

        const tableColumnHeaders = ["Item Name", "Content", "Rating", "Type", "Created At"];
        const tableRows = filteredFeedbacks.map(feedback => [
            feedback.itemName,
            feedback.content,
            feedback.rating,
            feedback.feedbackType,
            new Date(feedback.createdAt).toLocaleDateString()
        ]);

        doc.autoTable({
            head: [tableColumnHeaders],
            body: tableRows,
            startY: 30,
            theme: 'grid'
        });

        doc.save('Feedback_Report.pdf');
    };

    return (
        <div className="admin-feedbacks-container p-6 bg-gray-200 min-h-screen w-[99vw]">
            <h1 className="text-2xl font-bold mb-4">User Feedbacks</h1>
            {loading && <p>Loading feedbacks...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <div className="controls-container mb-4 flex justify-between items-center">
                {/* Search Bar */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by item name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Filter by Positive or Negative Feedback */}
                <div className="filter-container">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Feedback</option>
                        <option value="Positive">Positive Feedback</option>
                        <option value="Negative">Negative Feedback</option>
                    </select>
                </div>

                {/* New Filter by Item or Shop */}
                <div className="feedback-for-container">
                    <select
                        value={feedbackFor}
                        onChange={(e) => setFeedbackFor(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All</option>
                        <option value="Item">Item</option>
                        <option value="Shop">Shop</option>
                    </select>
                </div>

                {/* Generate PDF button */}
                <button
                    className="bg-gray-600 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition duration-300"
                    onClick={generatePDFReport}
                >
                    Generate Report
                </button>
            </div>

            {/* Feedback List */}
            <div className="feedback-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFeedbacks.map((feedback) => (
                    <Card key={feedback._id} sx={{ maxWidth: 345 }} className="mb-4">
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {feedback.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Review for:</strong> {feedback.itemName} <br />
                                {feedback.content} <br />
                                <strong>Rating:</strong> {feedback.rating} <br />
                                <strong>Category:</strong> {feedback.feedbackFor} <br />
                                <strong>Feedback Type:</strong> {feedback.feedbackType} <br />
                                <strong>Created At:</strong> {new Date(feedback.createdAt).toLocaleDateString()}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {/* Additional actions can be added here */}
                        </CardActions>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminFeedbacks;
