"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle, 
  faChevronDown, 
  faChevronUp, 
  faShieldAlt, 
  faHeadset, 
  faBook,
  faInfoCircle,
  faSearch,
  faBicycle,
  faUser,
  faCreditCard,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

// FAQ interface
interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

export default function HelpCenter() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // FAQ categories
  const categories = [
    { id: 'all', name: 'All FAQs', icon: faQuestionCircle },
    { id: 'account', name: 'Account', icon: faUser },
    { id: 'rides', name: 'Rides', icon: faBicycle },
    { id: 'payments', name: 'Payments', icon: faCreditCard },
    { id: 'safety', name: 'Safety', icon: faShieldAlt },
  ];
  
  // FAQ data
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'To create an account, click on the "Sign Up" button in the top right corner of our homepage. You\'ll need to provide your email address, create a password, and verify your identity with a phone number. We also recommend adding a profile picture and completing your profile to build trust within the community.',
      isOpen: false
    },
    {
      id: 2,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'If you\'ve forgotten your password, click on the "Login" button and then select "Forgot password?" Enter the email address associated with your account, and we\'ll send you a link to reset your password. If you don\'t receive the email, check your spam folder or contact our support team.',
      isOpen: false
    },
    {
      id: 3,
      category: 'rides',
      question: 'How do I book a ride?',
      answer: 'To book a ride, search for your destination and date on our homepage. Browse the available rides, select one that meets your needs, and click "Book Now." Follow the prompts to complete your booking, including selecting the number of seats and agreeing to our terms. Once confirmed, you\'ll receive a booking confirmation via email and in your account.',
      isOpen: false
    },
    {
      id: 4,
      category: 'rides',
      question: 'How do I offer a ride?',
      answer: 'To offer a ride, click on "Post a Ride" in the navigation menu. Enter your departure point, destination, date, time, number of available seats, and price per seat. You can also add details about your vehicle and any special conditions. Once published, your ride will be visible to potential passengers searching for similar routes.',
      isOpen: false
    },
    {
      id: 5,
      category: 'payments',
      question: 'How do payments work?',
      answer: 'We handle all payments securely through our platform. When a passenger books a ride, the payment is processed but held until the ride is completed. After the ride, the funds are transferred to the driver, minus our service fee. This ensures security for both parties and allows for our refund policy to be applied if needed.',
      isOpen: false
    },
    {
      id: 6,
      category: 'payments',
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit/debit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. You can add and manage your payment methods in your account settings under the "Payment" section. All payment information is securely encrypted and stored.',
      isOpen: false
    },
    {
      id: 7,
      category: 'safety',
      question: 'How does BikePool ensure safety?',
      answer: 'We prioritize safety through several measures: user verification, ratings and reviews, secure messaging within the platform, and a 24/7 support team. We recommend always meeting in public places, sharing your ride details with a friend or family member, and trusting your instincts. If something doesn\'t feel right, don\'t hesitate to cancel.',
      isOpen: false
    },
    {
      id: 8,
      category: 'safety',
      question: 'What should I do if I feel unsafe during a ride?',
      answer: 'Your safety is our priority. If you ever feel unsafe during a ride, trust your instincts and remove yourself from the situation if possible. Our app has an emergency button that shares your location with emergency contacts. After reaching safety, report the incident to us immediately through the app or contact our emergency support line. We take all safety reports seriously and investigate them thoroughly.',
      isOpen: false
    },
  ]);

  const toggleFAQ = (id: number) => {
    setFaqs(prevFaqs => 
      prevFaqs.map(faq => 
        faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq
      )
    );
  };

  // Filter FAQs based on active category
  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesCategory;
  });

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
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-500">How can we help you?</h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-10">
          {/* Categories section */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-full transition-colors cursor-pointer ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                } shadow-sm`}
              >
                <FontAwesomeIcon icon={category.icon} className="mr-2" />
                {category.name}
              </button>
            ))}
          </div>
          
          {/* FAQs section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-green-600">Frequently Asked Questions</h2>
            
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map(faq => (
                  <div 
                    key={faq.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <div
                      className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
                    >
                      <span className="font-medium text-green-600">{faq.question}</span>
                      <FontAwesomeIcon 
                        icon={faq.isOpen ? faChevronUp : faChevronDown} 
                        className="text-green-600"
                      />
                    </div>
                    
                    {faq.isOpen && (
                      <div className="p-4 pt-0 border-t border-gray-100">
                        <p className="text-black">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faInfoCircle} className="text-4xl text-green-200 mb-3" />
                <p className="text-green-600">No matching questions found. Try a different category.</p>
              </div>
            )}
          </div>
          
          {/* Contact section */}
          <div className="max-w-5xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Need more help?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div 
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => window.location.href = '/contact'}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary bg-opacity-10 mb-4 cursor-pointer">
                  <FontAwesomeIcon icon={faHeadset} className="text-2xl text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
                <p className="text-gray-600 mb-4">Our team is here to help you with any questions or issues.</p>
                <Link href="/contact" className="btn btn-primary cursor-pointer">
                  Contact Us
                </Link>
              </div>
              
              <div 
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => window.location.href = '/guides'}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary bg-opacity-10 mb-4 cursor-pointer">
                  <FontAwesomeIcon icon={faBook} className="text-2xl text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">User Guides</h3>
                <p className="text-gray-600 mb-4">Detailed documentation on how to use our platform effectively.</p>
                <Link href="/guides" className="btn btn-primary cursor-pointer">
                  View Guides
                </Link>
              </div>
              
              <div 
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => window.location.href = '/report'}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary bg-opacity-10 mb-4 cursor-pointer">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Report an Issue</h3>
                <p className="text-gray-600 mb-4">Found a bug or have a concern? Let us know right away.</p>
                <Link href="/report" className="btn btn-primary cursor-pointer">
                  Report Issue
                </Link>
              </div>
            </div>
          </div>
          
          {/* Safety tips section */}
          <div className="max-w-4xl mx-auto mt-16 bg-white rounded-lg shadow-sm p-6 border-l-4 border-primary hover:shadow-md">
            <div className="flex items-start">
              <div className="mr-4 cursor-pointer">
                <FontAwesomeIcon icon={faShieldAlt} className="text-3xl text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Safety Tips</h3>
                <p className="text-gray-700 mb-4">
                  Your safety is our top priority. Here are some important tips to ensure a safe and pleasant experience:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start hover:bg-gray-50 p-1 rounded cursor-pointer">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-primary mr-2 mt-1" />
                    <span>Always verify the identity of your driver or passenger before starting the ride.</span>
                  </li>
                  <li className="flex items-start hover:bg-gray-50 p-1 rounded cursor-pointer">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-primary mr-2 mt-1" />
                    <span>Share your ride details with a trusted friend or family member.</span>
                  </li>
                  <li className="flex items-start hover:bg-gray-50 p-1 rounded cursor-pointer">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-primary mr-2 mt-1" />
                    <span>Keep all communications within our platform for your security.</span>
                  </li>
                  <li className="flex items-start hover:bg-gray-50 p-1 rounded cursor-pointer">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-primary mr-2 mt-1" />
                    <span>Trust your instincts. If something doesn't feel right, cancel the ride.</span>
                  </li>
                  <li className="flex items-start hover:bg-gray-50 p-1 rounded cursor-pointer">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-primary mr-2 mt-1" />
                    <span>Always meet in public, well-lit locations for pickup and drop-off.</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link href="/safety" className="text-primary font-medium hover:underline cursor-pointer">
                    Learn more about our safety policies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 