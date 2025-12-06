import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Content */}
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <span className="footer-logo-icon">📚</span>
              <span className="footer-logo-text">EduContent</span>
            </div>
            <p className="footer-description">
              Discover, learn, and share quality educational resources with a global community of educators and learners.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" title="Facebook">f</a>
              <a href="#" className="social-link" title="Twitter">𝕏</a>
              <a href="#" className="social-link" title="LinkedIn">in</a>
              <a href="#" className="social-link" title="Instagram">📷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-section-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/browse">Browse</Link>
              </li>
              <li>
                <Link to="/register">Join Us</Link>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>
          </div>

          {/* For Educators */}
          <div className="footer-section">
            <h3 className="footer-section-title">For Educators</h3>
            <ul className="footer-links">
              <li>
                <Link to="/upload">Upload Content</Link>
              </li>
              <li>
                <a href="#benefits">Benefits</a>
              </li>
              <li>
                <a href="#guidelines">Content Guidelines</a>
              </li>
              <li>
                <a href="#support">Support</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3 className="footer-section-title">Legal</h3>
            <ul className="footer-links">
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <a href="#cookies">Cookie Policy</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Divider */}
        <div className="footer-divider" />

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              &copy; {currentYear} EduContent Platform. All rights reserved.
            </p>
          </div>

          <div className="footer-bottom-links">
            <a href="#sitemap">Sitemap</a>
            <span className="divider">•</span>
            <a href="#status">Status</a>
            <span className="divider">•</span>
            <a href="#accessibility">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
