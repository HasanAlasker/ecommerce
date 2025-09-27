import React, { useState } from "react";

export default function Card({
  productName,
  productImage,
  productPrice,
  productStock,
  quantity = 1,
  total,
  isAdmin = false,
  cartPage = false,
  addCard = false,
  onSave,
  onDelete,
  onAddToCart,
  onRemove,
  onQuantityChange
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);
  if(isAdding){
    console.log('d')
  }
  
  // Editing state
  const [editName, setEditName] = useState(productName);
  const [editPrice, setEditPrice] = useState(productPrice);
  const [editStock, setEditStock] = useState(productStock);
  const [editImage, setEditImage] = useState(productImage);

  const handleSave = () => {
    if (onSave) {
      onSave({
        name: editName,
        price: editPrice,
        stock: editStock,
        image: editImage
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(productName);
    setEditPrice(productPrice);
    setEditStock(productStock);
    setEditImage(productImage);
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
  for (let i = 1; i <= Math.min(productStock, 10); i++) {
    quantityOptions.push(i);
  }

  return (
    <div className="productCard">
      <div className="topCard">
        <div className="imagePlaceholder">
          {isAdmin && isEditing ? (
            <input
              type="url"
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
              placeholder="Enter image URL"
              className="imageInput"
            />
          ) : (
            <img 
              className="productImage" 
              src={productImage} 
              alt="product"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
              }}
            />
          )}
        </div>
        
        {isAdmin && isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="editInput large priColor"
          />
        ) : (
          <h2 className="large priColor">{productName}</h2>
        )}
        
        {isAdmin && isEditing ? (
          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(Number(e.target.value))}
            className="editInput mid"
            step="0.01"
          />
        ) : (
          <h2 className="mid priceText">
            {productPrice} JD
          </h2>
        )}
        
        {isAdmin && isEditing ? (
          <input
            type="number"
            value={editStock}
            onChange={(e) => setEditStock(Number(e.target.value))}
            className="editInput small gray"
            min="0"
          />
        ) : (
          <h2 className="gray small">In stock: {productStock}</h2>
        )}
        
        {!isAdmin && cartPage && (
          <>
            <h2 className="gray small">Quantity: {quantity}</h2>
            <h2 className="red mid totalText">Total: {total} JD</h2>
          </>
        )}
      </div>

      <div className="ctaCard">
        {/* Primary Button Logic */}
        {!isAdmin && !cartPage ? (
          <button className="priBtn small" onClick={handleAddToCart}>
            Add to cart
          </button>
        ) : !isAdmin && cartPage ? (
          <button className="priBtn small" onClick={onRemove}>
            Remove
          </button>
        ) : isAdmin && addCard ? (
          <button className="priBtn small" onClick={() => setIsAdding(true)}>
            Add Product
          </button>
        ) : isAdmin && !isEditing ? (
          <button className="priBtn small" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : isAdmin && isEditing ? (
          <button className="priBtn small" onClick={handleSave}>
            Save
          </button>
        ) : null}

        {/* Secondary Button Logic */}
        {!isAdmin && !cartPage ? (
          <select
            value={selectedQuantity}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="secBtn small"
          >
            {quantityOptions.map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        ) : !isAdmin && cartPage ? (
          <select
            value={selectedQuantity}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="secBtn small"
          >
            {quantityOptions.map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        ) : isAdmin && isEditing ? (
          <button className="secBtn small" onClick={handleCancel}>
            Cancel
          </button>
        ) : isAdmin && !isEditing && !addCard ? (
          <button className="secBtn small " onClick={onDelete}>
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}