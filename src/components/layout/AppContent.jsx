import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "../../pages/Home";
import ContentLibrary from "../../pages/ContentLibrary";
import Footer from "./Footer";
import Community from "../../pages/Community";
import CommunityFeed from "../community/CommunityFeed";
import ChatChannels from "../community/ChatChannels";
import UpcomingEvents from "../community/UpcomingEvents";
import ActionHub from "../../pages/ActionHub";
import FindPassion from "../../pages/FindYourPassion";
import InteractiveMap from "../../pages/InteractiveMap";
import LearnMore from "../../pages/LearnMore";
import UserProfile from "../user/UserProfile";
import AuthCallback from "../auth/AuthCallback";
import WelcomeModal from "../common/WelcomeModal";
import { useWelcome } from "../../context/WelcomeContext";
import { AnimatePresence } from "framer-motion";
import { SignInModal, SignUpModal } from "../auth/AuthModals";
import Feedback from "../../pages/Feedback";

const AppContent = () => {
  const {
    showWelcome,
    handleCloseWelcome,
    handleSignUpClick,
    handleSignInClick,
    showSignIn,
    setShowSignIn,
    showSignUp,
    setShowSignUp,
  } = useWelcome();

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<ContentLibrary />} />
        <Route path="/community/*" element={<Community />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/hub" element={<ActionHub />} />
        <Route path="/chat" element={<ChatChannels />} />
        <Route path="/feed" element={<CommunityFeed />} />
        <Route path="/events" element={<UpcomingEvents />} />
        <Route path="/passion" element={<FindPassion />} />
        <Route path="/map" element={<InteractiveMap />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/auth-success" element={<AuthCallback />} />
      </Routes>
      <Footer />

      <AnimatePresence>
        {showWelcome && (
          <WelcomeModal
            isOpen={showWelcome}
            onClose={handleCloseWelcome}
            onSignUp={handleSignUpClick}
            onSignIn={handleSignInClick}
          />
        )}
      </AnimatePresence>

      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />

      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => {
          setShowSignUp(false);
          setTimeout(() => setShowSignIn(true), 100);
        }}
      />
    </div>
  );
};

export default AppContent;
