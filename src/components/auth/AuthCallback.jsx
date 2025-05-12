import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get token and user ID from URL params
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("token");
      const userId = searchParams.get("id");

      if (token && userId) {
        try {
          // Verify the token with our backend
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/auth/success?token=${token}&id=${userId}`
          );
          const data = await response.json();

          if (response.ok) {
            // Store in localStorage (same as regular login)
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);

            // Fetch additional user info
            const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/getuser`, {
              headers: { Authorization: token },
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData.name) {
                localStorage.setItem("userName", userData.name);
              }
            }

            // Trigger auth state update
            window.dispatchEvent(new Event("storage"));

            // Redirect to home page
            navigate("/", { replace: true });
            window.location.reload(); // Force refresh to update UI

            // After successfully setting up the user token, check for redirect
            const redirectPath = localStorage.getItem("redirectAfterAuth");

            if (redirectPath === "/passion") {
              // This is a new user that came from welcome modal
              localStorage.removeItem("redirectAfterAuth");
              navigate("/passion");
            } else if (redirectPath) {
              localStorage.removeItem("redirectAfterAuth");
              navigate(redirectPath);
            } else {
              navigate("/");
            }
          } else {
            setError(data.message || "Authentication failed");
            setTimeout(() => navigate("/"), 3000);
          }
        } catch (error) {
          console.error("Auth callback error:", error);
          setError("Failed to complete authentication");
          setTimeout(() => navigate("/"), 3000);
        }
      } else {
        setError("Missing authentication data");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleAuthCallback();
  }, [location, navigate]);

  useEffect(() => {
    // Existing auth callback code...

    // After successful authentication:
    const redirect = localStorage.getItem("redirectAfterAuth");
    if (redirect) {
      localStorage.removeItem("redirectAfterAuth");
      navigate(redirect);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-[var(--text-primary)] pt-20">
      <div className="max-w-md mx-auto p-8 bg-slate-800/50 rounded-2xl border border-white/10 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">{error ? "Authentication Error" : "Completing Sign In"}</h2>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-center">
            {error}
            <p className="mt-2 text-sm">Redirecting you back...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-[var(--text-primary)]/70">Please wait while we complete your sign in...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
