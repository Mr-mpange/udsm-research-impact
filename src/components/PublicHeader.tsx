import { motion } from 'framer-motion';
import { Globe, Search, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from '@/components/auth/UserMenu';
import AuthModal from '@/components/auth/AuthModal';
import logoImage from '/favicon.svg';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/research', label: 'Research Network' },
];

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="glass-panel m-4 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                  <img src={logoImage} alt="UDSM Logo" className="w-full h-full object-contain" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display font-bold text-lg text-foreground">UDSM Research</h1>
                <p className="text-xs text-muted-foreground">Global Intelligence Platform</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="hidden sm:flex gap-2"
                  >
                    <Search className="w-4 h-4" />
                    My Dashboard
                  </Button>
                  <UserMenu 
                    onOpenProfile={() => navigate('/dashboard')}
                  />
                </>
              ) : (
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  className="gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pt-4 border-t border-border"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {user && (
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}