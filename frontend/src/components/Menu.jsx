import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";

function Menu({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { orderCount } = useOrder();

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`menu-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>

      {/* Menu */}
      <div className={`open-menu ${isOpen ? "menu-open" : "menu-closed"}`}>
        <div className="close-ham">
          <i className="ri-close-large-line white x-icon" onClick={onClose}>
            <span className="close-tag"></span>
          </i>
        </div>

        {/* User Section */}
        <div className="menu-user-section">
          {!user && (
            <a href="/login" onClick={handleLinkClick}>
              <span className="material-symbols-outlined secColor xLarge">
                login
              </span>
              <span>Login</span>
            </a>
          )}

          {user && user.role === "admin" && (
            <>
              {" "}
              <a href="/orders" onClick={handleLinkClick}>
                <span className="material-symbols-outlined secColor xLarge">
                  receipt
                </span>
                <span>Orders</span>
                {orderCount >= 1 && (
                  <div
                    className="circle"
                    style={{
                      marginLeft: "auto",
                      background: "white",
                      color: "var(--rgb)",
                    }}
                  >
                    {orderCount}
                  </div>
                )}
              </a>
              <hr />
              <a href="/users" onClick={handleLinkClick}>
                <span className="material-symbols-outlined secColor xLarge">
                  people
                </span>
                <span>Users</span>
              </a>
            </>
          )}

          {user && user.role === "user" && (
            <a href="/cart" onClick={handleLinkClick}>
              <span className="material-symbols-outlined secColor xLarge">
                shopping_cart
              </span>
              <span>Cart</span>
              {cart && cart.totalItems >= 1 && (
                <div
                  className="circle"
                  style={{
                    marginLeft: "auto",
                    background: "white",
                    color: "var(--rgb)",
                  }}
                >
                  {cart.totalItems}
                </div>
              )}
            </a>
          )}

          {user && (
            <>
              <hr />
              <a href="#" onClick={handleLogout} style={{ cursor: "pointer" }}>
                <span className="material-symbols-outlined secColor xLarge">
                  logout
                </span>
                <span>Logout</span>
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Menu;
