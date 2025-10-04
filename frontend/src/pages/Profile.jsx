import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserCard from "../components/UserCard";

export default function Profile() {
  const { user, token, loading, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2 className="large gray">Loading...</h2>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <h2 style={{ textAlign: "center", color: "#a39e9e" }} className="alone">
        Please login first!
      </h2>
    );
  }

  const handleSave = (updatedUser) => {
    // Update the user in AuthContext
    if (updateUser) {
      updateUser(updatedUser);
    }
  };

  const handleDelete = () => {
    // Logout and redirect to home page after account deletion
    logout();
    navigate("/");
  };

  return (
    <div>
      <div className="check-container">
        <h1 className="xLarge">My Account</h1>
      </div>

      <div
        className="check-container marginBo"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          marginTop: "4rem",
        }}
      >
        <UserCard
          key={user.id}
          id={user.id}
          fullName={user.fullName}
          phone={user.phone}
          email={user.email}
          address={user.address}
          role={user.role}
          myProfile
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}