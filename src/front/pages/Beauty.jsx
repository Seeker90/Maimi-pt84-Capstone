import React, { useState, useMemo } from 'react';
import './Services.css';

export default function PetsServicePage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortByLocation, setSortByLocation] = useState('Location');
  const [sortByPrice, setSortByPrice] = useState('Price');

  const allProviders = [
    {
      id: 1,
      name: 'nancy nails',
      service: 'nails and womens hair stylists',
      priceRange: '$30-$300',
      priceValue: 55,
      state: 'CA',
      town: 'San Francisco',
      email: 'info@nancynails.com',
      phone: '(418) 333-1672',
      category: 'Nails'
    },
    {
      id: 2,
      name: 'Barber for you',
      service: 'Mens Haircuts',
      priceRange: '$50-$60',
      priceValue: 42,
      state: 'CA',
      town: 'Los Angeles',
      email: 'contact@barbernow.com',
      phone: '(213) 555-0456',
      category: 'Mens Cuts'
    },
    {
      id: 3,
      name: 'Elise beauty',
      service: 'Make-up Artist',
      priceRange: '$40-$100',
      priceValue: 70,
      state: 'NY',
      town: 'New York',
      email: 'contact@EliseMakeup.com',
      phone: '(312) 512-0127',
      category: 'makeup'
    },
    {
      id: 4,
      name: 'Sheilas Beauty',
      service: 'womens Hairstyle',
      priceRange: '$50-$300',
      priceValue: 100,
      state: 'TX'
      town: 'Austin',
      email: 'info@sheilabeauty.com',
      phone: '(498) 204-0321',
      category: 'Womens Hairstyle'
    }
  ];

 const serviceCategories = [
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'home-care', name: 'Home Care', icon: '🏠' },
    { id: 'pets', name: 'Pets', icon: '🐾' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗' }
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/services/${categoryId}`);
  };

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
    <>
   <div className="bg-light">
      <main className="container py-5">
        <h1 className="text-center display-1 fw-light mb-5">Pets</h1>
        
        <div className="row justify-content-center g-4 py-4">
          {serviceCategories.map((category) => (
            <div key={category.id} className="col-auto">
              <div
                className="card category-card border-dark border-2 text-center"
                onClick={() => handleCategoryClick(category.id)}
                style={{ width: '150px', height: '150px', cursor: 'pointer' }}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <div className="fs-1 mb-2">{category.icon}</div>
                  <p className="card-text fw-medium mb-0">{category.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
   
   
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
              <option>Nails</option>
              <option>Mens Cuts</option>
              <option>Makeup</option>
              <option>Womens Hairstyle</option>
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
    </>
  );
}