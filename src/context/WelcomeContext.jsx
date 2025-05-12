import React, { createContext, useContext, useState, useEffect } from "react";

const WelcomeContext = createContext();

export const WelcomeProvider = ({ children }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState("welcome"); // welcome, signUp, signIn, passionQuiz, completed
  const [redirectAfterAuth, setRedirectAfterAuth] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem("token");

  // Check if user has seen welcome screen
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    // Show welcome if user is not authenticated and hasn't seen welcome
    if (!isAuthenticated && !hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, [isAuthenticated]);

  const handleCloseWelcome = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  const handleSignUpClick = () => {
    setRedirectAfterAuth("/passion");
    localStorage.setItem("redirectAfterAuth", "/passion");
    setShowWelcome(false);
    setOnboardingStep("signUp");
    // We'll handle this in AuthModals.jsx to open sign up modal
    window.dispatchEvent(new CustomEvent("openSignUp", { detail: { redirectTo: "/passion" } }));
  };

  const handleSignInClick = () => {
    setRedirectAfterAuth("/passion");
    localStorage.setItem("redirectAfterAuth", "/passion");
    setShowWelcome(false);
    setOnboardingStep("signIn");
    // We'll handle this in AuthModals.jsx to open sign in modal
    window.dispatchEvent(new CustomEvent("openSignIn", { detail: { redirectTo: "/passion" } }));
  };

  return (
    <WelcomeContext.Provider
      value={{
        showWelcome,
        setShowWelcome,
        handleCloseWelcome,
        handleSignUpClick,
        handleSignInClick,
        onboardingStep,
        setOnboardingStep,
        redirectAfterAuth,
        setRedirectAfterAuth,
      }}
    >
      {children}
    </WelcomeContext.Provider>
  );
};

export const useWelcome = () => useContext(WelcomeContext);
