import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../fetch';
import { NearbySearch } from '../components/NearbySearch';
import './../../lib/Services.css';

export default function HomeCareServicePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortByLocation, setSortByLocation] = useState('Location');
  const [sortByPrice, setSortByPrice] = useState('Price');
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchMode, setSearchMode] = useState('all');
  const [bookingInProgress, setBookingInProgress] = useState(null);

  const serviceCategories = [
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'home', name: 'Home Care', icon: '🏠' },
    { id: 'pets', name: 'Pets', icon: '🐾' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗' }
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    
    if (!token || role !== "customer") {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (now > payload.exp) {
        console.log("Token expired, redirecting to login");
        sessionStorage.clear();
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Error checking token:", error);
      sessionStorage.clear();
      navigate("/login");
      return;
    }

    fetchServices();
  }, [navigate]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await customerAPI.getAllServices('home');
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/services/${categoryId}`);
  };

  const handleNearbySearchResults = (results) => {
    setServices(results);
    setSearchMode('nearby');
    setSortByLocation('Location');
  };

  const handleShowAll = async () => {
    setSearchMode('all');
    await fetchServices();
  };

  const handleBookNow = async (serviceId) => {
    setBookingInProgress(serviceId);
    try {
      const result = await customerAPI.createBooking(serviceId);
      alert('Booking confirmed! SMS sent to both parties.');
      // Optionally refresh services or navigate
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to complete booking. Please try again.');
    } finally {
      setBookingInProgress(null);
    }
  };

  const providers = useMemo(() => {
    let filtered = services;

    if (selectedCategory !== 'All Categories') {
      const searchTerm = selectedCategory.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm)
      );
    }

    if (searchMode !== 'nearby') {
      if (sortByLocation === 'Nearest First') {
        filtered = [...filtered].sort((a, b) => 
          (a.provider.city || '').localeCompare(b.provider.city || '')
        );
      } else if (sortByLocation === 'Farthest First') {
        filtered = [...filtered].sort((a, b) => 
          (b.provider.city || '').localeCompare(a.provider.city || '')
        );
      }
    }

    if (sortByPrice === 'Low to High') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortByPrice === 'High to Low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [services, selectedCategory, sortByLocation, sortByPrice, searchMode]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh"}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-light">
        <main className="homecare-container py-5">
          <h1 className="text-center display-1 fw-light mb-5">Home Care</h1>
          
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
   
      <div className="homecare-service-container">
        <div className="homecare-service-content">
          <div className="container mb-4">
            <NearbySearch 
              onSearchResults={handleNearbySearchResults}
              category="home"
            />
            
            {searchMode === 'nearby' && (
              <div className="text-center mb-3">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={handleShowAll}
                >
                  ← Show All Services
                </button>
                <p className="text-muted mt-2">
                  Showing {services.length} service(s) near you
                </p>
              </div>
            )}
          </div>

          <div className="filter-controls">
            <div className="filter-select-wrapper">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option>All Categories</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Furniture Building</option>
                <option>Structural</option>
                <option>Handy Work</option>
              </select>
              <span className="filter-select-arrow">▼</span>
            </div>

            <div className="filter-select-wrapper">
              <select
                value={sortByLocation}
                onChange={(e) => setSortByLocation(e.target.value)}
                className="filter-select"
                disabled={searchMode === 'nearby'}
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
            {providers.length === 0 ? (
              <div className="text-center p-5">
                <h3>No services available</h3>
                <p className="text-muted">
                  {searchMode === 'nearby' 
                    ? 'Try expanding your search radius or searching in a different location'
                    : 'Check back later for home care services in your area'}
                </p>
              </div>
            ) : (
              providers.map((service) => (
                <div key={service.id} className="provider-card">
                  <div className="provider-card-content">
                    <div className="provider-image-placeholder">
                      <div className="provider-image-inner"></div>
                    </div>

                    <div className="provider-info">
                      {searchMode === 'nearby' && service.provider.distance && (
                        <span className="badge bg-success mb-2">
                          📍 {service.provider.distance} miles away
                        </span>
                      )}
                      
                      <h3 className="provider-name">
                        Company Name: {service.provider.businessName || service.provider.name}
                      </h3>
                      <p className="provider-service">
                        Service: {service.name}
                      </p>
                      <p className="provider-description text-muted">
                        {service.description}
                      </p>
                      <p className="provider-price">
                        Price: ${service.price}
                      </p>
                      {service.duration && (
                        <p className="provider-duration text-muted">
                          Duration: {service.duration} minutes
                        </p>
                      )}
                      <button 
                        className="dates-available-btn"
                        onClick={() => handleBookNow(service.id)}
                        disabled={bookingInProgress === service.id}
                      >
                        {bookingInProgress === service.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Booking...
                          </>
                        ) : (
                          'Book Now'
                        )}
                      </button>
                    </div>

                    <div className="service-area">
                      <p className="service-area-title">Service Area:</p>
                      <p className="service-area-text">
                        State: {service.provider.state || 'N/A'}
                      </p>
                      <p className="service-area-text">
                        City: {service.provider.city || 'N/A'}
                      </p>
                      {service.provider.rating > 0 && (
                        <p className="service-area-text">
                          Rating: ⭐ {service.provider.rating.toFixed(1)}
                        </p>
                      )}
                    </div>

                    <div className="contact-info">
                      <input
                        type="text"
                        value={service.provider.email || 'No email provided'}
                        readOnly
                        className="contact-input"
                        placeholder="Provider Email"
                      />
                      <input
                        type="text"
                        value={service.provider.phone || 'No phone provided'}
                        readOnly
                        className="contact-input"
                        placeholder="Provider Phone"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}