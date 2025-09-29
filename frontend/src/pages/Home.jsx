// Update your Home component
import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Banner from "../components/Banner";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const { user } = useAuth();

  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/products`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(true);
      }
    };

    fetchProducts();
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(prev => 
      prev.map(product => 
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  const handleProductDeleted = (productId) => {
    setProducts(prev => prev.filter(product => product._id !== productId));
  };

  if (error) {
    return (
      <h2 style={{textAlign:'center', color:'#a39e9e'}}>
        Something went wrong, please try refreshing the page!
      </h2>
    );
  }

  return (
    <>
      {/* <Banner /> */}
      {products.length === 0 && !isAdmin ? (
        <h2 style={{textAlign:'center', color:'#a39e9e'}}>
          There are no products to show!
        </h2>
      ) : (
        <div className="card-cont">
          {isAdmin && (
            <Card 
              addCard 
              isAdmin 
              onProductAdded={handleProductAdded}
            />
          )}
          {products.map((p) => (
            <Card 
              key={p._id} 
              id={p._id} 
              {...p}
              isAdmin={isAdmin}
              onSave={handleProductUpdated}
              onDelete={() => handleProductDeleted(p._id)}
            />
          ))}
        </div>
      )}
    </>
  );
}