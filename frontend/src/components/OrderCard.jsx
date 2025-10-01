import React, { useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/AuthContext";

export default function OrderCard({
  userName,
  phone,
  email,
  address,
  orderItems,
  total,
  id,
  onDelete,
}) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // remove from database
  const handleConfirm = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to confirm this order?`
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Order confirmed successfully!");

      // Notify parent to remove this order from the list
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to delete order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // remove from frontend and restock to 1
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel this order? Stock will be restored.`
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/orders/${id}/cancel`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Order cancelled and stock restored successfully!");

      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="productCard noMaxWidth">
      <div className="topCard">
        <h2 className="large priColor">{userName}</h2>
        <h2 className="mid secColor">{phone}</h2>
        <h2 className="small secColor">{address}</h2>
        <h2 className="small gray">{email}</h2>

        <div style={{ margin: "1rem 0", width: "100%" }}>
          <h3 className="mid secColor">Order Items:</h3>
          {orderItems?.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginTop: "0.5rem",
                padding: "1rem 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <div className="logo-placeholder" style={{ flexShrink: 0 }}>
                <img
                  className="footerLogo"
                  src={item.productImage}
                  alt={item.productName}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: ".4rem",
                }}
              >
                <h2 className="mid priColor">{item.productName}</h2>
                <p className="small gray">Quantity: {item.productQuantity}</p>
                <p className="small secColor">{item.productPrice} JD</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mid priColor">Total: {total} JD</h2>
      </div>
      <div className="ctaCard">
        <button
          className="priBtn small"
          disabled={isLoading}
          onClick={() => handleConfirm(id)}
        >
          Confirm
        </button>
        <button
          className="secBtn small"
          onClick={() => handleDelete(id)}
          disabled={isLoading}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
