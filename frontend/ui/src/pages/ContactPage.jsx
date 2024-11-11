// src/pages/ContactPage.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="bg-[#00000] min-h-screen w-[100vw]">
      <div className="container mx-auto py-16 px-4">
        {/* Header Section */}
        <motion.h2
          className="text-4xl font-bold text-center text-[#ff9800] mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch With Us
        </motion.h2>

        {/* Contact Information */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Phone */}
          <div className="bg-white p-8 shadow-lg rounded-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
            <FaPhone className="text-4xl text-[#ff9800] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <p className="text-sm">+123 456 7890</p>
          </div>

          {/* Email */}
          <div className="bg-white p-8 shadow-lg rounded-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
            <FaEnvelope className="text-4xl text-[#ff9800] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-sm">support@pixelplaza.com</p>
          </div>

          {/* Address */}
          <div className="bg-white p-8 shadow-lg rounded-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
            <FaMapMarkerAlt className="text-4xl text-[#ff9800] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Address</h3>
            <p className="text-sm">123 Shopping Ave, Mall City</p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold text-center text-[#ff9800] mb-8">
            Send Us a Message
          </h3>
          <form className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Your Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#ff9800] transition duration-300"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                className="w-full p-3 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#ff9800] transition duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Message</label>
              <textarea
                className="w-full p-3 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#ff9800] transition duration-300"
                rows="5"
                placeholder="Write your message"
                required
              ></textarea>
            </div>
            <motion.button
              type="submit"
              className="bg-[#ff9800] text-white px-6 py-3 rounded-md hover:bg-[#e68a00] transition duration-300 w-full font-bold"
              whileHover={{ scale: 1.05 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
