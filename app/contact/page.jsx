'use client'
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPaperPlane, FaPhoneAlt, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';


export default function ContactPage() {
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend/email service
    console.log('Contact Form Submitted:', formData);
    alert('Thank you for your message! We will get back to you soon. (This is a mock submission)');
    setFormData({ // Clear form after submission
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section: Contact Form */}
          <div className="bg-amber-50 p-8 rounded-2xl shadow-inner">
            <h1 className="text-4xl font-extrabold text-amber-900 mb-6">Get in Touch</h1>
            <p className="text-amber-800 text-lg mb-8">
              Have a question or need assistance? Fill out the form below and we'll be happy to help!
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200 text-lg"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200 text-lg"
                  required
                />
              </div>

              {/* Subject Input */}
              <div className="relative">
                <FaPaperPlane className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl" />
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200 text-lg"
                  required
                />
              </div>

              {/* Message Textarea */}
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full p-4 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-amber-900 placeholder-amber-500 transition-all duration-200 text-lg resize-y"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 flex items-center justify-center gap-3 text-xl"
              >
                Send Message <FaPaperPlane />
              </button>
            </form>
          </div>

          {/* Right Section: Contact Info & Map */}
          <div className="bg-amber-700 p-8 rounded-2xl shadow-lg text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6 border-b pb-4 border-amber-500">Our Contact Details</h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <FaPhoneAlt className="text-3xl text-amber-200" />
                  <div>
                    <p className="text-lg font-semibold">Phone</p>
                    <p className="text-amber-100">+254 712 345678</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FaEnvelope className="text-3xl text-amber-200" />
                  <div>
                    <p className="text-lg font-semibold">Email</p>
                    <p className="text-amber-100">info@leatherwalk.co.ke</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FaMapMarkerAlt className="text-3xl text-amber-200" />
                  <div>
                    <p className="text-lg font-semibold">Address</p>
                    <p className="text-amber-100">Leather Walk HQ, 123 Fashion Lane,</p>
                    <p className="text-amber-100">Nairobi, Kenya, 00100</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-amber-600 rounded-xl shadow-md overflow-hidden flex items-center justify-center text-amber-200 text-xl font-bold mt-8">
              {/* Replace with actual Google Maps embed or similar */}
              <p>Map Placeholder</p>
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center gap-6 mt-8">
              <a href="#" className="text-amber-200 hover:text-white transition-colors duration-200 text-3xl" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="text-amber-200 hover:text-white transition-colors duration-200 text-3xl" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="text-amber-200 hover:text-white transition-colors duration-200 text-3xl" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="text-amber-200 hover:text-white transition-colors duration-200 text-3xl" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}