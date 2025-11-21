import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { providerAPI } from "../fetch"
import "./ProviderDashboard.css"

export const ProviderDashboard = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("overview")
    const [providerData, setProviderData] = useState(null)
    const [services, setServices] = useState([])
    const [bookings, setBookings] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showServiceModal, setShowServiceModal] = useState(false)
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        category: 'pets',
        price: '',
        duration: ''
    })
  
    const [profileForm, setProfileForm] = useState({
        businessName: '',
        name: '',
        phone: '',
        description: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        latitude: '',
        longitude: ''
    })

    useEffect(() => {
        const token = sessionStorage.getItem("token")
        const role = sessionStorage.getItem("role")
        
        if (!token || role !== "provider") {
            navigate("/login")
            return
        }
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const now = Math.floor(Date.now() / 1000)
            
            if (now > payload.exp) {
                console.log("Token expired, redirecting to login")
                sessionStorage.clear()
                navigate("/login")
                return
            }
        } catch (error) {
            console.error("Error checking token:", error)
            sessionStorage.clear()
            navigate("/login")
            return
        }
        
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setIsLoading(true)
        try {
            const profileData = await providerAPI.getProfile()
            setProviderData(profileData)
            
            // Populate profile form with data
            setProfileForm({
                businessName: profileData.businessName || '',
                name: profileData.name || '',
                phone: profileData.phone || '',
                description: profileData.description || '',
                address: profileData.address || '',
                city: profileData.city || '',
                state: profileData.state || '',
                zipCode: profileData.zipCode || '',
                latitude: profileData.latitude || '',
                longitude: profileData.longitude || ''
            })

            const servicesData = await providerAPI.getServices()
            setServices(servicesData)

            const bookingsData = await providerAPI.getBookings()
            setBookings(bookingsData)

        } catch (error) {
            console.error("Error fetching dashboard data:", error)
            if (error.message.includes('401') || error.message.includes('403')) {
                navigate("/login")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        
        try {
            await providerAPI.updateProfile({
                businessName: profileForm.businessName,
                name: profileForm.name,
                phone: profileForm.phone,
                description: profileForm.description,
                address: profileForm.address,
                city: profileForm.city,
                state: profileForm.state,
                zipCode: profileForm.zipCode
            })
   
            if (profileForm.latitude && profileForm.longitude) {
                await providerAPI.updateLocation({
                    latitude: parseFloat(profileForm.latitude),
                    longitude: parseFloat(profileForm.longitude),
                    city: profileForm.city,
                    state: profileForm.state,
                    zipCode: profileForm.zipCode
                })
            }
            
            alert('Profile updated successfully!')
            fetchDashboardData()
        } catch (error) {
            console.error("Error updating profile:", error)
            alert(error.message || 'Failed to update profile')
        }
    }

    const handleAddService = async (e) => {
        e.preventDefault()
        
        try {
            const serviceData = {
                name: newService.name,
                description: newService.description,
                category: newService.category,
                price: parseFloat(newService.price),
                duration: newService.duration ? parseInt(newService.duration) : null
            }

            const response = await providerAPI.createService(serviceData)
            
            if (response.service) {
                setServices([...services, response.service])
                setShowServiceModal(false)
                setNewService({
                    name: '',
                    description: '',
                    category: 'pets',
                    price: '',
                    duration: ''
                })
                alert('Service added successfully!')
            } else {
                throw new Error('Invalid response format')
            }
        } catch (error) {
            console.error("Full error:", error)
            alert(error.message || 'Error adding service')
        }
    }

    const handleDeleteService = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service?')) {
            return
        }

        try {
            await providerAPI.deleteService(serviceId)
            setServices(services.filter(service => service.id !== serviceId))
            alert('Service deleted successfully!')
        } catch (error) {
            console.error("Error deleting service:", error)
            alert(error.message || 'Failed to delete service')
        }
    }

    const getServiceIcon = (category) => {
        const icons = {
            pets: "🐾",
            beauty: "💄",
            vehicles: "🚗",
            home: "🏠"
        }
        return icons[category] || "🔧"
    }

    const getStatusBadge = (status) => {
        const badges = {
            pending: "warning",
            confirmed: "success",
            completed: "info",
            cancelled: "danger"
        }
        return badges[status] || "secondary"
    }

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh"}}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="provider-dashboard">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3 col-lg-2 sidebar bg-light p-3">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                                    onClick={() => setActiveTab("overview")}
                                >
                                    📊 Overview
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === "services" ? "active" : ""}`}
                                    onClick={() => setActiveTab("services")}
                                >
                                    🛠️ My Services
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === "bookings" ? "active" : ""}`}
                                    onClick={() => setActiveTab("bookings")}
                                >
                                    📅 Bookings
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === "earnings" ? "active" : ""}`}
                                    onClick={() => setActiveTab("earnings")}
                                >
                                    💰 Earnings
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                                    onClick={() => setActiveTab("profile")}
                                >
                                    👤 Profile
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="col-md-9 col-lg-10 p-4">
                        {activeTab === "overview" && (
                            <div>
                                <h2 className="mb-4">Dashboard Overview</h2>
                              
                                <div className="row g-3 mb-4">
                                    <div className="col-md-3">
                                        <div className="card stat-card">
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-2 text-muted">Total Services</h6>
                                                <h2 className="card-title mb-0">{services.length}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card stat-card">
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-2 text-muted">Active Bookings</h6>
                                                <h2 className="card-title mb-0">
                                                    {bookings.filter(b => b.status === "confirmed").length}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card stat-card">
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-2 text-muted">Pending Requests</h6>
                                                <h2 className="card-title mb-0">
                                                    {bookings.filter(b => b.status === "pending").length}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card stat-card">
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-2 text-muted">This Month</h6>
                                                <h2 className="card-title mb-0">$0</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0">Recent Bookings</h5>
                                    </div>
                                    <div className="card-body">
                                        {bookings.length === 0 ? (
                                            <p className="text-muted">No bookings yet</p>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Service</th>
                                                            <th>Customer</th>
                                                            <th>Date</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bookings.slice(0, 5).map(booking => (
                                                            <tr key={booking.id}>
                                                                <td>{booking.serviceName}</td>
                                                                <td>{booking.customerName}</td>
                                                                <td>{new Date(booking.date).toLocaleDateString()}</td>
                                                                <td>
                                                                    <span className={`badge bg-${getStatusBadge(booking.status)}`}>
                                                                        {booking.status}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <button className="btn btn-sm btn-outline-primary">
                                                                        View
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "services" && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2>My Services</h2>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => setShowServiceModal(true)}
                                    >
                                        + Add New Service
                                    </button>
                                </div>

                                {services.length === 0 ? (
                                    <div className="card text-center p-5">
                                        <h4>No services yet</h4>
                                        <p className="text-muted">Start by adding your first service</p>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => setShowServiceModal(true)}
                                        >
                                            Add Service
                                        </button>
                                    </div>
                                ) : (
                                    <div className="row g-3">
                                        {services.map(service => (
                                            <div key={service.id} className="col-md-6 col-lg-4">
                                                <div className="card service-card h-100">
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <span className="service-icon">
                                                                {getServiceIcon(service.category)}
                                                            </span>
                                                            <span className="badge bg-secondary">
                                                                {service.category}
                                                            </span>
                                                        </div>
                                                        <h5 className="card-title">{service.name}</h5>
                                                        <p className="card-text text-muted">{service.description}</p>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="h5 mb-0 text-primary">
                                                                ${service.price}
                                                            </span>
                                                            <div className="btn-group btn-group-sm">
                                                                <button className="btn btn-outline-primary">Edit</button>
                                                                <button 
                                                                    className="btn btn-outline-danger"
                                                                    onClick={() => handleDeleteService(service.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "bookings" && (
                            <div>
                                <h2 className="mb-4">Bookings Management</h2>
                                
                                <div className="btn-group mb-4" role="group">
                                    <button className="btn btn-outline-primary active">All</button>
                                    <button className="btn btn-outline-primary">Pending</button>
                                    <button className="btn btn-outline-primary">Confirmed</button>
                                    <button className="btn btn-outline-primary">Completed</button>
                                </div>

                                {bookings.length === 0 ? (
                                    <div className="alert alert-info">
                                        No bookings to display
                                    </div>
                                ) : (
                                    <div className="row g-3">
                                        {bookings.map(booking => (
                                            <div key={booking.id} className="col-12">
                                                <div className="card booking-card">
                                                    <div className="card-body">
                                                        <div className="row align-items-center">
                                                            <div className="col-md-3">
                                                                <h6 className="mb-1">{booking.serviceName}</h6>
                                                                <small className="text-muted">
                                                                    {booking.customerName}
                                                                </small>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <small className="text-muted d-block">Date</small>
                                                                {new Date(booking.date).toLocaleDateString()}
                                                            </div>
                                                            <div className="col-md-2">
                                                                <small className="text-muted d-block">Time</small>
                                                                {booking.time}
                                                            </div>
                                                            <div className="col-md-2">
                                                                <span className={`badge bg-${getStatusBadge(booking.status)}`}>
                                                                    {booking.status}
                                                                </span>
                                                            </div>
                                                            <div className="col-md-3 text-end">
                                                                {booking.status === "pending" && (
                                                                    <>
                                                                        <button className="btn btn-sm btn-success me-2">
                                                                            Accept
                                                                        </button>
                                                                        <button className="btn btn-sm btn-danger">
                                                                            Decline
                                                                        </button>
                                                                    </>
                                                                )}
                                                                <button className="btn btn-sm btn-outline-primary ms-2">
                                                                    Details
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "earnings" && (
                            <div>
                                <h2 className="mb-4">Earnings</h2>
                                
                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <div className="card">
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-2 text-muted">Today</h6>
                                                <h3 className="card-title text-success">$0.00</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card">
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-2 text-muted">This Week</h6>
                                                <h3 className="card-title text-success">$0.00</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card">
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-2 text-muted">This Month</h6>
                                                <h3 className="card-title text-success">$0.00</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0">Transaction History</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="text-muted">No transactions yet</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "profile" && (
                            <div>
                                <h2 className="mb-4">Provider Profile</h2>
                                
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleProfileUpdate}>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Business Name</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={profileForm.businessName}
                                                        onChange={(e) => setProfileForm({...profileForm, businessName: e.target.value})}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Contact Person</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={profileForm.name}
                                                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Email</label>
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        value={providerData?.email}
                                                        disabled
                                                        readOnly
                                                    />
                                                    <small className="text-muted">Email cannot be changed</small>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Phone</label>
                                                    <input 
                                                        type="tel" 
                                                        className="form-control" 
                                                        value={profileForm.phone}
                                                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                                        placeholder="(123) 456-7890"
                                                    />
                                                </div>

                                                <div className="col-12">
                                                    <h5 className="mt-3 mb-3">📍 Service Location</h5>
                                                    <div className="alert alert-info">
                                                        <strong>Important:</strong> Add your location so customers can find you in nearby searches!
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <label className="form-label">Street Address</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={profileForm.address}
                                                        onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                                                        placeholder="123 Main Street"
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">City *</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={profileForm.city}
                                                        onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                                                        placeholder="Pittsburgh"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label className="form-label">State *</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={profileForm.state}
                                                        onChange={(e) => setProfileForm({...profileForm, state: e.target.value.toUpperCase()})}
                                                        placeholder="PA"
                                                        maxLength={2}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label className="form-label">Zip Code *</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={profileForm.zipCode}
                                                        onChange={(e) => setProfileForm({...profileForm, zipCode: e.target.value})}
                                                        placeholder="15213"
                                                        maxLength={5}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-12">
                                                    <div className="alert alert-warning">
                                                        <strong>Optional:</strong> If you know your exact coordinates, enter them below. Otherwise, leave blank and we'll use your city/state.
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">Latitude (Optional)</label>
                                                    <input 
                                                        type="number" 
                                                        step="any"
                                                        className="form-control" 
                                                        value={profileForm.latitude}
                                                        onChange={(e) => setProfileForm({...profileForm, latitude: e.target.value})}
                                                        placeholder="40.4406"
                                                    />
                                                    <small className="text-muted">Example: 40.4406 (Pittsburgh)</small>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">Longitude (Optional)</label>
                                                    <input 
                                                        type="number" 
                                                        step="any"
                                                        className="form-control" 
                                                        value={profileForm.longitude}
                                                        onChange={(e) => setProfileForm({...profileForm, longitude: e.target.value})}
                                                        placeholder="-79.9959"
                                                    />
                                                    <small className="text-muted">Example: -79.9959 (Pittsburgh)</small>
                                                </div>

                                                <div className="col-12">
                                                    <label className="form-label">About Your Business</label>
                                                    <textarea 
                                                        className="form-control" 
                                                        rows="4"
                                                        value={profileForm.description}
                                                        onChange={(e) => setProfileForm({...profileForm, description: e.target.value})}
                                                        placeholder="Tell customers about your business..."
                                                    ></textarea>
                                                </div>

                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-primary btn-lg">
                                                        💾 Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showServiceModal && (
                            <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Add New Service</h5>
                                            <button 
                                                type="button" 
                                                className="btn-close"
                                                onClick={() => setShowServiceModal(false)}
                                            ></button>
                                        </div>
                                        <form onSubmit={handleAddService}>
                                            <div className="modal-body">
                                                <div className="mb-3">
                                                    <label className="form-label">Service Name *</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={newService.name}
                                                        onChange={(e) => setNewService({...newService, name: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Description</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        value={newService.description}
                                                        onChange={(e) => setNewService({...newService, description: e.target.value})}
                                                    ></textarea>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Category *</label>
                                                    <select
                                                        className="form-select"
                                                        value={newService.category}
                                                        onChange={(e) => setNewService({...newService, category: e.target.value})}
                                                        required
                                                    >
                                                        <option value="pets">🐾 Pet Services</option>
                                                        <option value="beauty">💄 Beauty Services</option>
                                                        <option value="vehicles">🚗 Vehicle Services</option>
                                                        <option value="home">🏠 Home Care Services</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Price ($) *</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="form-control"
                                                        value={newService.price}
                                                        onChange={(e) => setNewService({...newService, price: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Duration (minutes)</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={newService.duration}
                                                        onChange={(e) => setNewService({...newService, duration: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary"
                                                    onClick={() => setShowServiceModal(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary">
                                                    Add Service
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}