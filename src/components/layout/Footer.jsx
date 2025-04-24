import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord, FaHeart } from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    { name: "GitHub", icon: FaGithub, link: "#" },
    { name: "Twitter", icon: FaTwitter, link: "#" },
    { name: "LinkedIn", icon: FaLinkedin, link: "#" },
    { name: "Discord", icon: FaDiscord, link: "#" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 py-12">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -left-1/4 top-1/4 w-1/2 aspect-square rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute -right-1/4 bottom-1/4 w-1/2 aspect-square rounded-full bg-purple-900/20 blur-[120px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        {/* Brand and Social Links */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-2xl">⚡</span>
            </div>
            <span className="text-2xl font-bold text-white">ActionConnect</span>
          </div>
          <p className="text-slate-400 max-w-md mb-6">
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

        {/* Divider */}
        <div className="my-8 border-t border-white/10"></div>

        {/* Footer Links */}
        <div className="flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
          <div className="mb-4 md:mb-0">© {new Date().getFullYear()} ActionConnect. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <FaHeart className="text-red-500" />
            <span>by ActionConnect Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
