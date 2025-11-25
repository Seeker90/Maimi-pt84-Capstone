/* -------------------- LOGIN FUNCTION -------------------- */

export const login = async (email, password, role) => {
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
        },
        body: JSON.stringify({ username: email, password, role })
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, options);

    if (!response.ok) {
        const data = await response.json();
        console.log(data.message);

        return {
            error: {
                status: response.status,
                statusText: response.statusText,
                message: data.message
            }
        };
    }

    const data = await response.json();

    sessionStorage.setItem("token", data.token);

    return {
        token: data.token,
        role: data.role,
        user_id: data.user_id,
        isLoginSuccessful: true
    };
};

const API_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token")
    console.log("getAuthHeaders - token from sessionStorage:", token)
    
    if (!token) {
        console.error("No token found in sessionStorage!")
    }
    
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }
}


export const authAPI = {
    login: async (username, password, role) => {
        const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role })
        });
        return response;
    },

    signup: async (full_name, email, password, role, business_name = null) => {
        const response = await fetch(`${API_URL}/api/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name, email, password, role, business_name })
        });
        return response;
    }
};


export const providerAPI = {
    getProfile: async () => {
        const response = await fetch(`${API_URL}/api/provider/profile`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    },

    updateLocation: async (locationData) => {
        const response = await fetch(`${API_URL}/api/provider/location`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(locationData)
        });
        if (!response.ok) throw new Error('Failed to update location');
        return response.json();
    },

    updateProfile: async (profileData) => {
        const response = await fetch(`${API_URL}/api/provider/profile`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        });
        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
    },

    getServices: async () => {
        const response = await fetch(`${API_URL}/api/provider/services`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch services');
        return response.json();
    },

    createService: async (serviceData) => {
        console.log('Creating service with data:', serviceData);
        console.log('Auth token:', sessionStorage.getItem("token"));

        const response = await fetch(`${API_URL}/api/provider/services`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(serviceData)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const error = await response.json();
            console.log('Error response:', error);
            throw new Error(error.message || 'Failed to create service');
        }

        const data = await response.json();
        console.log('Success response:', data);
        return data;
    },

    updateService: async (serviceId, serviceData) => {
        const response = await fetch(`${API_URL}/api/provider/services/${serviceId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(serviceData)
        });
        if (!response.ok) throw new Error('Failed to update service');
        return response.json();
    },

    deleteService: async (serviceId) => {
        const response = await fetch(`${API_URL}/api/provider/services/${serviceId}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete service');
        return response.json();
    },

    getBookings: async (status = null) => {
        let url = `${API_URL}/api/provider/bookings`;
        if (status) url += `?status=${status}`;

        const response = await fetch(url, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return response.json();
    },

    getBookingDetails: async (bookingId) => {
        const response = await fetch(`${API_URL}/api/provider/bookings/${bookingId}`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch booking details');
        return response.json();
    },

    updateBookingStatus: async (bookingId, status) => {
        const response = await fetch(`${API_URL}/api/provider/bookings/${bookingId}/status`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update booking status');
        return response.json();
    },

    getEarnings: async () => {
        const response = await fetch(`${API_URL}/api/provider/earnings`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch earnings');
        return response.json();
    }
};

export const customerAPI = {

    createBooking: async (serviceId) => {
        const response = await fetch(`${API_URL}/api/bookings`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ service_id: serviceId })
        });
        if (!response.ok) throw new Error('Failed to create booking');
        return response.json();
    },

    getCustomerBookings: async () => {
        const response = await fetch(`${API_URL}/api/customer/bookings`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return response.json();
    },

    getAllServices: async (category = null) => {
        let url = `${API_URL}/api/services`
        if (category) {
            url += `?category=${category}`
        }
        
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch services')
        return response.json()
    },

    geocodeAddress: async (address) => {
        const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
        
        if (!MAPBOX_API_KEY) {
            throw new Error('MapBox API key not configured');
        }
        
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_API_KEY}&limit=1`
        );
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            const [longitude, latitude] = data.features[0].center;
            return {
                latitude: latitude,
                longitude: longitude,
                formattedAddress: data.features[0].place_name
            };
        }
        
        throw new Error('Address not found');
    },

    getCurrentLocation: () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    (error) => {
                        let errorMessage = 'Unable to get location';
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                errorMessage = 'Location permission denied. Please enable location access.';
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMessage = 'Location information unavailable.';
                                break;
                            case error.TIMEOUT:
                                errorMessage = 'Location request timed out.';
                                break;
                        }
                        reject(new Error(errorMessage));
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            }
        });
    },

    getNearbyServices: async (lat, lon, radius = 25, category = null) => {
        let url = `${API_URL}/api/services/nearby?lat=${lat}&lon=${lon}&radius=${radius}`;
        if (category) {
            url += `&category=${category}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch nearby services');
        return response.json();
    },

    reverseGeocode: async (lat, lon) => {
        const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
        
        if (!MAPBOX_API_KEY) {
            throw new Error('MapBox API key not configured');
        }
        
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_API_KEY}&limit=1`
        );
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            return {
                formattedAddress: feature.place_name,
                city: feature.context?.find(c => c.id.includes('place'))?.text,
                state: feature.context?.find(c => c.id.includes('region'))?.short_code?.split('-')[1],
                zipCode: feature.context?.find(c => c.id.includes('postcode'))?.text
            };
        }
        
        throw new Error('Location not found');
    }
};


  