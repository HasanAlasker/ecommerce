import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "./AuthContext";
import { OrderContext } from "./OrderContext";

export const OrderProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all orders (for admin)
  const fetchAllOrders = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data);
      setOrderCount(data.length);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setOrderCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch orders for current user
  const fetchUserOrders = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/orders/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data);
      setOrderCount(data.length);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      setOrders([]);
      setOrderCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Remove order from state (after confirm/delete)
  const removeOrder = useCallback((orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    setOrderCount((prevCount) => Math.max(0, prevCount - 1));
  }, []);

  // Add new order to state
  const addOrder = useCallback((newOrder) => {
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    setOrderCount((prevCount) => prevCount + 1);
  }, []);

  // Refresh orders
  const refreshOrders = useCallback(() => {
    if (!token || !user) return;
    
    if (user.role === "admin") {
      fetchAllOrders();
    } else {
      fetchUserOrders();
    }
  }, [token, user, fetchAllOrders, fetchUserOrders]);

  // Auto-fetch orders when token/user changes
  useEffect(() => {
    if (token && user) {
      if (user.role === "admin") {
        fetchAllOrders();
      } else {
        fetchUserOrders();
      }
    } else {
      setOrders([]);
      setOrderCount(0);
    }
  }, [token, user, fetchAllOrders, fetchUserOrders]);

  const value = {
    orders,
    orderCount,
    isLoading,
    fetchAllOrders,
    fetchUserOrders,
    removeOrder,
    addOrder,
    refreshOrders,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export default OrderProvider