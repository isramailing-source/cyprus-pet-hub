import { Search, Plus, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import EnhancedSearch from "@/components/EnhancedSearch"

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut, isAdmin } = useAuth()
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")

  // simple analytics for popular header searches (local only)
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) return
    const key = "cp_popular_searches"
    try {
      const existing = JSON.parse(localStorage.getItem(key) || "{}")
      existing[searchTerm] = (existing[searchTerm] || 0) + 1
      localStorage.setItem(key, JSON.stringify(existing))
    } catch {}
  }, [searchTerm])

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky-nav">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/cypruspets_logo.png" alt="Cyprus Pets" className="w-8 h-8 rounded" />
          <span className="text-lg font-semibold">Cyprus Pets</span>
        </Link>

        {/* Primary nav */}
        <nav className="hidden lg:flex items-center gap-6 ml-4">
          <Link to="/" className={`hover:text-primary ${isActive('/') ? 'text-primary' : ''}`}>{t('home')}</Link>
          <Link to="/blog" className={`hover:text-primary ${isActive('/blog') ? 'text-primary' : ''}`}>Blog</Link>
          <Link to="/shop" className={`hover:text-primary ${isActive('/shop') ? 'text-primary' : ''}`}>{t('shop')}</Link>
          <Link to="/forum" className={`hover:text-primary ${isActive('/forum') ? 'text-primary' : ''}`}>{t('community')}</Link>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search with suggestions + analytics */}
        <div className="hidden md:block w-[340px]">
          <EnhancedSearch area="shop" placeholder={t('searchPlaceholder') as string} />
        </div>

        {/* Language */}
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>

        {/* Auth */}
        {user ? (
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-secondary">
              <Link to="/forum">
                <Plus className="w-4 h-4 mr-2" /> {t('joinCommunity')}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <User className="w-4 h-4 mr-2" /> {t('account')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><Settings className="w-4 h-4 mr-2" /> {t('adminDashboard')}</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" /> {t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button asChild size="sm">
            <Link to="/auth">{t('signIn')}</Link>
          </Button>
        )}
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <EnhancedSearch area="shop" placeholder={t('searchPlaceholder') as string} />
      </div>
    </header>
  )
}

export default Header
