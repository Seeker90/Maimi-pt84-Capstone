import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { customerAPI } from "../fetch";
import "./../../lib/CustomerProfile.css";

export const CustomerProfile = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all"); 

    useEffect(() => {
        fetchCustomerServices();
    }, []);

    const fetchCustomerServices = async () => {
        setIsLoading(true);
        setError("");
        
        try {
            const data = await customerAPI.getCustomerBookings();
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
            setError(error.message || "Unable to load your bookings");
        } finally {
            setIsLoading(false);
        }
    };

    const getFilteredServices = () => {
        if (filter === "completed") {
            return services.filter(service => service.status === "completed");
        } else if (filter === "pending") {
            return services.filter(service => service.status === "pending");
        }
        return services;
    };

    const filteredServices = getFilteredServices();

    const getStatusBadgeClass = (status) => {
        if (status === "completed") {
            return "badge bg-success";
        } else if (status === "pending") {
            return "badge bg-warning text-dark";
        }
        return "badge bg-secondary";
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="customer-profile">
            <div className="container mt-5">
                <div className="row mb-4">
                    <div className="col-lg-8">
                        <h1 className="display-5 fw-bold mb-2">My Bookings</h1>
                        <p className="text-muted">View your service bookings and history</p>
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-lg-end mt-3 mt-lg-0">
                        <Link to="/services" className="btn btn-primary btn-lg">
                            ← Back to Services
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <span className="me-2">⚠️</span>
                        <div>{error}</div>
                    </div>
                )}

                <div className="filter-tabs mb-4">
                    <div className="btn-group" role="group">
                        <button
                            type="button"
                            className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setFilter("all")}
                        >
                            All Bookings ({services.length})
                        </button>
                        <button
                            type="button"
                            className={`btn ${filter === "completed" ? "btn-success" : "btn-outline-success"}`}
                            onClick={() => setFilter("completed")}
                        >
                            Completed ({services.filter(s => s.status === "completed").length})
                        </button>
                        <button
                            type="button"
                            className={`btn ${filter === "pending" ? "btn-warning" : "btn-outline-warning"}`}
                            onClick={() => setFilter("pending")}
                        >
                            Pending ({services.filter(s => s.status === "pending").length})
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="alert alert-info text-center py-5">
                        <h5>No bookings found</h5>
                        <p className="text-muted mb-0">You don't have any {filter !== "all" ? filter : ""} bookings yet.</p>
                    </div>
                ) : (
                    <div className="services-list">
                        {filteredServices.map((service) => (
                            <div key={service.id} className="service-item card mb-3 shadow-sm border-0">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-8">
                                            <div className="d-flex align-items-center mb-2">
                                                <h5 className="card-title fw-bold mb-0 me-3">{service.serviceType}</h5>
                                                <span className={getStatusBadgeClass(service.status)}>
                                                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="card-text text-muted mb-2">
                                                <strong>Provider:</strong> {service.providerName}
                                            </p>
                                            <p className="card-text text-muted mb-2">
                                                <strong>Description:</strong> {service.description}
                                            </p>
                                            <p className="card-text text-muted small mb-0">
                                                <strong>Date:</strong> {formatDate(service.serviceDate)}
                                            </p>
                                        </div>
                                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                            <div className="service-details">
                                                <p className="mb-2">
                                                    <strong>Price:</strong> <span className="text-success fs-5">${service.price.toFixed(2)}</span>
                                                </p>
                                                <p className="mb-0">
                                                    <strong>Duration:</strong> {service.duration > 0 ? service.duration : 'N/A'} {service.duration === 1 ? 'hour' : 'hours'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};