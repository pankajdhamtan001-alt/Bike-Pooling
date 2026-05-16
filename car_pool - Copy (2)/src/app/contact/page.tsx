"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeadset, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faClock,
  faCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function Contact() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 1500);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        {/* Hero Banner */}
        <div className="bg-green-600 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <FontAwesomeIcon icon={faHeadset} className="text-5xl mb-5" />
            <h1 className="text-3xl md:text-4xl font-bold mb-5">Get in Touch</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Have questions, suggestions, or need assistance? We'd love to hear from you. Our dedicated support team is here to help.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {/* Contact Information */}
            <div className="md:col-span-1">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold mb-8">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-5">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Email Us</h3>
                      <p className="text-gray-700 mt-2">
                        <a href="mailto:support@bikepool.com" className="text-green-600 hover:underline">support@bikepool.com</a>
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-5">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Call Us</h3>
                      <p className="text-gray-700 mt-2">
                        <a href="tel:+18001234567" className="text-green-600 hover:underline">+1 (800) 123-4567</a>
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Mon-Fri: 8am - 8pm EST
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-5">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Support Hours</h3>
                      <ul className="text-gray-700 mt-2 space-y-2">
                        <li>Monday - Friday: 8am - 8pm EST</li>
                        <li>Saturday: 9am - 5pm EST</li>
                        <li>Sunday: 10am - 4pm EST</li>
                      </ul>
                      <p className="text-gray-600 text-sm mt-2">
                        Emergency support available 24/7
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 my-8"></div>
                
                <h3 className="font-medium text-lg mb-6">Our Offices</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-5">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <div>
                      <h4 className="font-medium">New York (HQ)</h4>
                      <address className="text-gray-700 not-italic mt-2">
                        123 BikePool Avenue<br />
                        New York, NY 10001<br />
                        United States
                      </address>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-5">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <div>
                      <h4 className="font-medium">San Francisco</h4>
                      <address className="text-gray-700 not-italic mt-2">
                        456 Cycling Street<br />
                        San Francisco, CA 94105<br />
                        United States
                      </address>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow mt-8">
                <h3 className="font-medium text-lg mb-5">Connect with Us</h3>
                <p className="text-gray-700 mb-5">
                  Follow us on social media for updates, tips, and community stories.
                </p>
                <div className="flex space-x-5">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 cursor-pointer" aria-label="Facebook">
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 cursor-pointer" aria-label="Twitter">
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 cursor-pointer" aria-label="Instagram">
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 cursor-pointer" aria-label="LinkedIn">
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                <h2 className="text-xl font-bold mb-8">Send Us a Message</h2>
                
                {isSubmitted ? (
                  <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-lg">
                    <div className="flex">
                      <div className="text-green-500 text-2xl mr-5">
                        <FontAwesomeIcon icon={faCheck} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-green-700 mb-3">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-green-600 mb-5">
                          Thank you for reaching out. We've received your message and will get back to you as soon as possible.
                        </p>
                        <button 
                          onClick={() => setIsSubmitted(false)} 
                          className="bg-green-500 text-white px-5 py-3 rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                        >
                          Send Another Message
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                        }`}
                        placeholder="john.doe@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.subject ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                        }`}
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Account Issues">Account Issues</option>
                        <option value="Billing Questions">Billing Questions</option>
                        <option value="Report a Problem">Report a Problem</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Partnership Opportunity">Partnership Opportunity</option>
                      </select>
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.message ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                        }`}
                        placeholder="Please describe your question or issue in detail..."
                      ></textarea>
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <div className="flex items-start">
                        <div className="text-amber-500 text-xl mr-4 mt-1">
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                        </div>
                        <p className="text-gray-700 text-sm">
                          Our support team prioritizes messages based on urgency. For immediate assistance with safety concerns, please call our 24/7 emergency hotline at <a href="tel:+18887654321" className="text-green-600 font-medium hover:underline">+1 (888) 765-4321</a>.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-green-600 text-white py-4 px-6 rounded-lg font-medium cursor-pointer ${
                          isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                        }`}
                      >
                        {isLoading ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-3">How quickly will I get a response?</h3>
                <p className="text-gray-700">
                  We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please use our emergency hotline.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-3">I need to report a safety issue</h3>
                <p className="text-gray-700">
                  For urgent safety concerns, please call our emergency line directly. For non-urgent reports, select "Report a Problem" in the contact form.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-3">I have a billing dispute</h3>
                <p className="text-gray-700">
                  Please provide your account details and transaction information when submitting billing questions. This helps us resolve your issue faster.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-3">How do I submit a feature request?</h3>
                <p className="text-gray-700">
                  We welcome your ideas! Select "Feature Request" in the dropdown menu and describe your suggestion in detail.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <Link href="/help" 
                className="inline-flex items-center bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer shadow-sm">
                View all FAQs
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Additional Contact Options */}
        <div className="bg-white py-10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-t border-gray-200 pt-8">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Can't find what you need?</h3>
                  <p className="text-gray-600">
                    Our help center has answers to most common questions.
                  </p>
                </div>
                <Link href="/help" className="inline-flex items-center text-green-600 font-medium hover:text-green-700">
                  Visit Help Center
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 