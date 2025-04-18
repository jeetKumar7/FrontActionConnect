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
    <footer className="bg-slate-900 border-t border-white/10">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Stay updated with ActionConnect</h3>
              <p className="text-slate-400">Get the latest news and updates delivered to your inbox.</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-xl font-bold text-white">ActionConnect</span>
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
                  className="text-slate-400 hover:text-white transition-colors"
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
                <h4 className="text-white font-semibold mb-4 capitalize">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="text-slate-400 hover:text-white transition-colors">
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
