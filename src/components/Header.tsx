import { Search, Plus, MapPin, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐾</span>
            </div>
            <Link to="/" className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">Cyprus Pets</h1>
              <p className="text-xs text-muted-foreground">cyprus-pets.com</p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-primary transition-colors ${
                isActive('/') ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/marketplace" 
              className={`hover:text-primary transition-colors ${
                isActive('/marketplace') ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              Marketplace
            </Link>
            <Link 
              to="/blog" 
              className={`hover:text-primary transition-colors ${
                isActive('/blog') ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              Pet Care Blog
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`hover:text-primary transition-colors ${
                  isActive('/admin') ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/marketplace">
                Browse Pets
              </Link>
            </Button>
            {user ? (
              <>
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Ad
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button size="sm" asChild>
                <Link to="/auth">
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search for pets, equipment..." 
              className="pl-10 pr-4"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;