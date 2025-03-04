import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken, userData }) => {
  const fullName = userData?.name || "";
  const [firstName, ...lastName] = fullName.trim().split(/\s+/);

  return (
    <div className="flex items-center shadow-sm py-2 px-[4%] justify-between">
      <div className="flex items-center gap-2">
        <img className="w-40 " src={assets.logo} alt="" />
      </div>
        <h1 className="hidden text-xl font-semibold capitalize sm:block">Hello , {firstName}</h1>
      <button
        onClick={() => setToken("")}
        className="px-5 py-2 text-xs text-white bg-gray-600 rounded-full sm:px-7 sm:py-2 sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
