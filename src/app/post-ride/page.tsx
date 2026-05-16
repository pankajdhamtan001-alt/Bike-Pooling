"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBicycle, 
  faLocationDot, 
  faCalendarAlt, 
  faClock, 
  faUsers, 
  faDollarSign,
  faInfoCircle,
  faCheck,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';

export default function PostRide() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: 1,
    price: '',
    description: '',
    bikes: 1,
    returnTrip: false,
    returnDate: '',
    returnTime: '',
    rules: {
      noSmoking: true,
      noPets: false,
      quietRide: false,
      noLargeItems: true
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      
      if (name === 'returnTrip') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else if (name.startsWith('rules.')) {
        const ruleName = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          rules: {
            ...prev.rules,
            [ruleName]: checked
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.from.trim()) newErrors.from = 'Starting point is required';
    if (!formData.to.trim()) newErrors.to = 'Destination is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.price) newErrors.price = 'Price is required';
    
    // Validate return trip details if return trip is checked
    if (formData.returnTrip) {
      if (!formData.returnDate) newErrors.returnDate = 'Return date is required';
      if (!formData.returnTime) newErrors.returnTime = 'Return time is required';
    }
    
    // Date validation - ensure date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.date);
    
    if (selectedDate < today) {
      newErrors.date = 'Date cannot be in the past';
    }
    
    if (formData.returnTrip) {
      const returnDate = new Date(formData.returnDate);
      if (returnDate < selectedDate) {
        newErrors.returnDate = 'Return date must be after departure date';
      }
    }
    
    // Price validation
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      // Here you would normally send the data to your API
      // For demo, we'll just simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/rides');
      }, 2000);
    } catch (error) {
      console.error('Error posting ride:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Redirect if not logged in
    if (!session && typeof window !== 'undefined') {
      router.push('/login?redirect=/post-ride');
    }
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFormData(prev => ({
      ...prev,
      date: tomorrow.toISOString().split('T')[0]
    }));
    
    setIsMounted(true);
  }, [session, router]);

  if (!isMounted || !session) {
    return <div className="loading">Loading...</div>;
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCheck} className="text-green-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ride Posted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your ride has been posted successfully. You'll be notified when passengers book your ride.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/rides')}
                className="btn btn-primary"
              >
                View Your Rides
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary bg-opacity-20 mb-4">
                    <FontAwesomeIcon icon={faBicycle} className="text-3xl text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">Post a Ride</h1>
                  <p className="text-gray-600 mt-2">
                    Share your journey and help others get where they need to go
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label htmlFor="from" className="block text-gray-700 font-medium mb-2">
                        Starting Point <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faLocationDot} className="text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          id="from" 
                          name="from"
                          value={formData.from}
                          onChange={handleInputChange}
                          placeholder="Enter starting point"
                          className={`w-full pl-10 pr-4 py-2 border ${errors.from ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                      </div>
                      {errors.from && (
                        <p className="text-red-500 text-sm mt-1">{errors.from}</p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="to" className="block text-gray-700 font-medium mb-2">
                        Destination <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faLocationDot} className="text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          id="to" 
                          name="to"
                          value={formData.to}
                          onChange={handleInputChange}
                          placeholder="Enter destination"
                          className={`w-full pl-10 pr-4 py-2 border ${errors.to ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                      </div>
                      {errors.to && (
                        <p className="text-red-500 text-sm mt-1">{errors.to}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                        </div>
                        <input 
                          type="date" 
                          id="date" 
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                      </div>
                      {errors.date && (
                        <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
                        Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                        </div>
                        <input 
                          type="time" 
                          id="time" 
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                      </div>
                      {errors.time && (
                        <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="returnTrip" 
                        name="returnTrip"
                        checked={formData.returnTrip}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="returnTrip" className="ml-2 block text-gray-700">
                        Add return trip
                      </label>
                    </div>
                    
                    {formData.returnTrip && (
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="form-group">
                          <label htmlFor="returnDate" className="block text-gray-700 font-medium mb-2">
                            Return Date <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                            </div>
                            <input 
                              type="date" 
                              id="returnDate" 
                              name="returnDate"
                              value={formData.returnDate}
                              onChange={handleInputChange}
                              min={formData.date}
                              className={`w-full pl-10 pr-4 py-2 border ${errors.returnDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                            />
                          </div>
                          {errors.returnDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>
                          )}
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="returnTime" className="block text-gray-700 font-medium mb-2">
                            Return Time <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                            </div>
                            <input 
                              type="time" 
                              id="returnTime" 
                              name="returnTime"
                              value={formData.returnTime}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border ${errors.returnTime ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                            />
                          </div>
                          {errors.returnTime && (
                            <p className="text-red-500 text-sm mt-1">{errors.returnTime}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label htmlFor="seats" className="block text-gray-700 font-medium mb-2">
                        Available Seats
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faUsers} className="text-gray-400" />
                        </div>
                        <select 
                          id="seats" 
                          name="seats"
                          value={formData.seats}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="bikes" className="block text-gray-700 font-medium mb-2">
                        Bike Transport Capacity
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faBicycle} className="text-gray-400" />
                        </div>
                        <select 
                          id="bikes" 
                          name="bikes"
                          value={formData.bikes}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {[1, 2, 3, 4].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'bike' : 'bikes'}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                      Price per Seat <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                      </div>
                      <input 
                        type="number" 
                        id="price" 
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="Enter price per seat"
                        className={`w-full pl-10 pr-4 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Our service fee (10%) will be added to the passenger's total.
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                      Description
                    </label>
                    <textarea 
                      id="description" 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Add any additional details about your ride"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">
                      Ride Rules
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="rules.noSmoking" 
                          name="rules.noSmoking"
                          checked={formData.rules.noSmoking}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="rules.noSmoking" className="ml-2 block text-gray-700 text-sm">
                          No smoking
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="rules.noPets" 
                          name="rules.noPets"
                          checked={formData.rules.noPets}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="rules.noPets" className="ml-2 block text-gray-700 text-sm">
                          No pets
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="rules.quietRide" 
                          name="rules.quietRide"
                          checked={formData.rules.quietRide}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="rules.quietRide" className="ml-2 block text-gray-700 text-sm">
                          Quiet ride
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="rules.noLargeItems" 
                          name="rules.noLargeItems"
                          checked={formData.rules.noLargeItems}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="rules.noLargeItems" className="ml-2 block text-gray-700 text-sm">
                          No large items
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Important Information:</p>
                      <p className="mt-1">By posting a ride, you agree to our terms and conditions. You are responsible for ensuring your vehicle is safe and insured for passenger transport.</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary"
                    >
                      {submitting ? 'Posting...' : 'Post Ride'}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="bg-gray-50 p-6">
                <div className="flex items-start">
                  <div className="text-primary mr-3 mt-0.5">
                    <FontAwesomeIcon icon={faShieldAlt} />
                  </div>
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">Your safety matters</p>
                    <p className="mt-1">Remember to verify the identity of your passengers and maintain clear communication through our messaging platform.</p>
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