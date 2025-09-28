import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Banner from "../components/Banner";
import { BASE_URL } from "../constants/baseUrl";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

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

  if (error) {
    return <h2 style={{textAlign:'center', color:'#a39e9e'}} >Something went wrong, please try refreshing the page!</h2>;
  }
  return (
    <>
      <Banner></Banner>
      {products.length === 0 ? (
        <h2 style={{textAlign:'center', color:'#a39e9e'}}>There are no products to show!</h2>
      ) : (
        <div className="card-cont">
          {products.map((p) => (
            <Card key={p._id} id={p._id} {...p} />
          ))}
        </div>
      )}
    </>
  );
}
