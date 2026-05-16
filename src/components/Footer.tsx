"use client";

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, faTwitter, faInstagram, faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h4>UrbanBike</h4>
            <p>Transforming urban commuting through sustainable bike pooling solutions.</p>
            <div className="social-icons">
              <a href="https://www.facebook.com" aria-label="Visit our Facebook page" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://www.twitter.com" aria-label="Visit our Twitter profile" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://www.instagram.com" aria-label="Visit our Instagram profile" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://www.linkedin.com" aria-label="Visit our LinkedIn profile" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/ride-search">Find a Ride</Link></li>
              <li><Link href="/post-ride">Offer a Ride</Link></li>
              <li><Link href="/safety">Safety</Link></li>
              <li><Link href="/help">Help Center</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/safety">Safety</Link></li>
              <li><Link href="/rides">Your Rides</Link></li>
              <li><Link href="/profile/settings">Account Settings</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/cookies">Cookie Policy</Link></li>
              <li><Link href="/guidelines">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Urban Bike Pooling. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 