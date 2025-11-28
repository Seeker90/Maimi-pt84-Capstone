import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../fetch';
import { NearbySearch } from '../components/NearbySearch';
import './../../lib/BeautyService.css';

export default function BeautyServicePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortByLocation, setSortByLocation] = useState('Location');
  const [sortByPrice, setSortByPrice] = useState('Price');
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchMode, setSearchMode] = useState('all');
  const [bookingInProgress, setBookingInProgress] = useState(null);

  const serviceCategories = [
    { id: 'beauty', name: 'Beauty', icon: '💄', gradient: 'gradient-pink-red' },
    { id: 'home', name: 'Home Care', icon: '🏠', gradient: 'gradient-purple' },
    { id: 'pets', name: 'Pets', icon: '🐾', gradient: 'gradient-cyan' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗', gradient: 'gradient-pink-yellow' }
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
      const data = await customerAPI.getAllServices('beauty');
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
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-light">
        <main className="container py-5">
          <h1 className="text-center display-1 fw-light mb-5">Beauty</h1>
          
          <div className="row justify-content-center g-4 py-4">
            {serviceCategories.map((category) => (
              <div key={category.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div
                  className={`card category-card h-100 text-center text-white border-0 ${category.gradient}`}
                  onClick={() => handleCategoryClick(category.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(category.id)}
                >
                  <div className="card-body d-flex flex-column justify-content-center align-items-center p-3">
                    <div className="display-4 mb-2">{category.icon}</div>
                    <p className="card-text fw-semibold mb-0">{category.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
   
      <div className="services-section bg-gradient-light min-vh-100 pb-5">
        <div className="container py-4">
          
          <div className="mb-4">
            <NearbySearch 
              onSearchResults={handleNearbySearchResults}
              category="beauty"
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

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select filter-select"
              >
                <option>All Categories</option>
                <option>Nails</option>
                <option>Mens Cuts</option>
                <option>Makeup</option>
                <option>Womens Hairstyle</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <select
                value={sortByLocation}
                onChange={(e) => setSortByLocation(e.target.value)}
                className="form-select filter-select"
                disabled={searchMode === 'nearby'}
              >
                <option>Location</option>
                <option>Nearest First</option>
                <option>Farthest First</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <select
                value={sortByPrice}
                onChange={(e) => setSortByPrice(e.target.value)}
                className="form-select filter-select"
              >
                <option>Price</option>
                <option>Low to High</option>
                <option>High to Low</option>
              </select>
            </div>
          </div>

          <div className="d-flex flex-column gap-4">
            {providers.length === 0 ? (
              <div className="text-center py-5">
                <h3>No services available</h3>
                <p className="text-muted">
                  {searchMode === 'nearby' 
                    ? 'Try expanding your search radius or searching in a different location'
                    : 'Check back later for beauty services in your area'}
                </p>
              </div>
            ) : (
              providers.map((service) => (
                <div key={service.id} className="card provider-card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="row g-4">
                      
                      <div className="col-auto">
                        <div className="provider-image-placeholder rounded-3 d-flex align-items-center justify-content-center">
                          <div className="provider-image-inner"></div>
                        </div>
                      </div>

                      <div className="col-12 col-md">
                        {searchMode === 'nearby' && service.provider.distance && (
                          <span className="badge bg-success mb-2">
                            📍 {service.provider.distance} miles away
                          </span>
                        )}
                        
                        <h3 className="h5 fw-bold text-dark mb-2">
                          Company Name: {service.provider.businessName || service.provider.name}
                        </h3>
                        <p className="text-secondary fw-medium mb-2">
                          Service: {service.name}
                        </p>
                        <p className="text-muted small mb-2">
                          {service.description}
                        </p>
                        <p className="h5 text-success fw-bold mb-2">
                          Price: ${service.price}
                        </p>
                        {service.duration && (
                          <p className="text-muted small mb-3">
                            Duration: {service.duration} minutes
                          </p>
                        )}
                        <button 
                          className="btn btn-book-now"
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

                      <div className="col-12 col-lg-auto">
                        <div className="bg-light rounded-3 p-3 service-area-box">
                          <p className="small fw-bold text-uppercase text-secondary mb-2">Service Area</p>
                          <p className="small text-muted mb-1">
                            State: {service.provider.state || 'N/A'}
                          </p>
                          <p className="small text-muted mb-1">
                            City: {service.provider.city || 'N/A'}
                          </p>
                          {service.provider.rating > 0 && (
                            <p className="small text-muted mb-0">
                              Rating: ⭐ {service.provider.rating.toFixed(1)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-lg-auto">
                        <div className="d-flex flex-column gap-2">
                          <input
                            type="text"
                            value={service.provider.email || 'No email provided'}
                            readOnly
                            className="form-control form-control-sm bg-light"
                            placeholder="Provider Email"
                          />
                          <input
                            type="text"
                            value={service.provider.phone || 'No phone provided'}
                            readOnly
                            className="form-control form-control-sm bg-light"
                            placeholder="Provider Phone"
                          />
                        </div>
                      </div>
                      
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