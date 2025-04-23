import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import ContentLibrary from "./pages/ContentLibrary";
import Footer from "./components/layout/Footer";
import { QueryClient, QueryClientProvider, useIsFetching } from "@tanstack/react-query";
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
import LoadingAnimation from './components/common/LoadingAnimation';
import { Suspense } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  const isFetching = useIsFetching();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {isFetching > 0 && <LoadingAnimation size="sm" />}
      <main className="flex-grow">
        <Suspense fallback={<LoadingAnimation fullScreen size="lg" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<ContentLibrary />} />
            <Route path="/community/*" element={<Community />} />
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
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
