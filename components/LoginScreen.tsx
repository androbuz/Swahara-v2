import { Menu, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Logo } from "./Logo";
import { useState } from "react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Simple validation for demo
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 relative border border-gray-100">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-medium text-xl">Swahara</span>
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-blue-200 rounded-3xl blur-2xl opacity-30"></div>
            <Logo size={96} />
          </div>
          <h1 className="text-gray-900 mb-1">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to manage your agreements</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="username" className="text-sm mb-2 block">Username</Label>
            <Input 
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="alex.johnson"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm mb-2 block">Password</Label>
            <Input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        </div>

        <Button 
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-6 mb-3 transition-colors"
        >
          Login
        </Button>

        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
          Forgot password
        </button>

        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
