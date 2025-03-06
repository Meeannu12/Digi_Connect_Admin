import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = ({ userData }) => {
  const adminLinks = [
    {
      title: "List All Items",
      link: "/admin/allitems",
      icon: <i className="fa-solid fa-list"></i>,
    },
    {
      title: "Orders",
      link: "/admin/orders",
      icon: <img className="w-5 h-5" src={assets.order_icon} alt="" />,
    },
    {
      title: "All Users",
      link: "/admin/allusers",
      icon: <i className="fa-solid fa-users"></i>,
    },
    {
      title: "Banner Images",
      link: "/admin/banner",
      icon: <i className="fa-solid fa-users"></i>,
    },
  ];

  const userLinks = [
    {
      title: "Add Item",
      link: "/user/add",
      icon: <img className="w-5 h-5" src={assets.add_icon} alt="" />,
    },
    {
      title: "List Items",
      link: "/user/listproducts",
      icon: <i className="fa-solid fa-calendar-days"></i>,
    },
    {
      title: "Orders",
      link: "/user/sellerorder",
      icon: <img className="w-5 h-5" src={assets.order_icon} alt="" />,
    },
  ];

  const links = userData?.role === "admin" ? adminLinks : userLinks;

  return (
    <div className="w-[15%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[10%] text-[15px]">
        {links.map((item, index) => (
          <NavLink
            key={index}
            className="flex items-center gap-3 px-3 py-2 border border-r-0 border-gray-300 rounded-l"
            to={item.link}
          >
            {item.icon}
            <p className="hidden lg:block">{item.title}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
