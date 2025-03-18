import React, { useState, useEffect } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import axios from "axios";

const SellerOrder = ({ userData, token }) => {
  const [orders, setOrders] = useState([]);
  const [totalCC, setTotalCC] = useState(0); // ✅ Store total CC in state

  useEffect(() => {
    const fetchOrders = async () => {
      if (userData?.selled?.length > 0) {
        try {
          const orderRequests = userData.selled.map((orderId) =>
            axios.get(`${backendUrl}/api/order/singleorder/${orderId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          );

          const responses = await Promise.all(orderRequests);
          const fetchedOrders = responses
            .map((res) => res.data.order)
            .filter((order) => order);

          setOrders(fetchedOrders);

          // ✅ Calculate total CC after fetching orders
          const calculatedCC = fetchedOrders.reduce((acc, order) => {
            return (
              acc +
              order.items.reduce(
                (sum, item) => sum + (item?.productId?.cc || 0),
                0
              )
            );
          }, 0);

          setTotalCC(calculatedCC);
        } catch (error) {
          console.error("Error fetching orders:", error);
          toast.error("Failed to load orders!");
        }
      } else {
        setOrders([]);
      }
    };

    fetchOrders();
  }, [userData, token]);

  // ✅ Update CC when `totalCC` changes
  useEffect(() => {
    if (totalCC > 0) {
      updateUserCC(totalCC);
    }
  }, [totalCC]);

  const updateUserCC = async (newTotalCC) => {
    try {
      await axios.put(
        `${backendUrl}/api/user/updatecc`,
        { userId: userData._id, totalcc: newTotalCC },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Total CC updated!");
    } catch (error) {
      console.error("Failed to update CC:", error);
      toast.error("Could not update CC.");
    }
  };

  const statusOptions = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      await axios.post(
        `${backendUrl}/api/order/updatestatus`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success("Order status updated!");
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Could not update order status.");
    }
  };
  

  return (
    <div className="p-4">
      <h3 className="mb-4 text-xl font-bold">Seller Orders</h3>
<<<<<<< HEAD
      <h3 className="mb-4 text-md font-bold">Your Current Cc: <span className="text-gray-600">{userData?.cc}🪙</span></h3>
      {userData?.level ==='' &&(
        <h3 className="mb-4 text-md font-bold">Your Current Level: <span className="text-gray-600">{userData?.level}</span></h3>
      )}

=======
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
      {!orders || orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div>
          {orders.map((order) => {
            const currentStatusIndex = statusOptions.indexOf(order.status);
            const nextStatus = statusOptions[currentStatusIndex + 1];

            return (
              <div
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] 
  gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 
  text-xs sm:text-sm text-gray-700"
                key={order._id}>
                <img
                  className="w-12"
                  src={assets.parcel_icon}
                  alt="Parcel Icon"
                />

                {/* Product Details */}
                <div>
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <h2 className="text-lg font-semibold">
                        Product Name:{" "}
                        {item?.productId?.name || "Product Name Unavailable"}
                      </h2>
                      <p className="font-bold text-gray-800">
                        Price: ₹{item?.productId?.price || "N/A"}
                      </p>
                      <p>CC: {item?.productId?.cc || 0}🪙</p>
                    </div>
                  ))}
                  {order.items.map((item, idx) => (
                    <p key={idx} className="py-0.5">
                      {item?.productId?.name || "Unknown"} x {item?.quantity}
                      <span> {item?.size}</span>
                      {idx !== order.items.length - 1 && ","}
                    </p>
                  ))}
                  <p className="mt-3 mb-2 font-medium">{order.userId.name}</p>
                  <div>
                    <p>{order.userId.address.street},</p>
                    <p>
                      {order.userId.address.city}, {order.userId.address.state},{" "}
                      {order.userId.address.country},{" "}
                      {order.userId.address.zipcode}
                    </p>
                  </div>
                  <p>{order.userId.phone}</p>
                </div>

                {/* Payment & Order Status */}
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
