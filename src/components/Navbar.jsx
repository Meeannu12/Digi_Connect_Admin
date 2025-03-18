import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const Navbar = ({ setToken, userData }) => {
  const fullName = userData?.name || "";
  const [firstName] = fullName.trim().split(/\s+/);
  const priceToPay = userData?.pricetopay || 0;
  const threshold = 100;
  const [showWarning, setShowWarning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const blockUser = async (userId) => {
    try {
      const response = await fetch(`${backendUrl}/api/user/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast.success("You are blocked");
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error(error.message || "Error blocking user");
    }
  };

  useEffect(() => {
    if (userData?.blocked) {
      setShowWarning(false);
      setShowTimer(false);
      setTimeLeft(0);
      return;
    }

    if (priceToPay > threshold) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [priceToPay, userData?.blocked]);

  useEffect(() => {
    if (userData?.blocked || priceToPay === 0) {
      setTimeLeft(0);
      return;
    }

    const createdAtTime = new Date(userData?.updatedAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - createdAtTime) / 1000; // Convert to seconds

    const totalAllowedTime = 432000; // 5 days in seconds
    let remainingTime = totalAllowedTime - elapsedTime;

    if (remainingTime < 0) remainingTime = 0;
    setTimeLeft(remainingTime);

    if (remainingTime <= 172800) {
      setShowTimer(true); // Show timer only if < 2 days left
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          alert("Your time is up! You are now blocked.");
          blockUser(userData._id);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [priceToPay, userData?.products]);

  // Function to format time in HH:MM:SS
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${days}d ${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <>
      <div className="flex items-center shadow-sm py-2 px-[4%] justify-between border-b">
        <div className="flex items-center gap-2">
          <img className="w-40" src={assets.logo} alt="Logo" />
        </div>
        <h1 className="hidden text-xl font-semibold capitalize sm:block">
          Hello, {firstName}
        </h1>
        <button
          onClick={() => setToken("")}
          className="px-5 py-2 text-xs text-white bg-gray-600 rounded-full sm:px-7 sm:py-2 sm:text-sm">
          Logout
        </button>
      </div>

      {showWarning && !userData?.blocked && (
        <div className="relative p-4 w-full sm:w-[80%] mx-auto mt-2 text-center bg-white border border-red-500 shadow-xl rounded-xl">
          <h1 className="text-lg text-red-500">
            You have to pay ₹{priceToPay} to the admin otherwise your account
            will be blocked.
          </h1>

          {showTimer && (
            <h2 className="mt-2 text-xl font-semibold text-gray-700">
              Time left:{" "}
              <span className="text-red-600">{formatTime(timeLeft)}</span>
            </h2>
          )}

          <button
            onClick={() => setShowWarning(false)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-red-500">
            ❌
          </button>
        </div>
      )}

      {userData?.blocked && (
        <p className="text-center text-red-500 border-b">
          You are blocked. Talk to the admin for unblocking.
        </p>
      )}
    </>
  );
};

export default Navbar;
