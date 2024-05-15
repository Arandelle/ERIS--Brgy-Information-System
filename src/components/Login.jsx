import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@example.com" && password === "password123") {
      setAuth(true);
      navigate('/dashboard');
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="flex h-screen w-full items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="space-y-1">
          <h1 className="text-2xl">Welcome back</h1>
          <p>Enter your email and password to access your account.</p>
          <p>Email: admin@example.com Password: password123  </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              placeholder="m@example.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password">Password</label>
              <a className="text-sm underline" href="#">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              required  
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
