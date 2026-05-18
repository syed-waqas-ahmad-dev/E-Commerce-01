import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Package, Chrome } from 'lucide-react'; 

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [activeTab, setActiveTab] = useState('signin'); 

  const { signInWithEmail, signUpWithEmail, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  // ================= SIGN IN =================
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    // FIX: Validation before setting loading state (No stuck loading!)
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signInWithEmail(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success('Welcome back!');
      navigate(from, { replace: true });

    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // ================= SIGN UP =================
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // FIX: Checkbox validation before loading state
    if (!agreedToTerms) {
      toast.error('Please agree to the terms');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get('username') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    // FIX: Input validations before loading state
    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUpWithEmail(email, password, username);

      if (error) {
        if (error.message.includes('already')) {
          toast.error('Email or username already exists');
        } else {
          toast.error(error.message);
        }
        return;
      }

      // Smooth Switch: Clear fields and go to signin
      toast.success('Account created successfully! Please sign in.');
      setActiveTab('signin'); 
      setAgreedToTerms(false); 
      e.currentTarget.reset(); 

    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ================= GOOGLE AUTH =================
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithOAuth('google');
      if (error) {
        toast.error(error.message || 'Google sign-in failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-lg">

        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Package className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>Login or create account</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" disabled={isLoading}>Sign In</TabsTrigger>
              <TabsTrigger value="signup" disabled={isLoading}>Sign Up</TabsTrigger>
            </TabsList>

            {/* ================= SIGN IN TAB ================= */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" name="email" type="email" placeholder="name@example.com" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" name="password" type="password" placeholder="••••••••" disabled={isLoading} />
                </div>
                <Button className="w-full" disabled={isLoading}>
                  {isLoading && activeTab === 'signin' ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* ================= SIGN UP TAB ================= */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input id="signup-username" name="username" type="text" placeholder="johndoe" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="email" type="email" placeholder="name@example.com" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" name="password" type="password" placeholder="Minimum 6 characters" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input id="signup-confirm" name="confirmPassword" type="password" placeholder="••••••••" disabled={isLoading} />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(v) => setAgreedToTerms(!!v)}
                    disabled={isLoading}
                  />
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    I agree to terms and conditions
                  </label>
                </div>
                <Button className="w-full" disabled={isLoading}>
                  {isLoading && activeTab === 'signup' ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </CardContent>

      </Card>
    </div>
  );
}
