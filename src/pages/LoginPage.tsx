import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Package, Chrome, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  // ================= SIGN IN =================
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = String(formData.get('email') ?? '').trim();
      const password = String(formData.get('password') ?? '');

      if (!email || !password) {
        toast.error('Please fill in all fields');
        return;
      }

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
    setIsLoading(true);

    try {
      if (!agreedToTerms) {
        toast.error('Please agree to the terms');
        return;
      }

      const formData = new FormData(e.currentTarget);

      const username = String(formData.get('username') ?? '').trim();
      const email = String(formData.get('email') ?? '').trim();
      const password = String(formData.get('password') ?? '');
      const confirmPassword = String(formData.get('confirmPassword') ?? '');

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

      const { error } = await signUpWithEmail(email, password, username);

      if (error) {
        if (error.message.includes('already')) {
          toast.error('Email or username already exists');
        } else {
          toast.error(error.message);
        }
        return;
      }

      // IMPORTANT FIX:
      // No auto-login (prevents Supabase session bugs)
      toast.success('Account created successfully!');
      navigate('/login', { replace: true });

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
          <Tabs defaultValue="signin">

            {/* ================= SIGN IN ================= */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">

                <div>
                  <Label>Email</Label>
                  <Input name="email" type="email" disabled={isLoading} />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input name="password" type="password" disabled={isLoading} />
                </div>

                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Sign In'}
                </Button>

              </form>

              <Separator className="my-6" />

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google Sign In
              </Button>
            </TabsContent>

            {/* ================= SIGN UP ================= */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">

                <div>
                  <Label>Username</Label>
                  <Input name="username" type="text" disabled={isLoading} />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input name="email" type="email" disabled={isLoading} />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input name="password" type="password" disabled={isLoading} />
                </div>

                <div>
                  <Label>Confirm Password</Label>
                  <Input name="confirmPassword" type="password" disabled={isLoading} />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={agreedToTerms}
                    onCheckedChange={(v) => setAgreedToTerms(!!v)}
                  />
                  <span className="text-sm">I agree to terms</span>
                </div>

                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Sign Up'}
                </Button>

              </form>
            </TabsContent>

          </Tabs>
        </CardContent>

      </Card>
    </div>
  );
}