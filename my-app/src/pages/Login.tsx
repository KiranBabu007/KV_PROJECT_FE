import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import loginImage from "../assets/login.avif";
import { useNavigate } from "react-router-dom";
import logobg from "../assets/login-bg.png"

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
      const response="admin"
      const role = response.includes("admin") ? "admin" : "employee";
      const token = `dummy.header.${JSON.stringify({ role })}`;
      localStorage.setItem("token", token);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employees");
      }
    }

  return (
    <div className="flex h-screen w-screen items-center">
      <div className="w-1/3 h-full flex items-center justify-center">
        <img
          src={loginImage}
          alt="Login Image"
          className="max-w-full max-h-full"
        />
      </div>

      <div className="w-2/3 h-full flex items-center justify-center ">
      <div className="absolute w-[100%] -z-10 opacity-15">
        <img src={logobg} alt="" />
      </div>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="font-mono text-4xl mb-8 text-center">
            Referral Management System
            <p className="text-muted-foreground text-sm m-4 ">
              Manage your referrals at one place
            </p>
          </div>

          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form >
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" onClick={handleSubmit} className="w-full bg-black">
                Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
