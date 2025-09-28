import { Search, Plus, MapPin, User, LogOut, Settings, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");

  // simple analytics for popular header searches
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) return;
    const key = "cp_popular_searches";
    try {
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      existing[searchTerm] = (existing[searchTerm] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {}
  }, [searchTerm]);

  const isActive = (path: string) => location.pathname === path;

  const onSubmitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/cypruspets_logo.png" alt="Cyprus Pets Logo" className="w-8 h-8 rounded-lg" />
            <Link className="flex flex-col" to="/">
              <h1 className="text-xl font-bold text-foreground">Cyprus Pets</h1>
              <p className="text-xs text-muted-foreground">cyprus-pets.com</p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className={`hover:text-primary transition-colors ${isActive('/') ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{t('home')}</Link>
            <Link to="/blog" className={`hover:text-primary transition-colors ${isActive('/blog') ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Blog</Link>
            <Link to="/shop" className={`hover:text-primary transition-colors ${isActive('/shop') || isActive('/deals') ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{t('shop')}</Link>
            <Link to="/forum" className={`hover:text-primary transition-colors ${isActive('/forum') ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{t('community')}</Link>
          </nav>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center">
            <LanguageSwitcher />
          </div>

          {/* Right side - Search and Auth */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={onSubmitSearch} className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search products, articles, forum..."
                className="pl-10 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            {user ? (
              <>
                <Button asChild size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <Link to="/forum">
                    <Plus className="w-4 h-4 mr-2" />
                    Join Community
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
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
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">{t('signIn')}</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <form onSubmit={onSubmitSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="Search products, articles, forum..."
              className="pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </div>
    </header>
  );
};
export default Header;
