"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faUserCheck, 
  faIdCard, 
  faComments, 
  faMapMarkerAlt, 
  faExclamationTriangle,
  faPhone,
  faCar,
  faLock,
  faInfoCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function Safety() {
  const [isMounted, setIsMounted] = useState(false);
  
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
          <div className="container mx-auto px-4 text-center">
            <FontAwesomeIcon icon={faShieldAlt} className="text-5xl mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Safety is Our Priority</h1>
            <p className="text-xl max-w-3xl mx-auto">
              We've built BikePool with safety in mind at every step. Learn about our safety features and guidelines to ensure a secure and enjoyable experience.
            </p>
          </div>
        </div>
        
        {/* Safety Features */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Our Safety Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <div className="bg-white p-7 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-green-600 text-3xl mb-5">
                <FontAwesomeIcon icon={faUserCheck} />
              </div>
              <h3 className="text-xl font-semibold mb-3">User Verification</h3>
              <p className="text-gray-700">
                Every member of our community goes through a comprehensive verification process. We verify email addresses, phone numbers, and encourage users to connect their social media profiles for greater transparency.
              </p>
            </div>
            
            <div className="bg-white p-7 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-green-600 text-3xl mb-5">
                <FontAwesomeIcon icon={faIdCard} />
              </div>
              <h3 className="text-xl font-semibold mb-3">ID Verification</h3>
              <p className="text-gray-700">
                For an extra layer of security, users can complete our optional ID verification process. Verified profiles are marked with a badge, helping you make informed decisions about who you ride with.
              </p>
            </div>
            
            <div className="bg-white p-7 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-green-600 text-3xl mb-5">
                <FontAwesomeIcon icon={faComments} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Messaging</h3>
              <p className="text-gray-700">
                Our in-app messaging system lets you communicate with other users without sharing personal contact information. All communications are encrypted and stored securely.
              </p>
            </div>
            
            <div className="bg-white p-7 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-green-600 text-3xl mb-5">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Share Your Route</h3>
              <p className="text-gray-700">
                Easily share your ride details with friends or family members. They'll receive information about your route, driver/passengers, and estimated arrival time for peace of mind.
              </p>
            </div>
            
            <div className="bg-white p-7 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-green-600 text-3xl mb-5 text-centre ">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Emergency Assistance</h3>
              <p className="text-gray-700 ">
                In case of emergency, our app features a quick access emergency button that shares your location with your emergency contacts and connects you with local emergency services.
              </p>
            </div>
            
            <div className="bg-white p-7 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-green-600 text-3xl mb-5">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-700">
                Our dedicated support team is available around the clock to assist with any issues or concerns. We're committed to responding quickly to safety-related reports.
              </p>
            </div>
          </div>
        </div>
        
        {/* Safety Guidelines */}
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center  ">Safety Guidelines</h2>
            
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-6">For Passengers</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="text-green-600 mr-4 mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Verify driver information</h4>
                    <p className="text-gray-700">Always check the driver's profile, ratings, and reviews before booking a ride. Ensure the vehicle description matches what you see.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-green-600 mr-4 mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Share your ride details</h4>
                    <p className="text-gray-700">Use our "Share My Ride" feature to let friends or family know who you're riding with, your route, and expected arrival time.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-green-600 mr-4 mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Meet in public places</h4>
                    <p className="text-gray-700">Always arrange pickups and drop-offs in well-lit public areas. Avoid secluded locations, especially at night.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-green-600 mr-4 mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Trust your instincts</h4>
                    <p className="text-gray-700">If something doesn't feel right, don't get in the car. You can cancel a ride at any time if you feel uncomfortable.</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-8"></div>
              
              <h3 className="text-xl font-semibold mb-6">For Drivers</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="text-green-600 mr-4 mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Verify passenger identities</h4>
                    <p className="text-gray-700">Check passenger profiles and reviews before accepting ride requests. Confirm their identity before starting the journey.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-green-600 mr-4 mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Keep your vehicle maintained</h4>
                    <p className="text-gray-700">Ensure your vehicle is in good working condition with regular maintenance and safety checks. Keep it clean and presentable.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-green-600 mr-4 mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Drive safely and follow laws</h4>
                    <p className="text-gray-700">Observe traffic rules, speed limits, and never drive under the influence. Remember that your passengers' safety is in your hands.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-green-600 mr-4 mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Have proper insurance</h4>
                    <p className="text-gray-700">Ensure your vehicle is properly insured for carpooling. Check with your insurance provider about coverage for passengers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust & Safety Commitment */}
        <div className="bg-white py-10">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto bg-green-100 p-8 rounded-xl shadow-sm text-center border-l-4 border-green-500">
              <FontAwesomeIcon icon={faLock} className="text-green-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-green-700">Our Trust & Safety Commitment</h2>
              <p className="text-green-800 mb-8">
                At BikePool, we're committed to continuously improving our safety measures and protocols. We regularly review and update our policies based on user feedback and industry best practices.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer shadow-sm">
                  Contact Support
                </Link>
                <Link href="/help" className="btn bg-white text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 border border-green-600 transition-colors cursor-pointer shadow-sm">
                  Safety FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Emergency Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto bg-red-50 border-l-4 border-red-500 p-8 rounded-xl shadow-sm text-center">
            <div className="flex flex-col items-center">
              <div className="text-red-500 text-3xl mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-red-700 mb-3">In Case of Emergency</h3>
                <p className="text-gray-700 mb-5">
                  If you ever feel you're in immediate danger, don't hesitate to take action:
                </p>
                <ul className="text-gray-700 space-y-3 list-none">
                  <li>Call local emergency services immediately (911 in the US)</li>
                  <li>Use the emergency button in our app to alert your emergency contacts</li>
                  <li>Leave the vehicle or situation if it's safe to do so</li>
                  <li>Report the incident to our support team as soon as possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 