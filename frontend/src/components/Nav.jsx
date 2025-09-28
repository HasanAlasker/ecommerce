import logo from "../assets/pics/navLogo.png";
import { useAuth } from "../context/AuthContext";

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

  return (
    <>
      <nav>
        <div className="nav-cont">
          <a href="/">
            <img src={logo} className="logo" alt="logo"></img>
          </a>

          {/* <h2 className="priColor mid">
            Welcome {user ? `back ${user.fullName}` : "Guest"}
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
                  <span className="small priColor">Login</span>
                  <span className="material-symbols-outlined priColor large">
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
                  <span className="small priColor">Orders</span>
                  <span className="material-symbols-outlined priColor large">
                    receipt
                  </span>
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
                  <span className="small priColor">Cart</span>
                  <span className="material-symbols-outlined priColor large">
                    shopping_cart
                  </span>
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
                  <span className="small priColor">Logout</span>
                  <span className="material-symbols-outlined priColor large">
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
