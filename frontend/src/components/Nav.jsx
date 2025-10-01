import logo from "../assets/pics/navLogo.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";

function Nav() {
  //   const [activeSection, setActiveSection] = useState("home");

  //   useEffect(() => {
  //     const observerOptions = {
  //       root: null,
  //       rootMargin: "-30% 0px -30% 0px", // Trigger when section is in the middle of viewport
  //       threshold: 0,
  //     };

  //     const observerCallback = (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           setActiveSection(entry.target.id);
  //         }
  //       });
  //     };

  //     const observer = new IntersectionObserver(
  //       observerCallback,
  //       observerOptions
  //     );

  //     // Observe all sections
  //     const sections = document.querySelectorAll(
  //       "#home, #expertise, #products, #about, #vision, #contact"
  //     );
  //     sections.forEach((section) => observer.observe(section));

  //     return () => {
  //       sections.forEach((section) => observer.unobserve(section));
  //     };
  //   }, []);

  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { orderCount } = useOrder();



  return (
    <>
      <nav>
        <div className="nav-cont">
          <a href="/">
            <img src={logo} className="logo" alt="logo"></img>
          </a>

          {/* <h2 className="priColor mid">
            {cart && <div>{cart.totalItems}</div>}
          </h2> */}

          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            {!user && (
              <a href="/login">
                <div
                  className="secBtn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                  }}
                >
                  <span className="priColor extraSmall">Login</span>
                  <span className="material-symbols-outlined priColor smallIcon">
                    person
                  </span>
                </div>
              </a>
            )}
            {user && user.role === "admin" && (
              <a href="/orders">
                <div
                  className="secBtn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                  }}
                >
                  <span className="priColor extraSmall">Orders</span>
                  <span className="material-symbols-outlined priColor smallIcon">
                    receipt
                  </span>
                  {orderCount >= 1 && (
                    <div className="notification">{orderCount}</div>
                  )}
                </div>
              </a>
            )}
            {user && user.role === "user" && (
              <a href="/cart">
                <div
                  className="secBtn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                  }}
                >
                  <span className="priColor extraSmall">Cart</span>
                  <span className="material-symbols-outlined priColor smallIcon">
                    shopping_cart
                  </span>
                  {cart && cart.totalItems >= 1 && (
                    <div className="notification">{cart.totalItems}</div>
                  )}
                </div>
              </a>
            )}

            {user && (
              <button
                onClick={logout}
                style={{ border: "none", backgroundColor: "transparent" }}
              >
                <div
                  className="secBtn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                  }}
                >
                  <span className="priColor extraSmall">Logout</span>
                  <span className="material-symbols-outlined priColor smallIcon">
                    logout
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav;
