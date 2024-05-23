import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Luncher from "./Luncher";

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = (event) => {
    event.preventDefault();

    email !== "admin@example.com"
      ? setError("The email you entered is incorrect")
      : password !== "password123"
      ? setError("The password you entered is incorrect")
      : (setAuth(true),
        navigate("/dashboard", { state: { message: "Login Successful" } }));
  };

  return (
    <>
      {loading ? (<Luncher setLoading={setLoading}/>) : (
       <main className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-800 px-4">
       <div className="w-full max-w-md">
         <div className="space-y-1 mb-3">
           <h1 className="text-2xl text-center dark:text-gray-300">
             Welcome Admin
           </h1>
           <h2 className="dark:text-gray-400">Email: admin@example.com</h2>
           <h2 className="dark:text-gray-400 mb-3">Password: password123</h2>
         </div>
         <form action="" onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
             <label htmlFor="email" className="dark:text-gray-400">
               Email:
             </label>
             <div class="relative">
               <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                 <svg
                   class="w-4 h-4 text-gray-500 dark:text-gray-400"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor"
                   viewBox="0 0 20 16"
                 >
                   <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                   <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                 </svg>
               </div>
               <input
                 type="email"
                 id="email-address-icon"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="example@gmail.com"
               />
             </div>
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
             <div class="relative">
               <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 24 24"
                   fill="currentColor"
                   class="w-4 h-4 text-gray-500 dark:text-gray-400"
                 >
                   <path
                     fill-rule="evenodd"
                     d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                     clip-rule="evenodd"
                   />
                 </svg>
               </div>
               <input
                 type="password"
                 id="password"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required
                 onChange={(e) => setPass(e.target.value)}
                 placeholder="Password"
               />
             </div>
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
      )}
    </>
  );
}
