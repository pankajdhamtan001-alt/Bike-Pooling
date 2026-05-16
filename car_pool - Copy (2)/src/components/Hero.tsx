"use client";

import Link from 'next/link';

export default function Hero() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Share Your Ride, Save the Planet</h1>
          <p>Join thousands of cyclists who are saving money, reducing carbon emissions, and building community through bike pooling.</p>
          <Link href="/ride-search" className="btn btn-primary">Start Your Journey</Link>
          
          <div className="search-box">
            <form className="search-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>From</label>
                <input type="text" placeholder="Enter starting point" />
              </div>
              
              <div className="form-group">
                <label>To</label>
                <input type="text" placeholder="Enter destination" />
              </div>
              
              <button type="submit" className="btn btn-primary">Find Rides</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 