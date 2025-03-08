import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import AllUsers from "./pages/AllUsers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import User from "./components/User";
import Admin from "./components/Admin";
import ListProducts from "./components/ListProducts";
import SellerOrder from "./components/SellerOrder";
import AllItems from "./components/AllItems.jsx";
import BannerImages from "./components/BannerImages.jsx";
import LevelIncome from "./components/LevelIncome.jsx";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      setUserData(null);
    }
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `${backendUrl}/api/user/fetchuserdata`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.success) {
            setUserData(response.data.user);
          } else {
            toast.error(response.data.message);
            console.error("Failed to fetch user data:", response.data.message);
          }
        } catch (error) {
          console.error(
            "Error fetching user data:",
            error.response ? error.response.data.message : error.message
          );
          toast.error("Error fetching user data");
        }
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer autoClose={1000} />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} userData={userData} />
          <div className="flex">
            <Sidebar userData={userData} />
            <div className="flex-1 p-2">
              <Routes>
                {/* User Routes */}
                <Route
                  path="/user/dashboard"
                  element={<User token={token} userData={userData} />}
                />
                <Route
                  path="/user/add"
                  element={
                    userData ? (
                      <Add token={token} userData={userData} />
                    ) : (
                      <p>loading</p>
                    )
                  }
                />
                <Route
                  path="/user/listproducts"
                  element={<ListProducts token={token} userData={userData} />}
                />
                <Route
                  path="/user/sellerOrder"
                  element={<SellerOrder token={token} userData={userData} />}
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={<Admin userData={userData} />}
                />
                <Route path="/admin/list" element={<List />} />
                <Route
                  path="/admin/orders"
                  element={<Orders token={token} userData={userData} />}
                />
                <Route
                  path="/admin/allusers"
                  element={<AllUsers token={token} userData={userData} />}
                />
                <Route
                  path="/admin/allitems"
                  element={<AllItems token={token} userData={userData} />}
                />

                <Route
                  path="/admin/banner"
                  element={<BannerImages token={token} userData={userData} />}
                />

                <Route
                  path="/admin/level"
                  element={<LevelIncome token={token} userData={userData} />}
                />

                {/* Default Redirect */}
                {/* <Route path="*" element={<Navigate to="/user/dashboard" />} /> */}
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
