/* -------------------- LOGIN FUNCTION -------------------- */

export const login = async (email, password, dispatch) => {
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
        },
        body: JSON.stringify({ email, password })
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/token`, options);

    if (!response.ok) {
        const data = await response.json();
        console.log(data.msg);

        return {
            error: {
                status: response.status,
                statusText: response.statusText,
            }
        };
    }

    const data = await response.json();

    sessionStorage.setItem("token", data.access_token);

    dispatch({
        type: 'fetchedToken',
        payload: {
            token: data.access_token,
            isLoginSuccessful: true,
        }
    });

    return data;
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
    getAllServices: async (category = null) => {
        let url = `${API_URL}/api/services`
        if (category) {
            url += `?category=${category}`
        }
        
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch services')
        return response.json()
    },

    getProviderServices: async (providerId) => {
        const response = await fetch(`${API_URL}/api/providers/${providerId}/services`)
        if (!response.ok) throw new Error('Failed to fetch provider services')
        return response.json()
    },

    getProviderDetails: async (providerId) => {
        const response = await fetch(`${API_URL}/api/providers/${providerId}`)
        if (!response.ok) throw new Error('Failed to fetch provider details')
        return response.json()
    }
}
