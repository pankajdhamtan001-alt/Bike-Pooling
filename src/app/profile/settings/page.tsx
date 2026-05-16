"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faBell, 
  faShieldAlt, 
  faCreditCard,
  faEnvelope,
  faPhone,
  faSave,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountSettings() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile settings form data
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    phone: '+1 234 567 8900',
    bio: 'Regular bike commuter and weekend cyclist. I enjoy sharing rides and meeting new people.',
    address: '123 Main Street, Anytown, USA',
    birthdate: '1990-05-15'
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    rideReminders: true,
    newMessages: true,
    bookingUpdates: true
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showProfileToPublic: true,
    shareRideHistory: false,
    allowLocationTracking: true,
    shareContactInfo: false
  });
  
  const updateProfile = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const updateNotifications = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const updatePrivacySettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the profile data to your API
    alert('Profile settings saved successfully!');
  };
  
  const saveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the notification settings to your API
    alert('Notification settings saved successfully!');
  };
  
  const savePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the privacy settings to your API
    alert('Privacy settings saved successfully!');
  };
  
  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would validate and submit password change
    alert('Password change functionality would be implemented here.');
  };
  
  const deleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    );
    
    if (confirmed) {
      // Here you would call your API to delete the account
      alert('Account deletion would be processed here.');
      router.push('/');
    }
  };

  useEffect(() => {
    // Redirect if not logged in
    if (!session && typeof window !== 'undefined') {
      router.push('/login?redirect=/profile/settings');
    }
    
    setIsMounted(true);
  }, [session, router]);

  if (!isMounted || !session) {
    return <div className="loading">Loading...</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={saveProfile} className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                  First Name
                </label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  value={profileData.firstName}
                  onChange={updateProfile}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                  Last Name
                </label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  value={profileData.lastName}
                  onChange={updateProfile}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={profileData.email}
                  onChange={updateProfile}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  value={profileData.phone}
                  onChange={updateProfile}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <input 
                type="text" 
                id="address" 
                name="address"
                value={profileData.address}
                onChange={updateProfile}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="birthdate" className="block text-gray-700 font-medium mb-2">
                Birth Date
              </label>
              <input 
                type="date" 
                id="birthdate" 
                name="birthdate"
                value={profileData.birthdate}
                onChange={updateProfile}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                Bio
              </label>
              <textarea 
                id="bio" 
                name="bio"
                value={profileData.bio}
                onChange={updateProfile}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
              <p className="text-gray-500 text-sm mt-1">Tell other users a bit about yourself</p>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        );
        
      case 'notifications':
        return (
          <form onSubmit={saveNotifications} className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
            
            <div className="form-group">
              <h4 className="text-lg font-medium mb-3">Communication Channels</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="emailNotifications" 
                    name="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={updateNotifications}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-gray-700">
                    Email Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="smsNotifications" 
                    name="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onChange={updateNotifications}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotifications" className="ml-2 block text-gray-700">
                    SMS Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="pushNotifications" 
                    name="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onChange={updateNotifications}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="pushNotifications" className="ml-2 block text-gray-700">
                    Push Notifications
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <h4 className="text-lg font-medium mb-3">Notification Types</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="rideReminders" 
                    name="rideReminders"
                    checked={notificationSettings.rideReminders}
                    onChange={updateNotifications}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="rideReminders" className="ml-2 block text-gray-700">
                    Ride Reminders
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="newMessages" 
                    name="newMessages"
                    checked={notificationSettings.newMessages}
                    onChange={updateNotifications}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="newMessages" className="ml-2 block text-gray-700">
                    New Messages
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="bookingUpdates" 
                    name="bookingUpdates"
                    checked={notificationSettings.bookingUpdates}
                    onChange={updateNotifications}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="bookingUpdates" className="ml-2 block text-gray-700">
                    Booking Updates
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="marketingEmails" 
                    name="marketingEmails"
                    checked={notificationSettings.marketingEmails}
                    onChange={updateNotifications}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="marketingEmails" className="ml-2 block text-gray-700">
                    Marketing & Promotional Emails
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save Preferences
              </button>
            </div>
          </form>
        );
        
      case 'privacy':
        return (
          <form onSubmit={savePrivacy} className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Privacy Settings</h3>
            
            <div className="form-group">
              <h4 className="text-lg font-medium mb-3">Profile Visibility</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="showProfileToPublic" 
                    name="showProfileToPublic"
                    checked={privacySettings.showProfileToPublic}
                    onChange={updatePrivacySettings}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="showProfileToPublic" className="ml-2 block text-gray-700">
                    Show my profile to other users
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="shareRideHistory" 
                    name="shareRideHistory"
                    checked={privacySettings.shareRideHistory}
                    onChange={updatePrivacySettings}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="shareRideHistory" className="ml-2 block text-gray-700">
                    Share my ride history on my profile
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="shareContactInfo" 
                    name="shareContactInfo"
                    checked={privacySettings.shareContactInfo}
                    onChange={updatePrivacySettings}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="shareContactInfo" className="ml-2 block text-gray-700">
                    Show my contact information to matched riders
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <h4 className="text-lg font-medium mb-3">Location Tracking</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="allowLocationTracking" 
                    name="allowLocationTracking"
                    checked={privacySettings.allowLocationTracking}
                    onChange={updatePrivacySettings}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="allowLocationTracking" className="ml-2 block text-gray-700">
                    Allow location tracking during rides
                  </label>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                When enabled, your location will be shared with matched riders only during active rides for safety and coordination purposes.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save Privacy Settings
              </button>
            </div>
          </form>
        );
        
      case 'security':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Password Management</h3>
              <form onSubmit={changePassword} className="space-y-4">
                <div className="form-group">
                  <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                    Current Password
                  </label>
                  <input 
                    type="password" 
                    id="currentPassword" 
                    name="currentPassword"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                    New Password
                  </label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    name="newPassword"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold mb-4">Account Deletion</h3>
              <p className="text-gray-700 mb-4">
                Once you delete your account, all of your personal information and ride history will be permanently removed. This action cannot be undone.
              </p>
              <button 
                onClick={deleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        );
        
      case 'payment':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Payment Settings</h3>
            <p className="mb-4">Manage your payment methods and preferences.</p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-yellow-700">
                Payment settings are managed in the Payments section. Click the button below to go to the Payments page.
              </p>
              <Link href="/payment" className="btn btn-primary mt-4">
                Go to Payments
              </Link>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Account Settings</h1>
              <p className="text-gray-600">Manage your profile, notifications, and account preferences</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="md:w-1/4 bg-gray-50 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex items-center px-3 py-2.5 w-full rounded-md ${
                        activeTab === 'profile' 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-3" />
                      <span>Profile</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`flex items-center px-3 py-2.5 w-full rounded-md ${
                        activeTab === 'notifications' 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FontAwesomeIcon icon={faBell} className="mr-3" />
                      <span>Notifications</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('privacy')}
                      className={`flex items-center px-3 py-2.5 w-full rounded-md ${
                        activeTab === 'privacy' 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FontAwesomeIcon icon={faShieldAlt} className="mr-3" />
                      <span>Privacy</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`flex items-center px-3 py-2.5 w-full rounded-md ${
                        activeTab === 'security' 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FontAwesomeIcon icon={faLock} className="mr-3" />
                      <span>Security</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('payment')}
                      className={`flex items-center px-3 py-2.5 w-full rounded-md ${
                        activeTab === 'payment' 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FontAwesomeIcon icon={faCreditCard} className="mr-3" />
                      <span>Payment</span>
                    </button>
                  </nav>
                </div>
                
                {/* Main content */}
                <div className="md:w-3/4 p-6">
                  {renderTabContent()}
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