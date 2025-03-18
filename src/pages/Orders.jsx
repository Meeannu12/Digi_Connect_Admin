import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [productDetails, setProductDetails] = useState({});

  // Fetch All Orders
  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const fetchedOrders = response.data.orders.map((order) => ({
          ...order,
          address: order.address || {},
        }));

        setOrders(fetchedOrders.reverse());

        // Extract unique user IDs
        const userIds = [
          ...new Set(fetchedOrders.map((order) => order.userId)),
        ];
        fetchUserDetails(userIds);

        // Fetch product details
        fetchProductDetails(fetchedOrders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch User Details
  const fetchUserDetails = async (userIds) => {
    if (userIds.length === 0) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/fetchMultipleUsers`,
        { userIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Store users in an object for quick access
        const userMap = {};
        response.data.users.forEach((user) => {
          userMap[user._id] = user;
        });
        setUserDetails(userMap);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch Product Details
  const fetchProductDetails = async (orders) => {
    const productIds = [
      ...new Set(
        orders.flatMap((order) => order.items.map((item) => item.productId))
      ),
    ];

    try {
      const productResponses = await Promise.all(
        productIds.map(
          async (productId) =>
            await axios.post(`${backendUrl}/api/product/single/${productId}`)
        )
      );

      const productMap = {};
      productResponses.forEach((response) => {
        const product = response.data.product;
        productMap[product._id] = product;
      });

      setProductDetails(productMap);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  const DeleteOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/delete`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // ✅ Remove the deleted order from the UI
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        toast.success("Order deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete order.");
      }
    } catch (error) {
      toast.error("Error deleting order.");
    }
  };

  // Handle Status Change
  const statusHandler = async (event, orderId) => {
    try {
      const newStatus = event.target.value;
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success("Order status updated!");
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      toast.error("Error updating order status.");
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

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div>
          {orders.map((order) => {
            const currentStatusIndex = statusOptions.indexOf(order.status);
            const nextStatus = statusOptions[currentStatusIndex + 1];

            return (
              <div
                key={order._id}
                className="p-5 my-3 text-sm text-gray-700 border-2 border-gray-200 md:p-8 md:my-4">
                {/* Order Header */}
                <div className="mb-3">
                  <h4 className="font-semibold">Order ID: {order._id}</h4>
                  <p>Date: {new Date(order.date).toLocaleString()}</p>
                </div>

                {/* User Details */}
                {userDetails[order.userId] ? (
                  <div className="p-3 bg-gray-100 rounded">
                    <h5 className="font-medium">👤 User Details:</h5>
                    <p>
                      <strong>Name:</strong> {userDetails[order.userId].name}
                    </p>
                    <p>
                      <strong>Email:</strong> {userDetails[order.userId].email}
                    </p>
                    <p>
                      <strong>Street:</strong>{" "}
                      {userDetails[order.userId].address.street}
                    </p>
                    <p>
                      <strong>City:</strong>{" "}
                      {userDetails[order.userId].address.city}
                    </p>
                    <p>
                      <strong>State:</strong>{" "}
                      {userDetails[order.userId].address.state}
                    </p>
                    <p>
                      <strong>Country:</strong>{" "}
                      {userDetails[order.userId].address.country}
                    </p>
                    <p>
                      <strong>Zipcode:</strong>{" "}
                      {userDetails[order.userId].address.zipcode}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Fetching user details...
                  </p>
                )}

<<<<<<< HEAD
                {/* Order Items */}
                <h5 className="mt-4 font-medium">🛒 Items:</h5>
                <ul>
                  {order.items.map((item, index) => {
                    const product = productDetails[item.productId];

                    return (
                      <li key={index} className="p-3 mt-2 bg-gray-100 rounded">
                        {product ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="object-cover w-16 h-16 rounded"
                            />
                            <div className="flex gap-2">
                              <p>
                                <strong>Name:</strong> {product.name}
                              </p>
                              <p>
                                <strong>Price:</strong> {currency}
                                {product.price}
                              </p>
                              <p>
                                <strong>Size:</strong> {item.size}
                              </p>
                              <p>
                                <strong>Quantity:</strong> {item.quantity}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500">
                            Fetching product details...
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <button
                  onClick={() => DeleteOrder(order._id)}
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                  Delete Order
                </button>
=======
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
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
