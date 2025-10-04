import React, { useState } from "react";

export default function UserCard({
  userName,
  phone,
  address,
  email,
  role,
  myProfile = false,
}) {
  const Role = role.toUpperCase();
  const [loading, setIsLoading] =  useState(false)

  const handleEdit = () => {
    setIsLoading(true)
    setIsLoading(false)
  }

  const handleDelete = () => {

  }
  return (
    <>
      <div className="productCard noMaxWidth">
        <div className="topCard">
          <h2 className="large priColor">{userName}</h2>
          <h2 className="mid secColor">{phone}</h2>
          <h2 className="small secColor">{address}</h2>
          <h2 className="small gray">{email}</h2>
          {role === "admin" && <h2 className="small priColor">{Role}</h2>}
        </div>
        {myProfile && (
          <div className="ctaCard">
            <button
              className="priBtn small"
              disabled={loading}
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="secBtn small"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
}
