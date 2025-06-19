import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Sparkles, ArrowRight, Shield, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/api-service/auth/login.api";
import { jwtDecode } from "jwt-decode";
import logo from "@/assets/logo.jpg"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  type MyJwtPayload = {
    personId: number;
    employeeId: number;
    email: string;
    role: string;
    iat: number;
    exp: number;
  };
   
    useEffect(() => {
        const token=localStorage.getItem("token")
        console.log(token)
        if(!token)
        navigate("/login")
      }
      
    , []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({ email: email, password: password }).unwrap();
      console.log(response);
      localStorage.setItem("token", response?.accessToken);
      const decoded = jwtDecode<MyJwtPayload>(response?.accessToken);

      console.log("decode:", decoded.role);
      const role = decoded.role;

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "EMPLOYEE") {
        navigate("/employee");
      }
     
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen m-0 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md text-center space-y-8">
            {/* Logo */}
            <div className="relative">
              <div className="w-34 h-34 mx-auto rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
                <img 
                  src={logo} 
                  alt="FtoC Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20" />
            </div>

            {/* Branding text */}
            <div className="space-y-6">
              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                Friend To Colleague
                <span className="block mt-2 bg-gradient-to-r from-blue-200 via-purple-100 to-white bg-clip-text">
                  Referral Platform
                </span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed tracking-wide font-light max-w-sm mx-auto">
                Transform friendships into professional opportunities with our trusted referral network
              </p>
         
            </div>

            
           

       
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                <img 
                  src={logo} 
                  alt="FtoC Logo" 
                  className="w-full h-full object-cover"
                />
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
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-red-300 text-sm text-center">{error}</p>
                    </div>
                  )}
                  
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
                      required
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
                        required
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

                

                  <Button
                    onClick={handleSubmit}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0"
                    disabled={loading || isLoading}
                  >
                    {loading || isLoading ? (
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