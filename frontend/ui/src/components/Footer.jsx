// src/components/Footer.jsx
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-[#212529] text-white">
      <div className="container mx-auto py-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9">
        {/* About Us Section */}
        <motion.div
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-[#ff9800] mb-4">About Us</h3>
          <p className="text-sm leading-relaxed">
            Pixel Plaza is your one-stop shop for the best deals and exclusive offers. Explore our wide range of products and enjoy shopping like never before.
          </p>
        </motion.div>

        {/* Quick Links Section */}
        <motion.div
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-[#ff9800] mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {["Home", "Categories", "Offers", "Shops", "Contact"].map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`} className="hover:text-[#ff9800] transition duration-300">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Us Section */}
        <motion.div
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-[#ff9800] mb-4">Contact Us</h3>
          <p className="text-sm leading-relaxed">Email: support@pixelplaza.com</p>
          <p className="text-sm leading-relaxed">Phone: +123 456 7890</p>
          <p className="text-sm leading-relaxed">Address: 123 Shopping Ave, Mall City</p>
        </motion.div>

        {/* Follow Us Section */}
        <motion.div
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-[#ff9800] mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-2xl">
            {[{
              icon: <FaFacebook />,
              link: "https://facebook.com",
            }, {
              icon: <FaTwitter />,
              link: "https://twitter.com",
            }, {
              icon: <FaInstagram />,
              link: "https://instagram.com",
            }, {
              icon: <FaLinkedin />,
              link: "https://linkedin.com",
            }].map(({ icon, link }) => (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ff9800] transition duration-300 transform hover:scale-110"
                key={link}
              >
                {icon}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Newsletter Signup Section */}
      <div className="bg-[#212529] py-6">
        <div className="container mx-auto text-center">
          <h3 className="text-lg font-bold text-[#ff9800] mb-4">Join Our Newsletter</h3>
          <p className="text-sm mb-3">Subscribe to get the latest updates and exclusive offers.</p>
          <form className="flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-l-md border-none outline-none"
              required
            />
            <button type="submit" className="bg-[#ff9800] text-white p-2 rounded-r-md hover:bg-[#e68a00] transition duration-300">
              Subscribe
            </button>
          </form>
        </div>
      </div>


      {/* Footer Bottom */}
      <div className="bg-black py-4 ">
        <div className="container mx-auto text-center">
          <p className="text-sm text-[#ff9800]">&copy; 2024 Pixel Plaza. All rights reserved.</p>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
