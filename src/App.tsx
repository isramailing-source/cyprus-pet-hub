import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Blog from "./pages/Blog";
import Forum from "./pages/Forum";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering - Phase 1: Basic Providers');
  
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <div style={{ padding: '20px', backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>
          <h1>Phase 1: Basic Providers Working!</h1>
          <p>QueryClient and HelmetProvider added successfully.</p>
        </div>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
