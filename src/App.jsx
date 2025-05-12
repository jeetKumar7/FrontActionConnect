import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
