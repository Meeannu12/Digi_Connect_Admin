import axios from "axios";
import React, { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Use useNavigate for redirection

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token); // Store token in state/localStorage if needed
        localStorage.setItem("token", response.data.token); // Store token in localStorage if needed

        // Redirect based on user role (only "admin" and "user" allowed)
        if (response.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (response.data.user.role === "user") {
          navigate("/user/add");
        } else {
          navigate("/error")
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="max-w-md px-8 py-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Email Address
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="mb-2 text-sm font-medium text-gray-700">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            className="w-full px-4 py-2 mt-2 text-white bg-black rounded-md"
            type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
