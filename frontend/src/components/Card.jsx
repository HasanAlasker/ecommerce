import React, { useState } from "react";

export default function Card({
  name,
  image,
  price,
  stock,
  quantity = 1,
  total,
  isAdmin = false,
  cartPage = false,
  addCard = false,
  onSave,
  onDelete,
  onAddToCart,
  onRemove,
  onQuantityChange,
  discountedPrice
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);

  // Editing state
  const [editName, setEditName] = useState(name);
  const [editPrice, setEditPrice] = useState(price);
  const [editDiscountedPrice, setEditDiscountedPrice] = useState(discountedPrice);
  const [editStock, setEditStock] = useState(stock);
  const [editImage, setEditImage] = useState(image);

  // Helper functions
  const handleSave = () => {
    if (onSave) {
      onSave({
        name: editName,
        price: editPrice,
        discountedPrice: editDiscountedPrice,
        stock: editStock,
        image: editImage,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(name);
    setEditPrice(price);
    setEditDiscountedPrice(discountedPrice);
    setEditStock(stock);
    setEditImage(image);
    setIsEditing(false);
  };

  const handleQuantityChange = (newQuantity) => {
    setSelectedQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(selectedQuantity);
    }
  };

  // Generate quantity options based on stock
  const quantityOptions = [];
  for (let i = 1; i <= Math.min(stock, 10); i++) {
    quantityOptions.push(i);
  }

  // Card type determination
  const cardTypes = {
    CUSTOMER_PRODUCT: !isAdmin && !cartPage,
    CUSTOMER_CART: !isAdmin && cartPage,
    ADMIN_ADD: isAdmin && addCard,
    ADMIN_EDIT: isAdmin && isEditing,
    ADMIN_VIEW: isAdmin && !isEditing && !addCard
  };

  // Render functions for different sections
  const renderImage = () => {
    if (isAdmin && isEditing || addCard) {
      return (
        <input
          type="url"
          value={editImage}
          onChange={(e) => setEditImage(e.target.value)}
          placeholder="Enter image URL"
          className="imageInput"
        />
      );
    }

    return (
      <img
        className="productImage"
        src={image}
        alt="product"
        onError={(e) => {
          e.target.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
        }}
      />
    );
  };

  const renderName = () => {
    if (isAdmin && isEditing || addCard) {
      return (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Name"
          className="editInput large priColor"
        />
      );
    }

    return <h2 className="large priColor">{name}</h2>;
  };

  const renderPrice = () => {
    if (isAdmin && isEditing || addCard) {
      return (
        <>
          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(Number(e.target.value))}
            className="editInput mid"
            step="0.01"
            placeholder="Regular Price"
          />
          <input
            type="number"
            value={editDiscountedPrice}
            onChange={(e) => setEditDiscountedPrice(Number(e.target.value))}
            className="editInput mid"
            step="0.01"
            placeholder="Discounted Price (optional)"
          />
        </>
      );
    }

    // Show discounted price if available
    if (discountedPrice) {
      return (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <h2
            className="mid priceText"
            style={{ textDecoration: "line-through", color: "#a39e9e" }}
          >
            {price} JD
          </h2>
          <h2 className="mid priceText">
            {discountedPrice} JD
          </h2>
        </div>
      );
    }

    // Show regular price
    return <h2 className="mid priceText">{price} JD</h2>;
  };

  const renderStock = () => {
    if (isAdmin && isEditing || addCard) {
      return (
        <input
          type="number"
          value={editStock}
          onChange={(e) => setEditStock(Number(e.target.value))}
          placeholder="Stock"
          className="editInput small gray"
          min="0"
        />
      );
    }

    if (isAdmin && !isEditing) {
      return <h2 className="gray small">In stock: {stock}</h2>;
    }

    return null;
  };

  const renderCartInfo = () => {
    if (!isAdmin && cartPage) {
      return (
        <>
          <h2 className="gray small">Quantity: {quantity}</h2>
          <h2 className="red mid totalText">Total: {total} JD</h2>
        </>
      );
    }
    return null;
  };

  const renderQuantitySelect = () => {
    return (
      <select
        value={selectedQuantity}
        onChange={(e) => handleQuantityChange(Number(e.target.value))}
        className="secBtn small"
      >
        {quantityOptions.map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    );
  };

  const renderPrimaryButton = () => {
    if (cardTypes.CUSTOMER_PRODUCT) {
      return (
        <button className="priBtn small" onClick={handleAddToCart}>
          Add to cart
        </button>
      );
    }

    if (cardTypes.CUSTOMER_CART) {
      return (
        <button className="priBtn small" onClick={onRemove}>
          Remove
        </button>
      );
    }

    if (cardTypes.ADMIN_ADD) {
      return (
        <button className="priBtn small" onClick={() => console.log("Add Product clicked")}>
          Add Product
        </button>
      );
    }

    if (cardTypes.ADMIN_EDIT) {
      return (
        <button className="priBtn small" onClick={handleSave}>
          Save
        </button>
      );
    }

    if (cardTypes.ADMIN_VIEW) {
      return (
        <button className="priBtn small" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      );
    }

    return null;
  };

  const renderSecondaryButton = () => {
    if (cardTypes.CUSTOMER_PRODUCT || cardTypes.CUSTOMER_CART) {
      return renderQuantitySelect();
    }

    if (cardTypes.ADMIN_EDIT) {
      return (
        <button className="secBtn small" onClick={handleCancel}>
          Cancel
        </button>
      );
    }

    if (cardTypes.ADMIN_VIEW) {
      return (
        <button className="secBtn small" onClick={onDelete}>
          Delete
        </button>
      );
    }

    return null;
  };

  return (
    <div className="productCard">
      <div className="topCard">
        <div className="imagePlaceholder">
          {renderImage()}
        </div>
        {renderName()}
        {renderPrice()}
        {renderStock()}
        {renderCartInfo()}
      </div>

      <div className="ctaCard">
        {renderPrimaryButton()}
        {renderSecondaryButton()}
      </div>
    </div>
  );
}