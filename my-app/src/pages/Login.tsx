import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Sparkles, ArrowRight, Shield, Users, Zap } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      console.log("Login attempt:", { email, password });
      setLoading(false);
      // Add your login logic here
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md text-center space-y-8">
            {/* Logo */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="flex items-center space-x-1">
                  <span className="text-3xl font-bold text-white">F</span>
                  <ArrowRight className="w-6 h-6 text-yellow-400" />
                  <span className="text-3xl font-bold text-white">C</span>
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20" />
            </div>

            {/* Branding text */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                FtoC Platform
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Transform friendships into professional opportunities
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 pt-8">
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <span>Connect with trusted networks</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <span>Secure referral system</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-pink-400" />
                </div>
                <span>Fast-track your career</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold text-white">F</span>
                  <ArrowRight className="w-4 h-4 text-yellow-400" />
                  <span className="text-xl font-bold text-white">C</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">FtoC Platform</h2>
            </div>

            {/* Login card */}
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
              <CardHeader className="space-y-1 pb-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-xl mb-4 backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">
                    Welcome back
                  </CardTitle>
                  <p className="text-slate-400 mt-2">
                    Sign in to your account to continue
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200 font-medium">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder-slate-400 backdrop-blur-sm focus:bg-white/10 focus:border-blue-500/50 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-200 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder-slate-400 backdrop-blur-sm focus:bg-white/10 focus:border-blue-500/50 transition-all duration-300 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <input type="checkbox" className="rounded border-slate-600 bg-slate-800" />
                      <span>Remember me</span>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign in</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>



                {/* Social proof */}
                <div className="text-center">
                  <p className="text-xs text-slate-400">
                    Trusted by professionals at 500+ companies
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium">
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Login;