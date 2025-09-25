import React from "react";

export default function Card({
  productName,
  productImage,
  productPrice,
  productStock,
  quantity,
  total,
//   isAdmin=false,
}) {
  return (
    <div className="productCard">
      <div className="topCard">
        <div className="imagePlaceholder">
          <img className="productImage" src={productImage} alt="product" />
        </div>
        <h2>{productName}</h2>
        <h2>{productPrice} JD</h2>
        <h2>In stock: {productStock}</h2>
        <h2>{quantity}</h2>
        <h2>{total}</h2>
      </div>

      <div className="ctaCard">
        <button className="priBtn">fasd</button>
        <button className="secBtn">fasd</button>
      </div>
    </div>
  );
}
