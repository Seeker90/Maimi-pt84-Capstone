import React, { useState, useMemo } from 'react';
import './Services.css';

export default function PetsServicePage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortByLocation, setSortByLocation] = useState('Location');
  const [sortByPrice, setSortByPrice] = useState('Price');

  // Sample provider data
  const allProviders = [
    {
      id: 1,
      name: 'Happy Paws Pet Care',
      service: 'Dog Walking & Grooming',
      priceRange: '$30-$80',
      priceValue: 55,
      state: 'CA',
      town: 'San Francisco',
      email: 'info@happypaws.com',
      phone: '(415) 555-0123',
      category: 'Dog Walking'
    },
    {
      id: 2,
      name: 'Furry Friends Pet Sitting',
      service: 'Pet Sitting & Boarding',
      priceRange: '$25-$60',
      priceValue: 42,
      state: 'CA',
      town: 'Los Angeles',
      email: 'contact@furryfriends.com',
      phone: '(213) 555-0456',
      category: 'Pet Sitting'
    },
    {
      id: 3,
      name: 'Posh Paws Grooming',
      service: 'Professional Grooming',
      priceRange: '$40-$100',
      priceValue: 70,
      state: 'NY',
      town: 'New York',
      email: 'contact@poshpaws.com',
      phone: '(212) 555-0789',
      category: 'Grooming'
    },
    {
      id: 4,
      name: 'Pampered Pets Boarding',
      service: 'Luxury Pet Boarding',
      priceRange: '$50-$150',
      priceValue: 100,
      state: 'TX',
      town: 'Austin',
      email: 'info@pamperedpets.com',
      phone: '(512) 555-0321',
      category: 'Boarding'
    }
  ];

  const providers = useMemo(() => {
    let filtered = allProviders;

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (sortByLocation === 'Nearest First') {
      filtered = filtered.sort((a, b) => a.town.localeCompare(b.town));
    } else if (sortByLocation === 'Farthest First') {
      filtered = filtered.sort((a, b) => b.town.localeCompare(a.town));
    }

    if (sortByPrice === 'Low to High') {
      filtered = filtered.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortByPrice === 'High to Low') {
      filtered = filtered.sort((a, b) => b.priceValue - a.priceValue);
    }

    return filtered;
  }, [selectedCategory, sortByLocation, sortByPrice]);

  return (
    <div className="pets-service-container">
      <div className="pets-service-content">
        <div className="filter-controls">
          <div className="filter-select-wrapper">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option>All Categories</option>
              <option>Dog Walking</option>
              <option>Grooming</option>
              <option>Pet Sitting</option>
              <option>Boarding</option>
            </select>
            <span className="filter-select-arrow">▼</span>
          </div>

          <div className="filter-select-wrapper">
            <select
              value={sortByLocation}
              onChange={(e) => setSortByLocation(e.target.value)}
              className="filter-select"
            >
              <option>Location</option>
              <option>Nearest First</option>
              <option>Farthest First</option>
            </select>
            <span className="filter-select-arrow">▼</span>
          </div>

          <div className="filter-select-wrapper">
            <select
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value)}
              className="filter-select"
            >
              <option>Price</option>
              <option>Low to High</option>
              <option>High to Low</option>
            </select>
            <span className="filter-select-arrow">▼</span>
          </div>
        </div>

        <div className="provider-cards">
          {providers.map((provider) => (
            <div key={provider.id} className="provider-card">
              <div className="provider-card-content">
                <div className="provider-image-placeholder">
                  <div className="provider-image-inner"></div>
                </div>

                <div className="provider-info">
                  <h3 className="provider-name">
                    Company Name: {provider.name}
                  </h3>
                  <p className="provider-service">
                    Service: {provider.service}
                  </p>
                  <p className="provider-price">
                    Price Range: {provider.priceRange}
                  </p>
                  <button className="dates-available-btn">
                    Dates Available
                  </button>
                </div>

                <div className="service-area">
                  <p className="service-area-title">Service Area:</p>
                  <p className="service-area-text">State: {provider.state}</p>
                  <p className="service-area-text">Town: {provider.town}</p>
                </div>

                <div className="contact-info">
                  <input
                    type="text"
                    value={provider.email}
                    readOnly
                    className="contact-input"
                    placeholder="Provider Email"
                  />
                  <input
                    type="text"
                    value={provider.phone}
                    readOnly
                    className="contact-input"
                    placeholder="Provider Phone"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}