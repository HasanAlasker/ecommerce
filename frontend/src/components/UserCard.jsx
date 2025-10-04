import React, { useState } from "react";
import { BASE_URL } from "../constants/baseUrl";


const editUser = async (id, data) => {
  try {
    console.log(`Updating user at: ${BASE_URL}/users/${id}`);

    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error editing user:", error);
    throw error;
  }
};

const deleteUser = async (id,) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export default function UserCard({
  id,
  fullName,
  phone,
  address,
  email,
  role,
  myProfile = false,
  onSave,
  onDelete,
}) {
  const Role = role?.toUpperCase() || "USER";
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit state
  const [editFullName, setEditFullName] = useState(fullName || "");
  const [editEmail, setEditEmail] = useState(email || "");
  const [editPhone, setEditPhone] = useState(phone || "");
  const [editAddress, setEditAddress] = useState(address || "");

  const handleSave = async () => {
    if (!editFullName || !editEmail) {
      alert("Please fill in all required fields (name and email)");
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        fullName: editFullName,
        email: editEmail,
        phone: editPhone,
        address: editAddress,
      };

      console.log("Sending user data:", userData);
      console.log("User ID:", id);

      const updatedUser = await editUser(id, userData);
      console.log("User updated:", updatedUser);

      alert("Profile updated successfully!");

      if (onSave) {
        onSave(updatedUser);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error message:", error.message);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete your account? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteUser(id);
      alert("Account deleted successfully!");

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditFullName(fullName);
    setEditEmail(email);
    setEditPhone(phone);
    setEditAddress(address);
    setIsEditing(false);
  };

  const renderName = () => {
    if (isEditing) {
      return (
        <input
          type="text"
          value={editFullName}
          onChange={(e) => setEditFullName(e.target.value)}
          placeholder="Full Name *"
          className="editInput large priColor"
          required
        />
      );
    }
    return <h2 className="large priColor">{fullName}</h2>;
  };

  const renderPhone = () => {
    if (isEditing) {
      return (
        <input
          type="tel"
          value={editPhone}
          onChange={(e) => setEditPhone(e.target.value)}
          placeholder="Phone Number"
          className="editInput mid secColor"
        />
      );
    }
    return <h2 className="mid secColor">{phone}</h2>;
  };

  const renderAddress = () => {
    if (isEditing) {
      return (
        <input
          type="text"
          value={editAddress}
          onChange={(e) => setEditAddress(e.target.value)}
          placeholder="Address"
          className="editInput small secColor"
        />
      );
    }
    return <h2 className="small secColor">{address}</h2>;
  };

  const renderEmail = () => {
    if (isEditing) {
      return (
        <input
          type="email"
          value={editEmail}
          onChange={(e) => setEditEmail(e.target.value)}
          placeholder="Email *"
          className="editInput small gray"
          required
        />
      );
    }
    return <h2 className="small gray">{email}</h2>;
  };

  const renderPrimaryButton = () => {
    if (isEditing) {
      return (
        <button
          className="priBtn small"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      );
    }

    return (
      <button
        className="priBtn small"
        onClick={() => setIsEditing(true)}
        disabled={isLoading}
      >
        Edit
      </button>
    );
  };

  const renderSecondaryButton = () => {
    if (isEditing) {
      return (
        <button className="secBtn small" onClick={handleCancel}>
          Cancel
        </button>
      );
    }

    return (
      <button
        className="secBtn small"
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete"}
      </button>
    );
  };

  return (
    <div className="productCard noMaxWidth">
      <div className="topCard">
        {renderName()}
        {renderPhone()}
        {renderAddress()}
        {renderEmail()}
        {role === "admin" && <h2 className="small priColor">{Role}</h2>}
      </div>
      {myProfile && (
        <div className="ctaCard">
          {renderPrimaryButton()}
          {renderSecondaryButton()}
        </div>
      )}
    </div>
  );
}