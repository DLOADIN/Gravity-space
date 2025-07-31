import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';
import { Toaster } from '../../components/ui/toaster';
import { Eye, EyeOff } from 'lucide-react';
import { TestConnection } from '../../components/TestConnection';

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signin(email, password);
      toast({
        title: 'Success',
        description: 'You have been signed in successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign in',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 bg-gray-50 space-y-10">
        {/* Sign-in Card */}
        <Card className="w-[390px] shadow-md mt-[18vh] rounded-xl bg-white">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to sign in to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="text-sm text-center">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
  
        {/* Info Card */}
        <Card className="flex flex-col items-center justify-center max-w-xl p-6 bg-white shadow-lg rounded-2xl space-y-6 text-center">
          <CardDescription className="text-gray-600 text-sm uppercase tracking-wide">
            EXISTING LOGIN CREDENTIALS OR CHOOSE TO SIGNUP ☝️
          </CardDescription>
  
          <div className="bg-gray-100 p-4 rounded-lg w-full">
            <h2 className="text-lg font-semibold text-blue-700">COLLECTOR DETAILS</h2>
            <p className="text-sm text-gray-700 mt-2">
              Grant Cordone: <br />
              <span className="font-medium">Email:</span> grantcordone@gmail.com<br />
              <span className="font-medium">Password:</span> grantcordone@gmail.com
            </p>
          </div>
  
          <div className="bg-gray-100 p-4 rounded-lg w-full">
            <h2 className="text-lg font-semibold text-green-700">ARTISTS DETAILS</h2>
            <p className="text-sm text-gray-700 mt-2">
              Jill Wagner Joe: <br />
              <span className="font-medium">Email:</span> jillwagner@gmail.com<br />
              <span className="font-medium">Password:</span> jillwagner@gmail.com
            </p>
          </div>
        </Card>
      </div>
  
      <Toaster />
    </>
  );
  
} 