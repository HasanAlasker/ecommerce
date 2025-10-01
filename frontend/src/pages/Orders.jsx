import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../constants/baseUrl";
import { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
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
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (!token) {
    return <h1 className="xLarge center alone">Please login first!</h1>;
  }

  if (loading) {
    return <h2 style={{ textAlign: "center alone" }}>Loading orders...</h2>;
  }

  if (error) {
    return (
      <h2 style={{ textAlign: "center", color: "#a39e9e" }}>
        Something went wrong, please try refreshing the page!
      </h2>
    );
  }

  if (orders.length === 0) {
    return (
      <h2 style={{ textAlign: "center", color: "#a39e9e" }}>No orders found</h2>
    );
  }

  return (
    <div>
      {orders && orders.length > 0 ? (
        <>
          <div className="check-container">
            <h1 className="xLarge">Received Orders</h1>
            <p className="mid gray ">Total Orders: {orders.length}</p>
            <div className="flexList marginBo">
              {orders.map((item) => (
                <OrderCard
                  key={item._id}
                  userName={item.userName}
                  phone={item.userPhone}
                  email={item.userEmail}
                  address={item.address}
                  total={item.total}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="center alone">Your cart is empty</p>
      )}
    </div>
  );
}
