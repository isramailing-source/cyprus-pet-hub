import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="text-8xl mb-4">🐾</div>
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Pet Not Found!</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
            Looks like this pet has wandered off! The page you're looking for doesn't exist.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary">
            <a href="/">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </a>
          </Button>
          <Button variant="outline" size="lg">
            <Search className="w-5 h-5 mr-2" />
            Search Pets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
