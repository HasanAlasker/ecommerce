import React, { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "./AuthContext";

const CartProvider = ({ children }) => {
  const { token } = useAuth(); // Use the hook INSIDE the component
  const [cart, setCart] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch cart from API
  const fetchCart = async () => {
    if (!token) return; // Don't fetch if no token

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!token) return false;

    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!token) return false;

    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update quantity:", error);
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      return false;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCart(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to clear cart:", error);
      return false;
    }
  };

  const checkout = async (userId) => {
    if (!token) return false;

    try {
      const response = await fetch(`${BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      return false;
    }
  };

  // Initialize cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cart,
    cartItems: cart?.items || [],
    totalAmount: cart?.totalAmount || 0,
    totalItems: cart?.totalItems || 0,
    isInitialized,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
