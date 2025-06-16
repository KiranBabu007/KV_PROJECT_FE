import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/api-service/auth/login.api';

// interface LoginFormProps {
//   login: (email: string, password: string) => Promise<void>;
// }

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate()
  const [login, { isLoading }] = useLoginMutation();
  const [error,setError]=useState('')
  const handleSubmit =  async (e) => {
    e.preventDefault();

    await login({ email: email, password: password })
      .unwrap()
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response?.accessToken);
        navigate("/admin");
      })
      .catch((error) => {
        setError(error.data.message);
        console.log(error);
      });
  };


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80 backdrop-blur-sm"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl mb-4 animate-float">
              {/* FtoC Logo with Arrow */}
              <div className="relative">
                <span className="text-2xl font-bold text-white">F</span>
                <div className="absolute top-1/2 left-6 transform -translate-y-1/2">
                  <svg 
                    width="16" 
                    height="12" 
                    viewBox="0 0 16 12" 
                    fill="none" 
                    className="text-yellow-400"
                  >
                    <path 
                      d="M1 6h14m-6-5l5 5-5 5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white ml-8">C</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text ">
              FtoC Platform
            </h1>
            <p className="text-blue-100/80 text-lg">
              Friend to Colleague - Connecting talent through friendship
            </p>
          </div>

          {/* Login Card */}
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl animate-scale-in" style={{ animationDelay: '400ms' }}>
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
              <CardTitle className="text-2xl text-center text-white font-semibold">
                Sign In
              </CardTitle>
              <p className="text-sm text-blue-100/70 text-center">
                Enter your credentials to access your dashboard
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:bg-white/15 focus:border-white/40 transition-all duration-300 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Demo Info */}
              <div className="pt-4 border-t border-white/10">
                <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-4 border border-blue-400/20">
                  <p className="text-xs text-blue-100/80 text-center leading-relaxed">
                    <span className="font-semibold text-blue-200">Demo Mode:</span> Use any email and password to login.
                    <br />
                    Switch between roles using the header menu after signing in.
                  </p>
                </div>
              </div>

              {/* Footer Links */}
              <div className="flex justify-center space-x-4 text-sm">
                <button className="text-blue-200/80 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline">
                  Forgot Password?
                </button>
                <span className="text-white/30">•</span>
                <button className="text-blue-200/80 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline">
                  Need Help?
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Text */}
          <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <p className="text-white/60 text-sm">
              Powered by FtoC • Connecting friends as colleagues
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;