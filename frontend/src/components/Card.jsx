import React, { useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const createProduct = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Product:", error);
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting Product:", error);
    throw error;
  }
};

const updateProduct = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating Product:", error);
    throw error;
  }
};

export default function Card({
  id,
  name,
  image,
  price,
  stock,
  quantity = 1,
  total,
  isAdmin,
  cartPage = false,
  addCard = false,
  onSave,
  onDelete,
  onAddToCart,
  onRemove,
  // onQuantityChange,
  discountedPrice,
  onProductAdded,
}) {
  const [isEditing, setIsEditing] = useState(false);
  // const [selectedQuantity, setSelectedQuantity] = useState(quantity);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const [editName, setEditName] = useState(name || "");
  const [editPrice, setEditPrice] = useState(price || "");
  const [editDiscountedPrice, setEditDiscountedPrice] = useState(
    discountedPrice || ""
  );
  const [editStock, setEditStock] = useState(stock || "");
  const [editImage, setEditImage] = useState(image || "");
  const {user} = useAuth()

  const handleSave = async () => {
    if (!editName || !editPrice || !editStock) {
      alert("Please fill in all required fields (name, price, stock)");
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        name: editName,
        price: Number(editPrice),
        stock: Number(editStock),
        image: editImage,
        ...(editDiscountedPrice && {
          discountedPrice: Number(editDiscountedPrice),
        }),
      };

      if (addCard) {
        const newProduct = await createProduct(productData);
        console.log("Product created:", newProduct);

        alert("Product added successfully!");

        if (onProductAdded) {
          onProductAdded(newProduct);
        }

        setEditName("");
        setEditPrice("");
        setEditDiscountedPrice("");
        setEditStock("");
        setEditImage("");
      } else {
        const updatedProduct = await updateProduct(id, productData);
        console.log("Product updated:", updatedProduct);

        alert("Product updated successfully!");

        if (onSave) {
          onSave(updatedProduct);
        }

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteProduct(id);
      alert("Product deleted successfully!");

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (addCard) {
      setEditName("");
      setEditPrice("");
      setEditDiscountedPrice("");
      setEditStock("");
      setEditImage("");
    } else {
      setEditName(name);
      setEditPrice(price);
      setEditDiscountedPrice(discountedPrice);
      setEditStock(stock);
      setEditImage(image);
      setIsEditing(false);
    }
  };

  // const handleQuantityChange = (newQuantity) => {
  //   setSelectedQuantity(newQuantity);
  //   if (onQuantityChange) {
  //     onQuantityChange(newQuantity);
  //   }
  // };

const handleAddToCart = () => {
  if(!user){
    navigate('/login');
    return;
  }
  if (onAddToCart) {
    onAddToCart(1);
  }
};

  const quantityOptions = [];
  for (let i = 1; i <= Math.min(stock || 10, 10); i++) {
    quantityOptions.push(i);
  }

  const cardTypes = {
    CUSTOMER_PRODUCT: !isAdmin && !cartPage,
    CUSTOMER_CART: !isAdmin && cartPage,
    ADMIN_ADD: isAdmin && addCard,
    ADMIN_EDIT: isAdmin && isEditing,
    ADMIN_VIEW: isAdmin && !isEditing && !addCard,
  };

  const renderImage = () => {
    if ((isAdmin && isEditing) || addCard) {
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
        src={
          image ||
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
        }
        alt="product"
        onError={(e) => {
          e.target.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
        }}
      />
    );
  };

  const renderName = () => {
    if ((isAdmin && isEditing) || addCard) {
      return (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Product Name *"
          className="editInput large priColor"
          required
        />
      );
    }

    return <h2 className="large priColor">{name || "New Product"}</h2>;
  };

  const renderPrice = () => {
    if ((isAdmin && isEditing) || addCard) {
      return (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            className="editInput mid"
            step="0.01"
            placeholder="Regular Price * (JD)"
            required
          />
          <input
            type="number"
            value={editDiscountedPrice}
            onChange={(e) => setEditDiscountedPrice(e.target.value)}
            className="editInput mid"
            step="0.01"
            placeholder="Discounted Price (optional)"
          />
        </div>
      );
    }

    if (discountedPrice) {
      return (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <h2
            className="mid priceText"
            style={{ textDecoration: "line-through", color: "#a39e9e" }}
          >
            {price} JD
          </h2>
          <h2 className="mid priceText">{discountedPrice} JD</h2>
        </div>
      );
    }

    return (
      <h2 className="mid priceText">
        {price ? `${price} JD` : "Price not set"}
      </h2>
    );
  };

  const renderStock = () => {
    if ((isAdmin && isEditing) || addCard) {
      return (
        <input
          type="number"
          value={editStock}
          onChange={(e) => setEditStock(e.target.value)}
          placeholder="Stock Quantity *"
          className="editInput small gray"
          min="0"
          required
        />
      );
    }

    if (isAdmin && !isEditing && !addCard) {
      return <h2 className="gray small">In stock: {stock || 0}</h2>;
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

  // const renderQuantitySelect = () => {
  //   return (
  //     <select
  //       value={selectedQuantity}
  //       onChange={(e) => handleQuantityChange(Number(e.target.value))}
  //       className="secBtn small"
  //     >
  //       {quantityOptions.map((num) => (
  //         <option key={num} value={num}>
  //           {num}
  //         </option>
  //       ))}
  //     </select>
  //   );
  // };

  const disableAddToCart = () => {
    if (stock === 0 && !isAdmin) {
      return true;
    }
    return false;
  };

  const renderPrimaryButton = () => {
    if (cardTypes.CUSTOMER_PRODUCT) {
      return (
        <button
          className={disableAddToCart() ? "disBtn small" : "priBtn small"}
          disabled={disableAddToCart()}
          onClick={handleAddToCart}
        >
          {disableAddToCart() ? "Out of stock" : "Add to cart"}
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

    if (cardTypes.ADMIN_ADD || cardTypes.ADMIN_EDIT) {
      return (
        <button
          className="priBtn small"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : addCard ? "Add Product" : "Save Changes"}
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
      // return renderQuantitySelect();
      return null;
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
        <button
          className="secBtn small"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      );
    }

    return null;
  };

  return (
    <div className="productCard">
      <div className="topCard">
        <div className="imagePlaceholder">{renderImage()}</div>
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
