import React from "react";
import { useTranslation } from "react-i18next";
import Logo from "../pics/logoText.png";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="top-footer">
        <div className="left-footer">
          <div className="contact-me-footer">
            <h3 className="footer-big-text">{t("contact.title")}</h3>
            <a
              href="mailto:contact@alasker.dev"
              className="footer-small-text hover"
            >
              <i className="ri-mail-line"></i> {t("contact.email")}
            </a>
          </div>

          <div className="social-footer">
            <h3 className="footer-big-text">{t("contact.socialMedia")}</h3>
            <div className="social-icons">
              <a
                href="https://www.linkedin.com/in/hasan-alasker-58682335a/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon"
              >
                <i className="ri-linkedin-box-fill hover"></i>
              </a>
              <a
                href="https://github.com/HasanAlasker"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon"
              >
                <i className="ri-github-fill hover"></i>
              </a>
              <a
                href="https://www.instagram.com/hasan_s_alasker/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon"
              >
                <i className="ri-instagram-fill hover"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="middle-footer">
          <div className="quick-links">
            <h3 className="footer-big-text">{t("footer.quickLinks")}</h3>
            <div className="links-for-footer">
              <a href="#home" className="footer-small-text hover">
                {t("footer.home")}
              </a>
              <a href="#expertise" className="footer-small-text hover">
                {t("footer.expertise")}
              </a>
              <a href="#products" className="footer-small-text hover">
                {t("footer.products")}
              </a>
              <a href="#about" className="footer-small-text hover">
                {t("footer.about")}
              </a>
              <a href="#contact" className="footer-small-text hover">
                {t("footer.contact")}
              </a>
            </div>
          </div>
        </div>

        <div className="right-footer">
          <div className="privacy">
            <h3 className="footer-big-text">{t("footer.privacyPolicy")}</h3>
            <p className="footer-small-text long">{t("footer.privacyText")}</p>
          </div>

          {/* <div className="credit">
                        <h3 className="footer-big-text goldText">{t('footer.credits')}</h3>
                    </div> */}

          <img src={Logo} alt="" className="footerLogo" />
        </div>
      </div>
      <div className="bottom-footer">
        <div className="copyright">
          <h3 className="footer-big-text goldText">{t("footer.copyright")}</h3>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
