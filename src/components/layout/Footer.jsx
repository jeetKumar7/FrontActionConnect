import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord, FaHeart, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";

const Footer = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Detect theme changes
  useEffect(() => {
    const isLightMode = document.body.classList.contains("light");
    setIsDarkMode(!isLightMode);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(!document.body.classList.contains("light"));
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const footerLinks = {
    product: [
      { name: "Features", path: "/features" },
      { name: "Success Stories", path: "/stories" },
      { name: "Pricing", path: "/pricing" },
      { name: "FAQs", path: "/faqs" },
    ],
    resources: [
      { name: "Blog", path: "/blog" },
      { name: "Documentation", path: "/docs" },
      { name: "Community", path: "/community" },
      { name: "Events", path: "/events" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Careers", path: "/careers" },
      { name: "Contact", path: "/contact" },
      { name: "Partners", path: "/partners" },
    ],
    legal: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/cookies" },
    ],
  };

  const socialLinks = [
    { name: "GitHub", icon: FaGithub, link: "#" },
    { name: "Twitter", icon: FaTwitter, link: "#" },
    { name: "LinkedIn", icon: FaLinkedin, link: "#" },
    { name: "Discord", icon: FaDiscord, link: "#" },
  ];

  return (
    <footer className={`bg-[var(--bg-secondary)] border-t ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`h-10 w-10 rounded-xl ${
                  isDarkMode ? "bg-cyan-600 shadow-cyan-900/20" : "bg-blue-600 shadow-blue-200/60"
                } flex items-center justify-center shadow-lg`}
              >
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">ActionConnect</span>
            </div>
            <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} mb-6 max-w-md`}>
              Empowering individuals to make meaningful change through community connection and purposeful action.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${
                    isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-blue-600"
                  } transition-colors`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4
                  className={`text-[var(--text-primary)] font-semibold mb-4 capitalize ${
                    isDarkMode ? "" : "text-slate-800"
                  }`}
                >
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className={`${
                          isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-blue-600"
                        } transition-colors`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-8 border-t ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-sm`}>
              © {new Date().getFullYear()} ActionConnect. All rights reserved.
            </div>
            <div className={`flex items-center gap-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"} text-sm`}>
              <span>Made with</span>
              <FaHeart className={isDarkMode ? "text-red-500" : "text-rose-500"} />
              <span>by ActionConnect Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
