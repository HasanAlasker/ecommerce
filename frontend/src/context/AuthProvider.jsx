// AuthProvider.jsx
import React, { useState, useEffect } from "react"
import { AuthContext } from './AuthContext'
import { BASE_URL } from '../constants/baseUrl'

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false) // Add initialization state

    // Login function
    const login = async (email, password) => {
        try {
            // console.log("🚀 Login function called");
            setLoading(true)
            
            const response = await fetch(`${BASE_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()
            // console.log("📦 Login response:", data);

            if (response.ok) {
                // console.log("✅ Login successful, setting user");
                // console.log("🔍 Full response data structure:", data);
                
                // Handle the fixed backend structure
                const token = data.token;
                const user = data.user;
                
                console.log("🔍 Extracted values:", { token, user });
                
                if (!token) {
                    console.error("❌ No token found in response");
                    return { success: false, error: 'No authentication token received' };
                }
                
                if (!user) {
                    console.error("❌ No user data found in response");
                    return { success: false, error: 'No user data received' };
                }
                
                // Set state first
                setUser(user)
                setToken(token)
                
                if (!token) {
                    console.error("❌ No token found in response");
                    return { success: false, error: 'No authentication token received' };
                }
                
                // Set state first
                setUser(user)
                setToken(token)
                
                // Then try localStorage
                try {
                    localStorage.setItem('token', token)
                    localStorage.setItem('user', JSON.stringify(user))
                    // console.log("💾 Saved to localStorage:", { token, user });
                } catch (storageError) {
                    console.warn("Could not save to localStorage:", storageError)
                }
                
                return { success: true, data }
            } else {
                // console.log("❌ Login failed:", data);
                return { success: false, error: data.message || 'Login failed' }
            }
        } catch (error) {
            console.error("💥 Login error:", error);
            return { success: false, error: 'Network error: ' + error.message }
        } finally {
            setLoading(false)
        }
    }

    // Register function
    const register = async (userData) => {
        try {
            // console.log("📝 Register function called");
            setLoading(true)
            
            const response = await fetch(`${BASE_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })

            const data = await response.json()
            // console.log("📦 Register response:", data);

            if (response.ok) {
                // console.log("✅ Registration successful");
                // console.log("🔍 Full registration response:", data);
                
                // Check different possible response structures
                const token = data.token || data.accessToken || data.authToken;
                let user = data.user || data.userData || data;
                
                // Ensure user has a role (default to 'user' if not provided)
                if (user && typeof user === 'object') {
                    user = {
                        ...user,
                        role: user.role || 'user' // Default role
                    };
                }
                
                // console.log("🔍 Extracted registration values:", { token, user });
                
                // Auto-login after successful registration
                if (token && user) {
                    // console.log("✅ Auto-login after registration");
                    setUser(user)
                    setToken(token)
                    
                    try {
                        localStorage.setItem('token', token)
                        localStorage.setItem('user', JSON.stringify(user))
                        // console.log("💾 Saved to localStorage after registration:", { token, user });
                    } catch (storageError) {
                        console.warn("Could not save to localStorage:", storageError)
                    }
                } else {
                    console.warn("⚠️ Registration successful but no token/user for auto-login");
                }
                
                return { success: true, data }
            } else {
                // console.log("❌ Registration failed:", data);
                return { success: false, error: data.message || 'Registration failed' }
            }
        } catch (error) {
            // console.error("💥 Register error:", error);
            return { success: false, error: 'Network error: ' + error.message }
        } finally {
            setLoading(false)
        }
    }

    // Logout function
    const logout = () => {
        // console.log("👋 Logging out");
        setUser(null)
        setToken(null)
        
        try {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        } catch (storageError) {
            console.warn("Could not clear localStorage:", storageError)
        }
    }

    // Check if user is authenticated
    const isAuthenticated = () => {
        return user !== null && token !== null
    }

    // Initialize auth state from localStorage on mount
    const initializeAuth = () => {
        try {
            // console.log("🔄 Initializing auth from localStorage");
            const storedToken = localStorage.getItem('token')
            const storedUser = localStorage.getItem('user')
            
            // console.log("📦 From localStorage:", { storedToken, storedUser });
            
            if (storedToken && storedUser) {
                // console.log("✅ Restoring user from localStorage");
                let parsedUser = JSON.parse(storedUser)
                
                // Ensure restored user has a role
                if (parsedUser && typeof parsedUser === 'object') {
                    parsedUser = {
                        ...parsedUser,
                        role: parsedUser.role || 'user' // Default role if missing
                    };
                }
                
                setToken(storedToken)
                setUser(parsedUser)
                // console.log("👤 User restored:", parsedUser);
            } else {
                console.log("❌ No stored auth data found");
            }
        } catch (error) {
            console.warn("Could not restore from localStorage:", error)
            // Clear potentially corrupted data
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        } finally {
            setIsInitialized(true)
        }
    }

    // Initialize on mount
    useEffect(() => {
        initializeAuth()
    }, [])

    // Debug: Log state changes
    // useEffect(() => {
    //     console.log("🔍 Auth state changed:", { user, token, isInitialized });
    // }, [user, token, isInitialized])

    const value = {
        user,
        token,
        loading,
        isInitialized,
        login,
        register,
        logout,
        isAuthenticated
    }

    // Don't render children until auth is initialized
    if (!isInitialized) {
        return <div>Loading...</div>
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider