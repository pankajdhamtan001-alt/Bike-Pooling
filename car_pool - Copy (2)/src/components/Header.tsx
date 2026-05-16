"use client";

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle, faUser } from '@fortawesome/free-solid-svg-icons';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Function to determine if a link is active
  const isLinkActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path);
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setDropdownOpen(false);
    
    try {
      await signOut({ 
        callbackUrl: window.location.origin,
        redirect: false
      });
      
      // Manually navigate after sign out completes
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out failed:", error);
      
      // Fallback redirect if signOut fails
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };

  return (
    <header className="py-4 px-6 shadow-sm bg-white">
      <div className="flex justify-between items-center px-6">
        <Link href="/" className="logo flex items-center gap-2 text-primary font-bold text-xl">
          <FontAwesomeIcon icon={faBicycle} className="text-2xl" />
          <span>UrbanBike</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/find-ride" 
            className={`px-3 py-2 rounded-md transition-all duration-200 ${
              isLinkActive('/find-ride') || isLinkActive('/ride-search')
                ? 'text-green-600 bg-green-50 font-medium' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            Find a Ride
          </Link>
          <Link 
            href="/offer-ride" 
            className={`px-3 py-2 rounded-md transition-all duration-200 ${
              isLinkActive('/offer-ride') || isLinkActive('/post-ride')
                ? 'text-green-600 bg-green-50 font-medium' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            Offer a Ride
          </Link>
          <Link 
            href="/map-demo" 
            className={`px-3 py-2 rounded-md transition-all duration-200 ${
              isLinkActive('/map-demo') 
                ? 'text-green-600 bg-green-50 font-medium' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            Map Demo
          </Link>
          <Link 
            href="/help" 
            className={`px-3 py-2 rounded-md transition-all duration-200 ${
              isLinkActive('/help') 
                ? 'text-green-600 bg-green-50 font-medium' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            Help
          </Link>
          <Link 
            href="/safety" 
            className={`px-3 py-2 rounded-md transition-all duration-200 ${
              isLinkActive('/safety') 
                ? 'text-green-600 bg-green-50 font-medium' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            Safety
          </Link>
          <Link 
            href="/contact" 
            className={`px-3 py-2 rounded-md transition-all duration-200 ${
              isLinkActive('/contact') 
                ? 'text-green-600 bg-green-50 font-medium' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            Contact
          </Link>
        </div>
        
        {session?.user ? (
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="flex items-center gap-2 rounded-full border border-gray-300 p-2 hover:bg-gray-100 transition-colors"
              aria-label="User menu"
            >
              {session.user.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                </div>
              )}
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium truncate">{session.user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                </div>
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Your Profile
                </Link>
                <Link 
                  href="/rides" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Your Rides
                </Link>
                <Link 
                  href="/messages" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Messages
                </Link>
                <Link 
                  href="/notification" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Notifications
                </Link>
                <Link 
                  href="/payment" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Payment
                </Link>
                <button 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    isSigningOut ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-gray-100'
                  } transition-colors`}
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-outline">Login</Link>
            <Link href="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
} 