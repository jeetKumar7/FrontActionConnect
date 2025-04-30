import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaGithub, FaCheckCircle } from "react-icons/fa";
import Modal from "../common/Modal";
import { login, register } from "../../services";

export const SignInModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      const response = await login(formData);

      if (response.error) {
        setError(response.error);
      } else {
        if (!response.token) {
          setError("Invalid response from server: missing token");
          return;
        }

        // Store authentication data in localStorage
        localStorage.setItem("token", response.token);
        if (response.user) {
          if (response.user._id) localStorage.setItem("userId", response.user._id);
          if (response.user.name) localStorage.setItem("userName", response.user.name);
          if (response.user.email) localStorage.setItem("userEmail", response.user.email);
        }

        // Show success state
        setSuccess(true);

        // Wait for success animation
        setTimeout(() => {
          // Trigger auth state update
          window.dispatchEvent(new Event("storage"));

          // Close modal
          onClose();

          // Reset form and states
          setFormData({ email: "", password: "" });
          setSuccess(false);

          // Refresh page
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <FaCheckCircle />
              <span>Successfully signed in!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaEnvelope className="text-slate-400" />
            </div>
            <input
              type="email"
              placeholder="Email address"
              required
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-slate-400" />
            </div>
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-slate-300">
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
          <button type="button" className="text-blue-400 hover:text-blue-300">
            Forgot password?
          </button>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-[var(--text-primary)] py-3 rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          whileHover={loading ? {} : { scale: 1.02 }}
          whileTap={loading ? {} : { scale: 0.98 }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </motion.button>

        <div className="relative text-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-slate-800 px-4 text-sm text-slate-400">Or continue with</span>
        </div>

        <div className="flex justify-center">
          <motion.button
            type="button"
            onClick={() => (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/user/auth/google`)}
            className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-lg text-[var(--text-primary)] hover:bg-white/5 w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaGoogle /> Continue with Google
          </motion.button>
          {/* <motion.button
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-lg text-[var(--text-primary)] hover:bg-white/5"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaGithub /> GitHub
          </motion.button> */}
        </div>
      </form>
    </Modal>
  );
};

export const SignUpModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.error) {
        setError(response.error);
      } else if (response.token) {
        // Store authentication data in localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.user?._id);
        if (response.user?.name) {
          localStorage.setItem("userName", response.user.name);
        }

        // Show success state
        setSuccess(true);

        // Wait for success animation
        setTimeout(() => {
          // Trigger auth state update
          window.dispatchEvent(new Event("storage"));

          // Close modal
          onClose();

          // Reset form and states
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
          setSuccess(false);

          // Refresh page
          window.location.reload();
        }, 1500);
      } else {
        console.error("Invalid response format", response);
        setError("Unexpected response format. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <FaCheckCircle />
              <span>Account created successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaUser className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Full name"
              required
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaEnvelope className="text-slate-400" />
            </div>
            <input
              type="email"
              placeholder="Email address"
              required
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-slate-400" />
            </div>
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-slate-400" />
            </div>
            <input
              type="password"
              placeholder="Confirm password"
              required
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>
        </div>

        <div className="text-sm text-slate-300">
          <label className="flex items-center">
            <input type="checkbox" required className="mr-2" />I agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-[var(--text-primary)] py-3 rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          whileHover={loading ? {} : { scale: 1.02 }}
          whileTap={loading ? {} : { scale: 0.98 }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </motion.button>

        <div className="relative text-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-slate-800 px-4 text-sm text-slate-400">Or continue with</span>
        </div>

        <div className="flex justify-center">
          <motion.button
            type="button"
            onClick={() => (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/user/auth/google`)}
            className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-lg text-[var(--text-primary)] hover:bg-white/5 w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaGoogle /> Continue with Google
          </motion.button>
          {/* <motion.button
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-lg text-[var(--text-primary)] hover:bg-white/5"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaGithub /> GitHub
          </motion.button> */}
        </div>

        {/* <p className="text-center text-slate-400 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (typeof onSwitchToSignIn === "function") {
                setTimeout(() => {
                  onSwitchToSignIn();
                }, 100);
              }
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            Sign in
          </button>
        </p> */}
      </form>
    </Modal>
  );
};
