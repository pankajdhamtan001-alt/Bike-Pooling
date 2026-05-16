"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faBicycle, faCommentAlt, faUser, faThumbsUp, faFlag } from '@fortawesome/free-solid-svg-icons';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default function RatingPage({ params }: PageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  // Rating state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  
  // Mock ride data for the rating page
  const [ride, setRide] = useState({
    id: parseInt(params.id),
    type: 'passenger', // 'passenger' or 'driver'
    date: '2025-03-15',
    from: 'Downtown',
    to: 'University Campus',
    user: {
      name: 'Alex Johnson',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    }
  });

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleRatingHover = (value: number) => {
    setHoveredRating(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating before submitting.');
      return;
    }
    
    // In a real app, this would make an API call to save the rating and review
    console.log('Rating submitted:', {
      rideId: ride.id,
      rating,
      review
    });
    
    alert('Thank you for your feedback!');
    router.push('/rides');
  };

  useEffect(() => {
    // Redirect if not logged in
    if (!session && typeof window !== 'undefined') {
      router.push(`/login?redirect=/rating/${params.id}`);
    }
    
    // Fetch ride data in a real app
    // ...
    
    setIsMounted(true);
  }, [session, router, params.id]);

  if (!isMounted || !session) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary bg-opacity-20 mb-4">
                  <FontAwesomeIcon icon={faStar} className="text-3xl text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Rate Your Experience</h1>
                <p className="text-gray-600 mt-2">
                  {ride.type === 'passenger' ? 'How was your ride with' : 'How was your experience hosting'} {ride.user.name}?
                </p>
              </div>
              
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-primary bg-opacity-10 rounded-full">
                      <FontAwesomeIcon icon={faBicycle} className="text-lg text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {ride.date} • {ride.from} to {ride.to}
                    </p>
                    <div className="flex items-center mt-1">
                      <img 
                        src={ride.user.image} 
                        alt={ride.user.name} 
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      <span className="font-medium">{ride.user.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-4 text-center">
                    How would you rate your overall experience?
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingChange(value)}
                        onMouseEnter={() => handleRatingHover(value)}
                        onMouseLeave={() => handleRatingHover(0)}
                        className="text-3xl focus:outline-none transition-colors"
                        title={`Rate ${value} ${value === 1 ? 'star' : 'stars'}`}
                      >
                        <FontAwesomeIcon
                          icon={faStar}
                          className={`${
                            (hoveredRating || rating) >= value 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center mt-2 text-gray-600">
                    {rating > 0 ? (
                      ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]
                    ) : 'Tap a star to rate'}
                  </p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="review" className="block text-gray-700 font-medium mb-2">
                    Write a review (optional)
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-gray-400">
                      <FontAwesomeIcon icon={faCommentAlt} />
                    </div>
                    <textarea 
                      id="review"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                      placeholder="Share your experience..."
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 py-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    <span>Your review will be public</span>
                  </div>
                  
                  <button 
                    type="button"
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <FontAwesomeIcon icon={faFlag} className="mr-1" />
                    <span>Report an issue</span>
                  </button>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Previous Reviews for {ride.user.name}</h2>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex justify-between">
                    <div className="flex items-start">
                      <img 
                        src="https://randomuser.me/api/portraits/women/33.jpg" 
                        alt="Emily Rodriguez" 
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium">Emily Rodriguez</div>
                        <div className="flex items-center mt-1 text-yellow-400">
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                        </div>
                        <p className="mt-2 text-gray-600">
                          Great ride experience! Alex was very friendly and the bike was comfortable. Would definitely ride with him again.
                        </p>
                        <div className="mt-2 text-xs text-gray-500">March 1, 2025</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex justify-between">
                    <div className="flex items-start">
                      <img 
                        src="https://randomuser.me/api/portraits/men/45.jpg" 
                        alt="David Kim" 
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium">David Kim</div>
                        <div className="flex items-center mt-1 text-yellow-400">
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <span className="text-gray-300 ml-1">
                            <FontAwesomeIcon icon={faStar} />
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600">
                          Very punctual and followed all traffic rules. The ride was smooth and the route was well-chosen to avoid traffic.
                        </p>
                        <div className="mt-2 text-xs text-gray-500">February 22, 2025</div>
                      </div>
                    </div>
                  </div>
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