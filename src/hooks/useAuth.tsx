import { useState, useEffect, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { validateEmail, createRateLimiter, sanitizeHtml } from "@/lib/utils";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  lastAuthAction: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rate limiter for auth actions: max 5 attempts per minute
const authRateLimiter = createRateLimiter(5, 60000);

// Password strength validation
function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  if (password.length > 128) {
    errors.push('Password is too long (max 128 characters)');
  }
  
  // Check for common weak patterns
  const weakPatterns = [
    /password/i,
    /123456/,
    /qwerty/i,
    /admin/i,
    /welcome/i
  ];
  
  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common weak patterns');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Display name validation
function validateDisplayName(displayName: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!displayName) {
    return { isValid: true, errors }; // Optional field
  }
  
  if (displayName.length < 2) {
    errors.push('Display name must be at least 2 characters');
  }
  
  if (displayName.length > 50) {
    errors.push('Display name must be less than 50 characters');
  }
  
  if (!/^[a-zA-Z0-9\s-_.]+$/.test(displayName)) {
    errors.push('Display name can only contain letters, numbers, spaces, hyphens, underscores, and dots');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastAuthAction, setLastAuthAction] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role when session changes
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .single();
              
              setUserRole(roleData?.role || 'user');
            } catch (error) {
              console.error('Error fetching user role:', error);
              setUserRole('user');
            }
          }, 0);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserIdentifier = () => {
    // Use a combination of IP-like identifier and user agent for rate limiting
    return 'auth_' + (navigator.userAgent + window.location.hostname).slice(0, 20);
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    // Rate limiting check
    const userIdentifier = getUserIdentifier();
    if (!authRateLimiter(userIdentifier)) {
      const error = { message: 'Too many authentication attempts. Please wait a minute before trying again.' };
      toast({
        title: "Rate Limit Exceeded",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    setLastAuthAction(Date.now());

    try {
      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        const error = { message: emailValidation.errors[0] };
        toast({
          title: "Invalid Email",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        const error = { message: passwordValidation.errors[0] };
        toast({
          title: "Invalid Password",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Validate display name if provided
      if (displayName) {
        const displayNameValidation = validateDisplayName(displayName);
        if (!displayNameValidation.isValid) {
          const error = { message: displayNameValidation.errors[0] };
          toast({
            title: "Invalid Display Name",
            description: error.message,
            variant: "destructive",
          });
          return { error };
        }
      }

      const redirectUrl = `${window.location.origin}/`;
      const sanitizedEmail = emailValidation.sanitized!;
      const sanitizedDisplayName = displayName ? sanitizeHtml(displayName.trim()) : sanitizedEmail.split('@')[0];
      
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: sanitizedDisplayName
          }
        }
      });

      if (error) {
        // Handle specific CAPTCHA errors
        if (error.message.includes('captcha')) {
          toast({
            title: "CAPTCHA Required",
            description: "Please disable CAPTCHA in Supabase Auth settings or contact support. This feature is not implemented yet.",
            variant: "destructive",
          });
        } else if (error.message.includes('already registered')) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Try signing in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Rate limiting check
    const userIdentifier = getUserIdentifier();
    if (!authRateLimiter(userIdentifier)) {
      const error = { message: 'Too many authentication attempts. Please wait a minute before trying again.' };
      toast({
        title: "Rate Limit Exceeded",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    setLastAuthAction(Date.now());

    try {
      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        const error = { message: emailValidation.errors[0] };
        toast({
          title: "Invalid Email",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Basic password check (don't validate strength for login)
      if (!password || password.length === 0) {
        const error = { message: 'Password is required' };
        toast({
          title: "Invalid Password",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      const sanitizedEmail = emailValidation.sanitized!;
      
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        // Handle specific errors
        if (error.message.includes('captcha')) {
          toast({
            title: "CAPTCHA Required",
            description: "Please disable CAPTCHA in Supabase Auth settings or contact support. This feature is not implemented yet.",
            variant: "destructive",
          });
        } else if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and click the confirmation link before signing in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isAdmin = userRole === 'admin';

  const value = {
    user,
    session,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
    lastAuthAction,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
