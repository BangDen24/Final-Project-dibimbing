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
    <div className="w-screen h-[100vh] flex flex-col justify-center items-center bg-gray-50">
      <div className="p-6 glassmorphism bg-opacity-10 rounded-lg shadow-md w-96">
        <h1 className="mb-4 text-2xl font-bold text-center text-gray-900">
          Snap<span className="text-green-700">Feed</span>
        </h1>
        {error && <Alert variant="destructive">{error}</Alert>}
        {message && <Alert variant="default">{message}</Alert>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <Input
              className="border-opacity-5"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900">
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
          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-green-500 hover:text-gray-900 text-white font-bold"
          >
            Login
          </Button>
        </form>
        <p className="mt-4 text-gray-900">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-gray-900 hover:text-green-600 font-bold"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
