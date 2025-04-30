import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord, FaHeart, FaArrowRight } from "react-icons/fa";

const Footer = () => {
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
    <footer className="bg-[var(--bg-secondary)] border-t border-white/10">
      {/* Updated to match container style from Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-900/20">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">ActionConnect</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Empowering individuals to make meaningful change through community connection and purposeful action.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[var(--text-primary)] transition-colors"
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
                <h4 className="text-[var(--text-primary)] font-semibold mb-4 capitalize">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-slate-400 hover:text-[var(--text-primary)] transition-colors"
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
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} ActionConnect. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>Made with</span>
              <FaHeart className="text-red-500" />
              <span>by ActionConnect Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
