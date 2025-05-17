import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const WelcomeContext = createContext();

export const WelcomeProvider = ({ children }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const location = useLocation();

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem("token");

  // Check if user has seen welcome screen
  useEffect(() => {
    // Get the current path
    const currentPath = location.pathname;

    // List of paths where welcome modal should NOT be shown
    const excludedPaths = [
      "/shared", // Excludes all routes starting with /shared/
      "/auth-success",
      // Add any other paths where welcome modal shouldn't show
    ];

    // Check if current path starts with any of the excluded paths
    const isExcludedPath = excludedPaths.some((path) => currentPath.startsWith(path));

    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");

    // Only show welcome if:
    // 1. User is not authenticated
    // 2. User hasn't seen welcome before
    // 3. User is NOT on an excluded path
    if (!isAuthenticated && !hasSeenWelcome && !isExcludedPath) {
      setShowWelcome(true);
    }

    // Listen for custom events to open auth modals
    const handleOpenSignIn = (event) => {
      if (event.detail?.redirectTo) {
        localStorage.setItem("redirectAfterAuth", event.detail.redirectTo);
      }
      setShowSignIn(true);
    };

    const handleOpenSignUp = (event) => {
      if (event.detail?.redirectTo) {
        localStorage.setItem("redirectAfterAuth", event.detail.redirectTo);
      }
      setShowSignUp(true);
    };

    window.addEventListener("openSignIn", handleOpenSignIn);
    window.addEventListener("openSignUp", handleOpenSignUp);

    return () => {
      window.removeEventListener("openSignIn", handleOpenSignIn);
      window.removeEventListener("openSignUp", handleOpenSignUp);
    };
  }, [isAuthenticated, location.pathname]);

  const handleCloseWelcome = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  const handleSignUpClick = () => {
    localStorage.setItem("redirectAfterAuth", "/passion");
    localStorage.setItem("isNewUserOnboarding", "true");
    setShowWelcome(false);
    setShowSignUp(true);
  };

  const handleSignInClick = () => {
    localStorage.setItem("redirectAfterAuth", "/passion");
    localStorage.setItem("isNewUserOnboarding", "true");
    setShowWelcome(false);
    setShowSignIn(true);
  };

  return (
    <WelcomeContext.Provider
      value={{
        showWelcome,
        setShowWelcome,
        handleCloseWelcome,
        handleSignUpClick,
        handleSignInClick,
        showSignIn,
        setShowSignIn,
        showSignUp,
        setShowSignUp,
      }}
    >
      {children}
    </WelcomeContext.Provider>
  );
};

export const useWelcome = () => useContext(WelcomeContext);
