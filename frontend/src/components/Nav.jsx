import logo from "../assets/pics/navLogo.png";

function Nav({ onMenuOpen }) {
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

  return (
    <>
      <nav>
        <div className="nav-cont">
          <a href="/">
            <img src={logo} className="logo" alt="logo"></img>
          </a>
          <div className="links"></div>
          <span className="material-symbols-outlined menu" onClick={onMenuOpen}>
            dehaze
          </span>
        </div>
      </nav>
    </>
  );
}

export default Nav;
