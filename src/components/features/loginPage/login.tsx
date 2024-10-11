// src/components/features/loginPage/index.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface LoginData {
  email: string;
  password: string;
}

interface Props {
  onLogin: (data: LoginData) => void;
}

const LoginComponent: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = { email, password };
      await onLogin(data);
      setMessage("Login successful");
      setError(null);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-sky-500 to-indigo-500">
      <div className="p-6 glassmorphism bg-opacity-10 rounded-lg shadow-md w-96">
        <h1 className="mb-4 text-2xl font-bold text-center">Login</h1>
        {error && <Alert variant="destructive">{error}</Alert>}
        {message && <Alert variant="default">{message}</Alert>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              className="border-opacity-5"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              className="border-opacity-5"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <p className="mt-4">
          Have and account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
