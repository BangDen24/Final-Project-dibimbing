// src/pages/login/index.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import LoginComponent from "@/components/features/loginPage/login";
import { login } from "../../api/api";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If user is already authenticated, redirect to home
      router.push("/");
    }
  }, [router]);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      console.log("Sending login data:", data);
      const response = await login(data);
      console.log("Login response:", response);
      localStorage.setItem("token", response.data.token);
      // Redirect to home page on successful login
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      // Handle login error, e.g., show error message
    }
  };

  return <LoginComponent onLogin={handleLogin} />;
};

export default Login;
