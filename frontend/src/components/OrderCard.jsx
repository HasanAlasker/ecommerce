import React from "react";

export default function OrderCard({userName, phone, email, address, products, total, id}) {
  return (
    <div className="productCard noMaxWidth">
      <div className="topCard">
        <h2 className="large priColor">{userName}</h2>
        <h2 className="mid secColor">{phone}</h2>
        <h2 className="small secColor">{address}</h2>
        <h2 className="small gray">{email}</h2>
        <h2 className="mid secColor">{products}</h2>
        <h2 className="mid priColor">Total: {total} JD</h2>
        <h2 className="mid priColor">{id}</h2>

      </div>
      <div className="ctaCard">
        <button className="priBtn small">Confirm</button>
        <button className="secBtn small">Delete</button>
      </div>
    </div>
  );
}
