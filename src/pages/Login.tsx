import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Calendar, Target, Send, CheckCircle, CreditCard, 
  Upload, ArrowRight, ArrowLeft, ChevronDown, MapPin, Building2, 
  Swords, CircleDot, Shield, Zap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Login Logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple logic to simulate role-based login
    // In a real app, this would come from the backend response
    if (email.toLowerCase().includes('coach')) {
      toast({
        title: "Welcome Coach!",
        description: "Redirecting to Coach Dashboard...",
      });
      setTimeout(() => navigate('/dashboard/coach'), 1000);
    } else {
      toast({
        title: "Welcome Player!",
        description: "Redirecting to Player Dashboard...",
      });
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 bg-black relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-10 bg-black/40" />
        <img 
          src="/auth.png" 
          alt="Cricket Banner" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-white p-12 max-w-xl">
          <h1 className="text-5xl font-bold mb-6 font-display">
            Welcome Back!
          </h1>
          <p className="text-xl text-gray-200">
            Sign in to access your dashboard, track your stats, and manage your cricket journey.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="pl-0 hover:bg-transparent text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <Card className="border border-gray-200 shadow-xl bg-white p-6 rounded-xl">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-3xl font-bold tracking-tight text-[#263574]">Login</CardTitle>
              <CardDescription className="text-gray-500">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 px-0">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    className="h-11 border-gray-300 focus:border-[#263574] focus:ring-[#263574]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="*****" 
                    required 
                    className="h-11 border-gray-300 focus:border-[#263574] focus:ring-[#263574]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 px-0">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-bold bg-[#263574] hover:bg-[#1f2b5e] shadow-lg text-white transition-all duration-200"
                >
                  Sign In
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                   Use <span className="font-mono font-bold text-[#263574]">coach@brpl.com</span> to test Coach Dashboard
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
