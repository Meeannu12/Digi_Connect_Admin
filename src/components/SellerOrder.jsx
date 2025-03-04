import React, { useState, useEffect } from "react";
import { currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const SellerOrder = ({ userData, token }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (userData?.orders) {
      setOrders(userData.orders);
    }
  }, [userData]);

  const statusOptions = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];

  const statusHandler = (event, orderId) => {
    const newStatus = event.target.value;
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success("Order status updated!");
  };

  return (
    <div className="p-4">
      <h3 className="mb-4 text-xl font-bold">Seller Orders</h3>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div>
          {orders.map((order, index) => {
            const currentStatusIndex = statusOptions.indexOf(order.status);
            const nextStatus = statusOptions[currentStatusIndex + 1];

            return (
              <div
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
                key={order._id}>
                <img className="w-12" src={assets.parcel_icon} alt="" />
                <div>
                  {order.items.map((item, idx) => (
                    <p key={idx} className="py-0.5">
                      {item.name} x {item.quantity} <span>{item.size}</span>
                      {idx !== order.items.length - 1 && ","}
                    </p>
                  ))}
                  <p className="mt-3 mb-2 font-medium">
                    {order.address.firstName + " " + order.address.lastName}
                  </p>
                  <div>
                    <p>{order.address.street + ","}</p>
                    <p>
                      {order.address.city +
                        ", " +
                        order.address.state +
                        ", " +
                        order.address.country +
                        ", " +
                        order.address.zipcode}
                    </p>
                  </div>
                  <p>{order.address.phone}</p>
                </div>
                <div>
                  <p className="text-sm sm:text-[15px]">
                    Items: {order.items.length}
                  </p>
                  <p className="mt-3">Method: {order.paymentMethod}</p>
                  <p>Payment: {order.payment ? "Done" : "Pending"}</p>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <p className="text-sm sm:text-[15px]">
                  {currency}
                  {order.amount}
                </p>

                <div className="flex items-center gap-2">
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    className="p-2 font-semibold"
                    value={order.status}>
                    <option value={order.status}>{order.status}</option>
                    {nextStatus && (
                      <option value={nextStatus}>{nextStatus}</option>
                    )}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerOrder;
