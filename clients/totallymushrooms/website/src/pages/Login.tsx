import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo-totally-mushrooms.png";

const Login = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center">
        <Link to="/" className="inline-block">
          <img src={logo} alt="Totally Mushrooms" className="h-12 mx-auto" />
        </Link>
        <p className="text-muted-foreground mt-2 text-sm">Sign in to your account</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input type="email" placeholder="your@email.com" className="bg-card border-border" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <Input type="password" placeholder="••••••••" className="bg-card border-border" />
        </div>
        <Button type="submit" size="lg" className="w-full">Continue</Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <span className="text-primary cursor-pointer hover:underline">Sign up</span>
      </p>

      <div className="text-center">
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          ← Back to store
        </Link>
      </div>
    </div>
  </div>
);

export default Login;
