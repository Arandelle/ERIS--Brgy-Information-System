import React, { useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() =>{
    if(error) {
      const timer = setTimeout(()=>{
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = (event) => {
    event.preventDefault();

    email !== "admin@example.com" ? setError("The email you entered is incorrect") :
    password !== "password123" ? setError("The password you entered is incorrect") :
     (setAuth(true), navigate("/dashboard", {state: {message: "Login Successful"}}))
  };

  return (
    <>
      <main className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-800 px-4">
        <div className="w-full max-w-md">
          <div className="space-y-1">
            <h1 className="text-2xl text-center dark:text-gray-300">
              Welcome Admin
            </h1>
            <h2 className="dark:text-gray-400">Email: admin@example.com</h2>
            <h2 className="dark:text-gray-400">Password: password123</h2>
          </div>
          <form action="" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="dark:text-gray-400">
                Email:
              </label>
              <input
                className="w-full border border-gray-300 rounded p-2"
                type="email"
                id="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="dark:text-gray-400">
                  Password:
                </label>
                <a href="#" className="text-sm underline dark:text-green-400">
                  Forget Password?
                </a>
              </div>
              <input
                className="w-full border border-gray-300 rounded p-2"
                type="password"
                id="password"
                placeholder="Type your password"
                required
                value={password}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
            <div>
              <button
                className="w-full bg-primary text-white text-bold p-2 rounded"
                type="submit"
              >
                Login
              </button>
            </div>
            {error && (
              <div
                class="flex items-center p-2 mb-4 mt-2 text-sm text-red-500 rounded-lg bg-red-200 dark:bg-gray-600 dark:text-red-400"
                role="alert"
              >
                <svg
                  class="flex-shrink-0 inline w-4 h-4 me-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                {error}
              </div>
            )}
          </form>
           
        </div>
      </main>
    </>
  );
}
