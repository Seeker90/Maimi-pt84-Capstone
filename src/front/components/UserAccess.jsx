import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { authAPI } from "../fetch"

export const UserAccess = ({ email, password, setEmail, setPassword }) => {
    const navigate = useNavigate()
    const [role, setRole] = useState("customer")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async() => {
    setError("")
    setIsLoading(true)
    
    try {
        const response = await authAPI.login(email, password, role)
        const data = await response.json()
        
        if(response.ok){
            sessionStorage.setItem("token", data.token)
            sessionStorage.setItem("role", role)
            
            const storageData = {
                token: data.token,
                role: role,
                email: email,
                loginTime: new Date().toISOString()
            }
            
            sessionStorage.setItem("userSession", JSON.stringify(storageData))
            
            if(role === "provider"){
                navigate("/provider-dashboard")
            } else {
                navigate("/services")
            }
            return data
        } else {
            setError(data.message || "Login failed. Please check your credentials.")
        }
    } catch(error) {
        console.error("Network error:", error)
        setError("Unable to connect to server")
    } finally {
        setIsLoading(false)
    }
}

    const handleSubmit = (e) => {
        e.preventDefault()
        handleLogin()
    }

    return (
        <div className="login-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6 col-lg-5">
                        <div className="card shadow-lg login-card">
                            <div className="card-body p-4 p-md-5">
                                <h1 className="text-center mb-2 fw-bold">Welcome Back</h1>
                                <p className="text-center text-muted mb-4">Sign in to your account</p>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Login as:</label>
                                        <div className="role-selector p-3 rounded">
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="role"
                                                    id="customerRole"
                                                    value="customer"
                                                    checked={role === "customer"}
                                                    onChange={e => setRole(e.target.value)}
                                                />
                                                <label className="form-check-label fw-medium" htmlFor="customerRole">
                                                    Customer
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="role"
                                                    id="providerRole"
                                                    value="provider"
                                                    checked={role === "provider"}
                                                    onChange={e => setRole(e.target.value)}
                                                />
                                                <label className="form-check-label fw-medium" htmlFor="providerRole">
                                                    Provider
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            id="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg"
                                            id="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <span className="me-2">⚠️</span>
                                            <div>{error}</div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100 mt-3"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Logging in...
                                            </>
                                        ) : "Login"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
