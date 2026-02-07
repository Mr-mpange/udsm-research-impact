import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for redirect info from previous login
  useEffect(() => {
    const lastRedirect = localStorage.getItem('lastRedirect');
    if (lastRedirect) {
      const info = JSON.parse(lastRedirect);
      console.log('📋 LAST REDIRECT INFO:', info);
      console.log('🌐 Current URL:', window.location.pathname);
      console.log('✅ Redirect was to:', info.url);
      console.log('🎭 User roles were:', info.roles);
      console.log('👑 isAdmin:', info.isAdmin);
      console.log('🛡️ isModerator:', info.isModerator);
      
      // Show alert so you can see it even if console clears
      if (info.url !== window.location.pathname) {
        console.error('❌ REDIRECT MISMATCH!');
        console.error('   Expected:', info.url);
        console.error('   Actual:', window.location.pathname);
        alert(`REDIRECT FAILED!\nExpected: ${info.url}\nActual: ${window.location.pathname}\nRoles: ${info.roles?.join(', ')}\nisModerator: ${info.isModerator}`);
      } else {
        console.log('✅ Redirect successful!');
      }
      
      // Don't clear it immediately - wait 10 seconds so you can check it
      setTimeout(() => {
        localStorage.removeItem('lastRedirect');
      }, 10000);
    }
  }, []);

  // Handle redirect after successful authentication
  useEffect(() => {
    console.log('🔄 useEffect triggered - shouldRedirect:', shouldRedirect, 'user:', user?.email);
    
    if (shouldRedirect && user) {
      console.log('✅ Both conditions met, starting redirect process');
      
      const checkRoleAndRedirect = async () => {
        try {
          console.log('🔍 Starting role check for user:', user.id, user.email);
          
          // Wait a bit for the auth state to settle
          console.log('⏰ Waiting 800ms for auth to settle...');
          await new Promise(resolve => setTimeout(resolve, 800));
          console.log('⏰ Wait complete, fetching roles...');
          
          // Check user roles with retry logic
          let roles = null;
          let attempts = 0;
          const maxAttempts = 5;
          
          while (!roles && attempts < maxAttempts) {
            console.log(`📡 Attempt ${attempts + 1}/${maxAttempts} to fetch roles...`);
            
            const { data, error } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', user.id);
            
            console.log('📦 Response:', { data, error });
            
            if (!error && data && data.length > 0) {
              roles = data;
              console.log('✅ Roles found:', roles);
              break;
            } else {
              console.log('⚠️ No roles yet, data:', data, 'error:', error);
            }
            
            attempts++;
            if (attempts < maxAttempts) {
              console.log(`⏳ Waiting 500ms before retry ${attempts + 1}...`);
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          
          if (!roles || roles.length === 0) {
            console.warn('⚠️ No roles found after all attempts, defaulting to /dashboard');
          }
          
          console.log('🔍 RAW ROLES DATA:', JSON.stringify(roles, null, 2));
          console.log('🔍 ROLE VALUES:', roles?.map(r => {
            console.log('  Role object:', r);
            console.log('  Role.role:', r.role);
            console.log('  Type:', typeof r.role);
            return r.role;
          }));
          
          const isAdmin = roles?.some(r => {
            const match = r.role === 'admin';
            console.log(`  Checking admin: "${r.role}" === "admin" = ${match}`);
            return match;
          });
          
          const isModerator = roles?.some(r => {
            const match = r.role === 'moderator';
            console.log(`  Checking moderator: "${r.role}" === "moderator" = ${match}`);
            return match;
          });
          
          console.log('🎭 Role check results:');
          console.log('  - isAdmin:', isAdmin);
          console.log('  - isModerator:', isModerator);
          console.log('  - all roles:', roles?.map(r => r.role));
          
          // Close modal
          console.log('� Closing modal...');
          onClose();
          
          // Determine redirect URL
          let redirectUrl = '/dashboard';
          if (isAdmin) {
            redirectUrl = '/admin';
            console.log('👑 Admin detected → /admin');
          } else if (isModerator) {
            redirectUrl = '/moderator';
            console.log('🛡️ Moderator detected → /moderator');
          } else {
            console.log('👤 Regular user → /dashboard');
          }
          
          // Use window.location for a full page reload to ensure auth state is fresh
          console.log('🚀 FINAL REDIRECT URL:', redirectUrl);
          console.log('⏰ Waiting 300ms before redirect...');
          
          // Save redirect info to localStorage so we can see it after reload
          localStorage.setItem('lastRedirect', JSON.stringify({
            timestamp: new Date().toISOString(),
            url: redirectUrl,
            roles: roles?.map(r => r.role),
            isAdmin,
            isModerator
          }));
          
          setTimeout(() => {
            console.log('🎯 EXECUTING REDIRECT NOW to:', redirectUrl);
            window.location.href = redirectUrl;
          }, 300);
        } catch (error) {
          console.error('❌ Error checking role:', error);
          console.log('🚨 Falling back to /dashboard due to error');
          window.location.href = '/dashboard';
        } finally {
          console.log('🧹 Cleanup: setting shouldRedirect = false');
          setShouldRedirect(false);
        }
      };
      
      checkRoleAndRedirect();
    } else {
      if (shouldRedirect && !user) {
        console.log('⚠️ shouldRedirect is true but user is null - waiting for user...');
      }
    }
  }, [shouldRedirect, user, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('🔐 LOGIN STARTED');
    console.log('📧 Email:', email);

    try {
      if (isSignUp) {
        console.log('📝 Sign up flow');
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Welcome to UDSM Research Intelligence Platform.",
        });
      } else {
        console.log('🔑 Sign in flow');
        const { error } = await signIn(email, password);
        if (error) {
          console.error('❌ Sign in error:', error);
          throw error;
        }
        console.log('✅ Sign in successful');
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      }
      
      // Clear form
      setEmail('');
      setPassword('');
      setName('');
      
      console.log('🎯 Setting shouldRedirect = true');
      console.log('👤 Current user state:', user);
      
      // Trigger redirect via useEffect
      setShouldRedirect(true);
      
      console.log('⏳ Waiting for useEffect to trigger redirect...');
    } catch (error: any) {
      console.error('💥 Login failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Authentication failed",
      });
    } finally {
      setIsSubmitting(false);
      console.log('🏁 handleSubmit completed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="glass-panel p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isSignUp 
                      ? 'Join the UDSM research community' 
                      : 'Sign in to your research dashboard'
                    }
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required={isSignUp}
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-cyan hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </Button>
              </form>

              {/* Toggle */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"
                  }
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
