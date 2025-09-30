import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../constants/baseUrl";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const getCart = async () => {

      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to get cart, try again');
        }

        const data = await response.json();
        setCart(data);
        console.log('Cart data:', data);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      getCart();
    }
  }, [token]);

  if(!token){
    return <h1 className="xLarge center alone">Please login first!</h1>;
  }

  if (isLoading) {
    return <h1 className="xLarge center alone">Loading cart...</h1>;
  }

  if (error) {
    return <h1 className="xLarge center alone">Error: {error}</h1>;
  }

  return (
    <div>
      <h1 className="xLarge center">My Cart</h1>
      {cart && cart.length > 0 ? (
        <div>
          {/* Render cart items here */}
          <pre>{JSON.stringify(cart, null, 2)}</pre>
        </div>
      ) : (
        <p className="center alone">Your cart is empty</p>
      )}
    </div>
  );
}