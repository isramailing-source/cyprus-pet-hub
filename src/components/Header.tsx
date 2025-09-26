import { Search, Plus, MapPin, User, LogOut, Settings, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
  const { t } = useTranslation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/cypruspets_logo.png" 
              alt="Cyprus Pets Logo" 
              className="w-8 h-8 rounded-lg" 
            />
            <Link to="/" className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">
                Cyprus Pets
              </h1>
              <p className="text-xs text-muted-foreground">
                cyprus-pets.com
              </p>
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
              {t('home')}
            </Link>
            <Link
              to="/blog" 
              className={`hover:text-primary transition-colors ${
                isActive('/blog') ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              Blog
            </Link>
            <Link
              to="/shop" 
              className={`hover:text-primary transition-colors ${
                isActive('/shop') || isActive('/deals') ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              {t('shop')}
            </Link>
            <Link
              to="/forum" 
              className={`hover:text-primary transition-colors ${
                isActive('/forum') ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              {t('community')}
            </Link>
          </nav>
          
          {/* Language Switcher */}
          <div className="hidden md:flex items-center">
            <LanguageSwitcher />
          </div>
          
          {/* Right side - Search and Auth */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="search" 
                placeholder="Search articles and discussions..."
                className="pl-10 pr-4"
              />
            </div>
            
            {user ? (
              <>
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90" asChild>
                  <Link to="/forum">
                    <Plus className="w-4 h-4 mr-2" />
                    Join Community
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      {t('account')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      {t('profile')}
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Settings className="w-4 h-4 mr-2" />
                          {t('adminDashboard')}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button size="sm" asChild>
                <Link to="/auth">
                  {t('signIn')}
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
              type="search" 
              placeholder="Search articles and discussions..."
              className="pl-10 pr-4"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
