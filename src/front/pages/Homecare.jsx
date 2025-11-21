import React, { useState, useMemo } from 'react';
import './../../lib/Services.css';

export default function Homecare() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortByLocation, setSortByLocation] = useState('Location');
  const [sortByPrice, setSortByPrice] = useState('Price');

  // ---- HOME CARE PROVIDERS ----
  const allProviders = [
    {
      id: 1,
      name: 'BrightFix Home Repair',
      service: 'General Handyman Services',
      priceRange: '$40-$120',
      priceValue: 75,
      state: 'FL',
      town: 'Miami',
      email: 'support@brightfix.com',
      phone: '(305) 555-1122',
      category: 'Handy Work'
    },
    {
      id: 2,
      name: 'ProTech Electricians',
      service: 'Electrical Installations & Repairs',
      priceRange: '$80-$200',
      priceValue: 140,
      state: 'FL',
      town: 'Orlando',
      email: 'contact@protech.com',
      phone: '(407) 555-3344',
      category: 'Electrical'
    },
    {
      id: 3,
      name: 'SafeFlow Plumbing',
      service: 'Plumbing Repairs & Installations',
      priceRange: '$60-$180',
      priceValue: 110,
      state: 'TX',
      town: 'Houston',
      email: 'info@safeflow.com',
      phone: '(713) 555-5566',
      category: 'Plumbing'
    },
    {
      id: 4,
      name: 'Structura Builders',
      service: 'Minor Structural Repairs',
      priceRange: '$150-$400',
      priceValue: 275,
      state: 'CA',
      town: 'San Diego',
      email: 'services@structura.com',
      phone: '(619) 555-7788',
      category: 'Structural'
    },
    {
      id: 5,
      name: 'FurniCraft Assembly',
      service: 'Flatpack & Custom Furniture Assembly',
      priceRange: '$50-$140',
      priceValue: 95,
      state: 'NY',
      town: 'Brooklyn',
      email: 'team@furnicraft.com',
      phone: '(718) 555-9900',
      category: 'Furniture Building'
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
        <h1 className="text-center display-1 fw-light mb-5">Homecare</h1>
        
        <div className="row justify-content-center g-4 py-4">
          {serviceCategories.map((category) => (
            <div key={category.id} className="col-auto">
              <div
                className="card homecare-category-card border-dark border-2 text-center"
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
   
   
   <div className="homecare-service-container">
      <div className="homecare-service-content">
        <div className="homecare-filter-controls">
          <div className="homecare-filter-select-wrapper">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="homecare-filter-select"
            >
              <option>All Categories</option>
	<option>Plumbing</option>
              <option>Electrical</option>
              <option>Furniture Building</option>
              <option>Structural</option>
              <option>Handy Work</option>
            </select>
            <span className="homecare-filter-select-arrow">▼</span>
          </div>

          <div className="homecare-filter-select-wrapper">
            <select
              value={sortByLocation}
              onChange={(e) => setSortByLocation(e.target.value)}
              className="homecare-filter-select"
            >
              <option>Location</option>
              <option>Nearest First</option>
              <option>Farthest First</option>
            </select>
            <span className="homecare-filter-select-arrow">▼</span>
          </div>

          <div className="homecare-filter-select-wrapper">
            <select
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value)}
              className="homecare-filter-select"
            >
              <option>Price</option>
              <option>Low to High</option>
              <option>High to Low</option>
            </select>
            <span className="homecare-filter-select-arrow">▼</span>
          </div>
        </div>

        <div className="homecare-provider-cards">
          {providers.map((provider) => (
            <div key={provider.id} className="provider-card">
              <div className="homecare-provider-card-content">
                <div className="homecare-provider-image-placeholder">
                  <div className="homecare-provider-image-inner"></div>
                </div>

                <div className="homecare-provider-info">
                  <h3 className="homecare-provider-name">
                    Company Name: {provider.name}
                  </h3>
                  <p className="homecare-provider-service">
                    Service: {provider.service}
                  </p>
                  <p className="homecare-provider-price">
                    Price Range: {provider.priceRange}
                  </p>
                  <button className="homecare-dates-available-btn">
                    Dates Available
                  </button>
                </div>

                <div className="homecare-service-area">
                  <p className="homecare-service-area-title">Service Area:</p>
                  <p className="homecare-service-area-text">State: {provider.state}</p>
                  <p className="homecare-service-area-text">Town: {provider.town}</p>
                </div>

                <div className="homecare-contact-info">
                  <input
                    type="text"
                    value={provider.email}
                    readOnly
                    className="homecare-contact-input"
                    placeholder="Provider Email"
                  />
                  <input
                    type="text"
                    value={provider.phone}
                    readOnly
                    className="homecare-contact-input"
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
