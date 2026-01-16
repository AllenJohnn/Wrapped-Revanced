import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import StoryScreen from "../components/StoryScreen";
import Footer from "../components/Footer";
import { Button } from "../components/ui";
import { useAuthStore } from "../store";
import { api } from "../services/api";
import analytics from "../utils/analytics";

export default function Welcome() {
  const navigate = useNavigate();
  const { token, setToken, user, setUser, logout } = useAuthStore();
  const [validToken, setValidToken] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    analytics.pageView('welcome');
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      console.error("Auth error:", error);
      setChecking(false);
      return;
    }

    if (accessToken) {
      setToken(accessToken);
      window.history.replaceState({}, document.title, "/");
    }

    const tokenToCheck = accessToken || token;
    if (!tokenToCheck) {
      setChecking(false);
      return;
    }

    api.verifyToken(tokenToCheck)
      .then((res) => {
        if (res.ok) {
          setValidToken(true);
          setUser(res.user);
        } else {
          setValidToken(false);
        }
      })
      .catch(() => setValidToken(false))
      .finally(() => setChecking(false));
  }, [token, setToken, setUser]);

  return (
    <StoryScreen>
      <div className="flex flex-col min-h-screen px-6 py-20">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-2xl w-full text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl sm:text-8xl md:text-9xl font-black mb-8 text-white tracking-tight"
            >
              Wrapped
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-gray-400 mb-16"
            >
              See your most-played artists and tracks anytime
            </motion.p>

            <AnimatePresence mode="wait">
              {checking ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-400"
                >
                  Loading...
                </motion.div>
              ) : !validToken ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button 
                    size="lg"
                    onClick={() => {
                      analytics.buttonClick('login', 'welcome');
                      window.location.href = api.getLoginUrl();
                    }}
                  >
                    Log in with Spotify
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="loggedin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6"
                >
                  {user && (
                    <div className="flex flex-col items-center gap-4 mb-4">
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.display_name} 
                          className="w-24 h-24 rounded-full ring-4 ring-white/20"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-black">
                          {user.display_name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="text-center">
                        <p className="text-gray-400 text-sm mb-2">Logged in as</p>
                        <p className="text-white text-2xl font-bold mb-1">{user.display_name || user.email || "User"}</p>
                        {user.followers !== undefined && (
                          <p className="text-gray-400 text-sm">{user.followers} followers</p>
                        )}
                      </div>
                    </div>
                  )}
                  <Button size="lg" onClick={() => {
                    analytics.buttonClick('get_started', 'welcome');
                    navigate("/wrapped");
                  }}>
                    Get Started
                  </Button>
                  <button 
                    onClick={() => {
                      analytics.buttonClick('logout', 'welcome');
                      logout();
                      setValidToken(false);
                    }}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Footer />
      </div>
    </StoryScreen>
  );
}
