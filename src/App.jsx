import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import ContentLibrary from "./pages/ContentLibrary";
import Footer from "./components/layout/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Community from "./pages/Community";
import CommunityFeed from "./components/community/CommunityFeed";
import ChatChannels from "./components/community/ChatChannels";
import UpcomingEvents from "./components/community/UpcomingEvents";
import ActionHub from "./pages/ActionHub";
import FindPassion from "./pages/FindYourPassion";
import InteractiveMap from "./pages/InteractiveMap";
import LearnMore from "./pages/LearnMore";
import UserProfile from "./components/user/UserProfile";
import AuthCallback from "./components/auth/AuthCallback";
import { WelcomeProvider } from "./context/WelcomeContext";
import AppContent from "./components/layout/AppContent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeProvider>
        <AppContent />
      </WelcomeProvider>
    </QueryClientProvider>
  );
}

export default App;
