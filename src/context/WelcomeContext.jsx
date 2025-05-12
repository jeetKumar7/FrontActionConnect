import React, { createContext, useContext, useState, useEffect } from "react";

const WelcomeContext = createContext();

export const WelcomeProvider = ({ children }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem("token");

  // Check if user has seen welcome screen
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    // Show welcome if user is not authenticated and hasn't seen welcome
    if (!isAuthenticated && !hasSeenWelcome) {
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
  }, [isAuthenticated]);

  const handleCloseWelcome = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  const handleSignUpClick = () => {
    localStorage.setItem("redirectAfterAuth", "/passion");
    setShowWelcome(false);
    setShowSignUp(true);
  };

  const handleSignInClick = () => {
    localStorage.setItem("redirectAfterAuth", "/passion");
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
