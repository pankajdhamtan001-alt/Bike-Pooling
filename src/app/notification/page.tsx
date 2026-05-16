"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircleCheck, faCircleExclamation, faCircleInfo, faTrash, faCalendarCheck, faClock, faMapPin, faBicycle, faUser, faStar } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';

export default function Notification() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  // Mock notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'ride_request',
      title: 'New Ride Request',
      message: 'Sarah Miller has requested to join your ride from Downtown to Tech District on March 15.',
      timestamp: '2025-03-14 09:30',
      isRead: false,
      action: {
        type: 'approve',
        user: {
          name: 'Sarah Miller',
          image: 'https://randomuser.me/api/portraits/women/44.jpg',
          rating: 4.8
        }
      }
    },
    {
      id: 2,
      type: 'ride_accepted',
      title: 'Ride Request Accepted',
      message: 'Your request to join Alex Johnson\'s ride from Riverside Park to City Center has been accepted.',
      timestamp: '2025-03-13 14:45',
      isRead: true,
      action: {
        type: 'view',
        rideId: 241
      }
    },
    {
      id: 3,
      type: 'ride_reminder',
      title: 'Upcoming Ride Reminder',
      message: 'Your ride from Downtown to University Campus is scheduled for tomorrow at 08:30 AM.',
      timestamp: '2025-03-12 10:15',
      isRead: true,
      action: {
        type: 'view',
        rideId: 198
      }
    },
    {
      id: 4,
      type: 'system',
      title: 'Profile Verification',
      message: 'Your profile has been successfully verified. You now have access to all platform features.',
      timestamp: '2025-03-10 16:20',
      isRead: true,
      action: {
        type: 'none'
      }
    },
    {
      id: 5,
      type: 'payment',
      title: 'Payment Received',
      message: 'You have received a payment of $5.50 for your ride on March 8.',
      timestamp: '2025-03-09 13:05',
      isRead: false,
      action: {
        type: 'view',
        paymentId: 123
      }
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ride_request':
      case 'ride_accepted':
        return <FontAwesomeIcon icon={faBicycle} className="text-primary" />;
      case 'ride_reminder':
        return <FontAwesomeIcon icon={faCalendarCheck} className="text-green-500" />;
      case 'system':
        return <FontAwesomeIcon icon={faCircleInfo} className="text-blue-500" />;
      case 'payment':
        return <FontAwesomeIcon icon={faCircleCheck} className="text-green-500" />;
      default:
        return <FontAwesomeIcon icon={faBell} className="text-gray-500" />;
    }
  };

  useEffect(() => {
    // Redirect if not logged in
    if (!session && typeof window !== 'undefined') {
      router.push('/login?redirect=/notification');
    }
    
    setIsMounted(true);
  }, [session, router]);

  if (!isMounted || !session) {
    return <div className="loading">Loading...</div>;
  }

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faBell} className="text-2xl text-primary mr-3" />
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="ml-3 bg-primary text-white text-xs rounded-full px-2 py-1">
                    {unreadCount} new
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAllNotifications}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            
            {notifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl text-gray-300 mb-4">
                  <FontAwesomeIcon icon={faBell} />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications</h3>
                <p className="text-gray-500">You don't have any notifications at the moment.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {notifications.map(notification => (
                    <li 
                      key={notification.id} 
                      className={`relative ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
                    >
                      <div className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getIcon(notification.type)}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">
                                  {notification.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                  {notification.message}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {notification.timestamp}
                                </p>
                              </div>
                              <div className="flex">
                                {!notification.isRead && (
                                  <button 
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-gray-400 hover:text-primary ml-2"
                                    title="Mark as read"
                                  >
                                    <FontAwesomeIcon icon={faCircleCheck} />
                                  </button>
                                )}
                                <button 
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-gray-400 hover:text-red-500 ml-2"
                                  title="Delete notification"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                            
                            {notification.action.type === 'approve' && (
                              <div className="mt-3 bg-gray-50 p-3 rounded-md">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <img 
                                      src={notification.action.user.image} 
                                      alt={notification.action.user.name} 
                                      className="h-10 w-10 rounded-full"
                                    />
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-gray-900">
                                        {notification.action.user.name}
                                      </p>
                                      <div className="flex items-center">
                                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1 text-xs" />
                                        <span className="text-xs text-gray-500">
                                          {notification.action.user.rating} rating
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition-colors">
                                      Decline
                                    </button>
                                    <button className="px-3 py-1 bg-green-100 text-green-600 rounded-md text-sm hover:bg-green-200 transition-colors">
                                      Accept
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {notification.action.type === 'view' && (
                              <div className="mt-3">
                                <button 
                                  className="text-sm text-primary hover:underline"
                                  onClick={() => {
                                    if (notification.action.rideId) {
                                      router.push(`/rides/${notification.action.rideId}`);
                                    } else if (notification.action.paymentId) {
                                      router.push(`/payment/${notification.action.paymentId}`);
                                    }
                                  }}
                                >
                                  View Details
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 