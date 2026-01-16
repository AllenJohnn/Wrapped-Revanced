import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuthStore } from "./store";
import ErrorBoundary from "./components/ErrorBoundary";
import PageTransition from "./components/PageTransition";
import Welcome from "./pages/Welcome";
import Wrapped from "./pages/Wrapped";
import Summary from "./pages/Summary";
import analytics from "./utils/analytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

export default function App() {
  const { setToken } = useAuthStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");

    if (accessToken) {
      setToken(accessToken);
<<<<<<< HEAD
      window.history.replaceState({}, document.title, "/"); 
    } else {
      const savedToken = localStorage.getItem("spotify_token");
      setToken(savedToken && savedToken !== "undefined" ? savedToken : null);
=======
      window.history.replaceState({}, document.title, "/");
>>>>>>> cfdb5eb (latest fixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
    }
  }, [setToken]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/wrapped" element={<Wrapped />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </PageTransition>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
