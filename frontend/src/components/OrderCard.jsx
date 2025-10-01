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
  onDelete
}) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="productCard noMaxWidth">
      <div className="topCard">
        <h2 className="large priColor">{userName}</h2>
        <h2 className="mid secColor">{phone}</h2>
        <h2 className="small secColor">{address}</h2>
        <h2 className="small gray">{email}</h2>
        <h2 className="mid secColor">{orderItems[0].productName}</h2>
        <h2 className="mid priColor">Total: {total} JD</h2>
      </div>
      <div className="ctaCard">
        <button className="priBtn small" disabled={isLoading} onClick={() => handleConfirm(id)}>
          Confirm
        </button>
        <button className="secBtn small" disabled={isLoading}>Delete</button>
      </div>
    </div>
  );
}
