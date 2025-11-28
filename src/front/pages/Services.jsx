import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../fetch';
import './../../lib/Services.css';

export const Services = () => {
  const navigate = useNavigate();
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  
  const serviceCategories = [
    { id: 'beauty', name: 'Beauty', icon: '💄', gradient: 'gradient-pink-red' },
    { id: 'home', name: 'Home Care', icon: '🏠', gradient: 'gradient-purple' },
    { id: 'pets', name: 'Pets', icon: '🐾', gradient: 'gradient-cyan' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗', gradient: 'gradient-pink-yellow' }
  ];

  const categoryIcons = {
    beauty: '💄',
    home: '🏠',
    pets: '🐾',
    vehicles: '🚗'
  };

  const categoryGradients = {
    beauty: 'gradient-pink-red',
    home: 'gradient-purple',
    'home-care': 'gradient-purple',
    pets: 'gradient-cyan',
    vehicles: 'gradient-pink-yellow'
  };

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const data = await customerAPI.getRecentBookings();
      setRecentBookings(data);
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };
  
  const handleCategoryClick = (categoryId) => {
    navigate(`/services/${categoryId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'cancelled':
        return 'bg-danger';
      case 'in progress':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };
  
  return (
    <div className="min-vh-100 bg-light">
      <main className="container py-5">
        <h1 className="text-center display-1 fw-light mb-5">Services</h1>
        
        {/* Category Cards */}
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

        {/* Recent Bookings Table */}
        <div className="mt-5">
          <h2 className="h4 fw-semibold mb-4">Recent Services</h2>
          <div className="card border-0 shadow-sm rounded-3">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Service</th>
                    <th>Provider</th>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className="pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingBookings ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-2 text-muted">Loading recent services...</span>
                      </td>
                    </tr>
                  ) : recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No recent bookings found. Book a service to get started!
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            <div className={`service-icon-sm rounded-2 d-flex align-items-center justify-content-center ${categoryGradients[booking.category] || 'gradient-purple'}`}>
                              {categoryIcons[booking.category] || '📋'}
                            </div>
                            <div>
                              <p className="mb-0 fw-medium">{booking.serviceName}</p>
                              <small className="text-muted text-capitalize">{booking.category}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="mb-0">{booking.providerName}</p>
                          <small className="text-muted">{booking.providerCity}</small>
                        </td>
                        <td>{formatDate(booking.date)}</td>
                        <td className="fw-semibold text-success">${booking.price}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="pe-4">
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => navigate(`/booking/${booking.id}`)}
                            >
                              View
                            </button>
                            {booking.status === 'completed' && (
                              <button 
                                className="btn btn-sm btn-rebook"
                                onClick={() => navigate(`/services/${booking.category}`)}
                              >
                                Rebook
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* View All Link */}
            {recentBookings.length > 0 && (
              <div className="card-footer bg-transparent border-0 text-center py-3">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={() => navigate('/bookings')}
                >
                  View All Bookings →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};