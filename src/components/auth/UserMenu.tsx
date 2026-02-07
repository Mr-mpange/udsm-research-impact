import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, FileText, ChevronDown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserMenuProps {
  onOpenProfile: () => void;
}

export default function UserMenu({ onOpenProfile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { isAdmin, isModerator } = useUserRole();
  const navigate = useNavigate();

  if (!user) return null;

  // Determine the default dashboard based on role
  const getDashboardRoute = () => {
    if (isAdmin) return '/admin';
    if (isModerator) return '/moderator';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (isAdmin) return 'Admin Dashboard';
    if (isModerator) return 'Moderator Dashboard';
    return 'My Dashboard';
  };

  const initials = profile?.display_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user.email?.[0].toUpperCase() || 'U';

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/20 text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden md:inline text-sm font-medium max-w-[100px] truncate">
          {profile?.display_name || user.email}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              className="absolute right-0 top-full mt-2 w-56 glass-panel z-50 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="p-3 border-b border-border">
                <p className="font-medium text-sm truncate">
                  {profile?.display_name || 'Researcher'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              
              <div className="p-1">
                <button
                  onClick={() => {
                    navigate(getDashboardRoute());
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                >
                  {(isAdmin || isModerator) ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  {getDashboardLabel()}
                </button>
                {(isAdmin || isModerator) && (
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  My Publications
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>

              <div className="p-1 border-t border-border">
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
