"use client";

import { useState, useEffect } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../utils/fontawesome';

import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false;

export default function Home() {
  // Using useEffect to ensure this component only renders fully on the client
  // This helps prevent hydration mismatches
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
