import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const ProviderDashboard = () => {
    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [activeTab, setActiveTab] = useState("overview")
    const [providerData, setProviderData] = useState(null)
    const [services, setServices] = useState([])
    const [bookings, setBookings] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const role = localStorage.getItem("role")
        
        if (!token || role !== "provider") {
            navigate("/login")
            return
        }
        
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setIsLoading(true)
        try {
            const token = localStorage.getItem("token")
          
            const profileResponse = await fetch(`${backendUrl}/api/provider/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            
            if (profileResponse.ok) {
                const profileData = await profileResponse.json()
                setProviderData(profileData)
            }
            const servicesResponse = await fetch(`${backendUrl}/api/provider/services`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            
            if (servicesResponse.ok) {
                const servicesData = await servicesResponse.json()
                setServices(servicesData)
            }
            
            const bookingsResponse = await fetch(`${backendUrl}/api/provider/bookings`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            
            if (bookingsResponse.ok) {
                const bookingsData = await bookingsResponse.json()
                setBookings(bookingsData)
            }
            
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        sessionStorage.removeItem("userSession")
        navigate("/login")
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
                                    <button className="btn btn-primary">
                                        + Add New Service
                                    </button>
                                </div>

                                {services.length === 0 ? (
                                    <div className="card text-center p-5">
                                        <h4>No services yet</h4>
                                        <p className="text-muted">Start by adding your first service</p>
                                        <button className="btn btn-primary">Add Service</button>
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
                                                                <button className="btn btn-outline-danger">Delete</button>
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
                                        <form>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Business Name</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        defaultValue={providerData?.businessName}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Contact Person</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        defaultValue={providerData?.name}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Email</label>
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        defaultValue={providerData?.email}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Phone</label>
                                                    <input 
                                                        type="tel" 
                                                        className="form-control" 
                                                        defaultValue={providerData?.phone}
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label">Service Categories</label>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="pets" />
                                                        <label className="form-check-label" htmlFor="pets">
                                                            🐾 Pet Services
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="beauty" />
                                                        <label className="form-check-label" htmlFor="beauty">
                                                            💄 Beauty Services
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="vehicles" />
                                                        <label className="form-check-label" htmlFor="vehicles">
                                                            🚗 Vehicle Services
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="home" />
                                                        <label className="form-check-label" htmlFor="home">
                                                            🏠 Home Care Services
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label">About Your Business</label>
                                                    <textarea 
                                                        className="form-control" 
                                                        rows="4"
                                                        defaultValue={providerData?.description}
                                                    ></textarea>
                                                </div>
                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
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