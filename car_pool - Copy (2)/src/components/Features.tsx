"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCoins, faLeaf, faUserShield, 
  faRoute, faUsers, faMobileAlt
} from '@fortawesome/free-solid-svg-icons';

export default function Features() {
  const featuresList = [
    {
      icon: faCoins,
      title: "Save Money",
      description: "Share your ride costs or earn by offering empty seats on your daily commute."
    },
    {
      icon: faLeaf,
      title: "Eco-Friendly",
      description: "Reduce your carbon footprint by sharing rides and promoting sustainable transportation."
    },
    {
      icon: faUserShield,
      title: "Safety First",
      description: "Verified profiles, ratings, and real-time tracking to ensure a safe journey for everyone."
    },
    {
      icon: faRoute,
      title: "Flexible Routes",
      description: "Find rides that match your schedule and route preferences with our smart matching algorithm."
    },
    {
      icon: faUsers,
      title: "Community Building",
      description: "Connect with like-minded cyclists and build a community around sustainable transport."
    },
    {
      icon: faMobileAlt,
      title: "Easy to Use",
      description: "Our intuitive platform makes it simple to offer or find rides in just a few taps."
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="section-title">
          <h2>Why Choose Urban Bike Pooling?</h2>
          <p>Our platform makes bike pooling safe, convenient, and rewarding for everyone.</p>
        </div>
        
        <div className="features-grid">
          {featuresList.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 