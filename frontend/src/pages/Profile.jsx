import React from "react";
import { useAuth } from "../context/AuthContext";
import UserCard from "../components/UserCard";

export default function Profile() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <Spinner size="lg"></Spinner>;
  }

  if (!token) {
    return (
      <h2 style={{ textAlign: "center", color: "#a39e9e" }} className="alone">
        Please login first!
      </h2>
    );
  }

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
          key={user._id}
          userName={user.fullName}
          phone={user.phone}
          email={user.email}
          address={user.address}
          role={user.role}
          myProfile
        />
      </div>
    </div>
  );
}
