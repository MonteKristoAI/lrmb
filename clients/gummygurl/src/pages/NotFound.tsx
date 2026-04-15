import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-foreground">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold" style={{ color: "hsl(330 15% 90%)" }}>404</h1>
        <p className="mb-4 text-xl" style={{ color: "hsl(330 8% 50%)" }}>Oops! Page not found</p>
        <a href="/" style={{ color: "#E5368D" }} className="underline hover:opacity-80">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
