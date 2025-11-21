import React, { useState } from 'react';
import { customerAPI } from '../fetch';

export const NearbySearch = ({ onSearchResults, category }) => {
    const [searchMethod, setSearchMethod] = useState('current');
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [radius, setRadius] = useState(25);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [currentAddress, setCurrentAddress] = useState('');

    const handleCurrentLocationSearch = async () => {
        setIsSearching(true);
        setError('');
        
        try {
            const location = await customerAPI.getCurrentLocation();

            try {
                const addressData = await customerAPI.reverseGeocode(
                    location.latitude,
                    location.longitude
                );
                setCurrentAddress(addressData.formattedAddress);
            } catch (err) {
                console.log('Could not get address name');
            }
            
            const results = await customerAPI.getNearbyServices(
                location.latitude,
                location.longitude,
                radius,
                category
            );
            
            onSearchResults(results);
        } catch (error) {
            console.error('Location error:', error);
            setError(error.message || 'Could not get your location. Please try searching manually.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleManualSearch = async (e) => {
        e.preventDefault();
        setIsSearching(true);
        setError('');
        
        try {
            const addressParts = [city, state, zipCode].filter(Boolean);
            const address = addressParts.join(', ');
            
            if (!address) {
                setError('Please enter at least one location field');
                setIsSearching(false);
                return;
            }
            
            const location = await customerAPI.geocodeAddress(address);
            
            const results = await customerAPI.getNearbyServices(
                location.latitude,
                location.longitude,
                radius,
                category
            );
            
            onSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setError(error.message || 'Could not find location. Please check your address and try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title mb-3">🗺️ Find Services Near You</h5>
                
                {currentAddress && (
                    <div className="alert alert-info mb-3">
                        📍 Your location: {currentAddress}
                    </div>
                )}
                
                <div className="mb-3">
                    <label className="form-label fw-semibold">Search Radius</label>
                    <select 
                        className="form-select" 
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                    >
                        <option value={10}>Within 10 miles</option>
                        <option value={25}>Within 25 miles</option>
                        <option value={50}>Within 50 miles</option>
                        <option value={100}>Within 100 miles</option>
                    </select>
                </div>

                <div className="btn-group w-100 mb-3" role="group">
                    <button
                        type="button"
                        className={`btn ${searchMethod === 'current' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setSearchMethod('current')}
                    >
                        Use Current Location
                    </button>
                    <button
                        type="button"
                        className={`btn ${searchMethod === 'manual' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setSearchMethod('manual')}
                    >
                        Enter Location
                    </button>
                </div>

                {searchMethod === 'current' ? (
                    <button 
                        className="btn btn-success w-100"
                        onClick={handleCurrentLocationSearch}
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Searching...
                            </>
                        ) : (
                            '📍 Find Services Near Me'
                        )}
                    </button>
                ) : (
                    <form onSubmit={handleManualSearch}>
                        <div className="row g-2 mb-3">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="State (e.g., PA)"
                                    value={state}
                                    onChange={(e) => setState(e.target.value.toUpperCase())}
                                    maxLength={2}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Zip Code"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    maxLength={5}
                                />
                            </div>
                        </div>
                        <button 
                            type="submit"
                            className="btn btn-success w-100"
                            disabled={isSearching}
                        >
                            {isSearching ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Searching...
                                </>
                            ) : (
                                '🔍 Search'
                            )}
                        </button>
                    </form>
                )}

                {error && (
                    <div className="alert alert-warning mt-3 mb-0">
                        <strong>⚠️ {error}</strong>
                    </div>
                )}
            </div>
        </div>
    );
};