import axios from "axios";
import React, { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const navigate = useNavigate(); // Use useNavigate for redirection
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = (data) => {
    setToken(data.token); // Store the token
    localStorage.setItem("token", data.token); // Save it for persistence
  };


  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        uid,
        password,
      });
      handleAuthSuccess(response.data);
      
      // Redirect based on user role (only "admin" and "user" allowed)
      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (response.data.user.role === "user") {
        navigate("/user/add");
      } else {
        navigate("/error")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      setUid("");
      setPassword("");
    }
  };

  
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="max-w-md px-8 py-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Your Uid
            </p>
            <input
              onChange={(e) => setUid(e.target.value)}
              value={uid}
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
              type="text"
              placeholder="Your Uid"
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
