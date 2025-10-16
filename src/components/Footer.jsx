import React from 'react';
import clsx from 'clsx';

// UPDATED: Custom styles for a wider, softer footer glow
const customFooterStyles = `
@keyframes shimmer {
  0% { transform: translateX(-100%) skewX(-25deg); }
  100% { transform: translateX(300%) skewX(-25deg); }
}

.shimmer-element-footer {
  content: '';
  position: absolute;
  top: 0; 
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
  transform: translateX(-100%) skewX(-25deg); 
  animation: shimmer 4s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
  z-index: 5;
}

/* UPDATED: Glow is now larger and more blurred */
.footer-blue-glow {
  position: absolute;
  bottom: -100px; /* Lowered to spread the glow upwards more naturally */
  left: 50%;
  transform: translateX(-50%);
  width: 800px; /* Significantly wider glow */
  height: 300px; /* Taller glow */
  background: radial-gradient(circle, rgba(29, 78, 216, 0.4) 0%, rgba(29, 78, 216, 0) 70%);
  filter: blur(100px); /* Increased blur for a softer, more spread-out effect */
  pointer-events: none;
  z-index: 1;
  border-radius: 50%;
}
`;

const icons = {
  GitHub: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.72-4.043-1.608-4.043-1.608-.546-1.386-1.332-1.755-1.332-1.755-1.09-.745.083-.728.083-.728 1.205.084 1.838 1.238 1.838 1.238 1.07 1.833 2.81 1.303 3.493.996.108-.775.418-1.303.762-1.603-2.67-.305-5.467-1.334-5.467-5.943 0-1.31.468-2.383 1.236-3.22-.124-.305-.536-1.52.117-3.176 0 0 1.008-.323 3.302 1.232 1.05-.29 2.16-.435 3.268-.44 1.107.005 2.217.15 3.268.44 2.294-1.555 3.302-1.232 3.302-1.232.653 1.656.24 2.87.118 3.176.77.837 1.233 1.91 1.233 3.22 0 4.62-2.8 5.633-5.475 5.934.426.37.817 1.102.817 2.22 0 1.605-.015 2.898-.015 3.28 0 .317.218.687.828.575C20.565 21.802 24 17.307 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  LinkedIn: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.263-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  X: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.682l-8.026 9.177 9.876 13.67H11.55l-6.56-9.136L1.87 23.99H.04l8.36-9.584L-1.77 1.153h3.766l5.772 7.07 7.422-7.07zM12.35 21.056h2.24L4.82 2.946H2.47L12.35 21.056z" />
    </svg>
  ),
};

const Footer = () => {
  const socialLinks = [
    { href: 'https://github.com/your-username', Icon: icons.GitHub, title: 'GitHub' },
    { href: 'https://linkedin.com/in/yourprofile', Icon: icons.LinkedIn, title: 'LinkedIn' },
    { href: 'https://twitter.com/yourhandle', Icon: icons.X, title: 'X (Twitter)' },
  ];

  return (
    <footer className="relative overflow-hidden z-10">
      <style>{customFooterStyles}</style>
      
      <div className="site-footer p-xl pt-20 pb-10 bg-dark/70 backdrop-blur-lg border-t border-white/10 rounded-t-3xl relative overflow-hidden">
        <div className="shimmer-element-footer absolute inset-0"></div>
        <div className="footer-blue-glow"></div>

        <div className="footer-grid grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          <div className="footer-brand">
            <a href="#home" className="text-xl font-bold transition-colors hover:text-accent flex items-center gap-2">
              <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Amogh Hosamane
            </a>
            <p className="text-white/60 max-w-sm mt-4">Design, engineering, and strategy for digital products that last.</p>
          </div>

          <div className="footer-col">
            <h5 className="text-accent mb-4 text-lg font-semibold border-b border-accent/20 pb-2">Contact</h5>
            <ul className="list-none space-y-2 text-white/80">
              <li><a href="mailto:amoghvarsh9614@gmail.com" className="hover:text-accent transition">amoghvarsh9614@gmail.com</a></li>
              <li>India / Remote</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5 className="text-accent mb-4 text-lg font-semibold border-b border-accent/20 pb-2">Connect</h5>
            <div className="footer-socials flex gap-4 mt-6">
              {socialLinks.map(({ href, Icon, title }) => (
                <a 
                  key={title}
                  href={href} 
                  target="_blank" 
                  title={title} 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 transition-all duration-300 hover:text-accent hover:scale-110"
                >
                  <Icon className="w-6 h-6"/>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-16 pt-5 border-t border-white/10 flex justify-between text-sm text-white/50 flex-wrap gap-4 relative z-10">
          <span>Built with intent.</span>
          <span>© 2025 Amogh Hosamane. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
