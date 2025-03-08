import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const newStatus = event.target.value;

      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }, // Ensure token is present
        }
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };
  const orderStatus = orders.map((order) => order.status);

  const deleteOrder = async (orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/delete",
        { orderId },
        {
          headers: { Authorization: `Bearer ${token}` }, // Ensure token is present
        }
      );
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        toast.success("Order deleted successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete order.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const statusOptions = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];

  return (
    <div>
      <h3 className="mb-4 text-xl font-bold">Orders</h3>
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
                key={order._id}
              >
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
                    value={order.status}
                  >
                    <option value={order.status}>{order.status}</option>
                    {nextStatus && (
                      <option value={nextStatus}>{nextStatus}</option>
                    )}
                  </select>
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
