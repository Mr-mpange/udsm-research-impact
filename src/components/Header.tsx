import { motion } from 'framer-motion';
import { Globe, BarChart3, Network, Brain, Settings, Menu, LogIn, Download, Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import UserMenu from '@/components/auth/UserMenu';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenExport: () => void;
}

const navItems = [
  { id: 'globe', label: 'Global Impact', icon: Globe },
  { id: 'dashboard', label: 'Analytics', icon: BarChart3 },
  { id: 'network', label: 'Collaboration', icon: Network },
  { id: 'predictions', label: 'Predictions', icon: Brain },
];

export default function Header({ activeTab, setActiveTab, onOpenAuth, onOpenProfile, onOpenExport }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-panel m-4 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
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
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-link flex items-center gap-2 rounded-lg ${
                  activeTab === item.id ? 'nav-link-active bg-muted' : ''
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <motion.div 
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald/20 border border-emerald/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
              <span className="text-xs text-emerald font-medium">Live Data</span>
            </motion.div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={onOpenExport}
              title="Export Data"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Settings className="w-4 h-4" />
            </Button>

            {isAdmin && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex gap-2"
                onClick={() => navigate('/admin')}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            )}

            {user ? (
              <UserMenu onOpenProfile={onOpenProfile} />
            ) : (
              <Button 
                onClick={onOpenAuth}
                className="hidden md:flex bg-gradient-to-r from-primary to-cyan hover:opacity-90"
                size="sm"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav 
            className="md:hidden mt-4 pt-4 border-t border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
}
