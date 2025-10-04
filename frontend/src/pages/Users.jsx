import React, { useEffect, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import UserCard from "../components/UserCard";
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/users`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(true);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Spinner size="lg"></Spinner>;
  }

  if (error) {
    return (
      <h2 style={{ textAlign: "center", color: "#a39e9e" }} className="alone">
        Something went wrong, please try refreshing the page!
      </h2>
    );
  }

  return (
    <div>
      <div className="check-container">
        <h1 className="xLarge">Users Details</h1>
        <p className="mid gray ">Total number of users: {users.length}</p>
        {/* <SearchBar placeholder="Search by email"></SearchBar> */}
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
        {users.map((user) => (
          <UserCard
            key={user._id}
            id={user._id}
            fullName={user.fullName}
            phone={user.phone}
            email={user.email}
            address={user.address}
            role={user.role}
          />
        ))}
      </div>
    </div>
  );
}
