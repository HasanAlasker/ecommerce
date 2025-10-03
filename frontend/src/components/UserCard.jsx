import React from "react";

export default function UserCard({ userName, phone, address, email, role }) {
    const Role = role.toUpperCase()
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
      </div>
    </>
  );
}
