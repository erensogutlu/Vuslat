import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="ana-footer">
      <div className="footer-icerik">
        <div className="footer-sol">
          <span className="footer-logo">Vuslat</span>
          <p className="footer-metin">Afet İletişim ve Koordinasyon Sistemi</p>
        </div>
        <div className="footer-sag">
          <div className="footer-linkler">
            <a href="https://github.com/erensogutlu" target="_blank" rel="noopener noreferrer" className="github-link">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span>erensogutlu</span>
            </a>
          </div>
          <p className="telif">© 2026 Vuslat. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
