import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
// import Loader from "../components/Loader";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          backendUrl + "/api/user/fetchallusers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data.users);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${backendUrl}/api/user/updateRole`,
        { userId, role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        console.error("Failed to update role:", response.data.message);
      }
    } catch (err) {
      console.error("Error updating role:", err.response?.data || err);
    }
  };

  const updateBlockedStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${backendUrl}/api/user/updateBlocked`,
        { userId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // ✅ Update the state immediately to reflect the change
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, blocked: status } : user
          )
        );

        toast.success(`User ${status ? "Blocked" : "Unblocked"} Successfully`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Something went wrong. Try again!");
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handlePriceChange = async (userId, price) => {
    let updatedPrice = price.trim() === "" ? 0 : Number(price); // Ensure empty input is set to 0

    // Update state immediately for instant feedback
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, pricetopay: updatedPrice } : user
      )
    );

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${backendUrl}/api/user/updatePrice`,
        { userId, price: updatedPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Price updated successfully");
      } else {
        toast.error("Failed to update price");
      }
    } catch (error) {
      console.error("Error updating user price:", error);
      toast.error("Something went wrong. Try again!");
    }
  };

<<<<<<< HEAD
  if (loading) return "Loding....";
=======
  if (loading) return <p className="text-center">Loading users...</p>;
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container p-0 mx-auto">
      <h2 className="mb-4 text-2xl font-bold text-center">All Users</h2>

      {/* Desktop Table */}
      <div className="overflow-x-auto w-[100%] hidden sm:block">
        <table className="w-full text-sm border border-collapse sm:text-base">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">S.No.</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
<<<<<<< HEAD
              <th className="px-4 py-2 border">Blocked</th>
              <th className="px-4 py-2 border">Price To Pay</th>
=======
              <th className="hidden px-4 py-2 border md:table-cell">
                Location
              </th>
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
              <th className="hidden px-4 py-2 border md:table-cell">
                Joining Date
              </th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="text-center">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
<<<<<<< HEAD
                    className="px-2 py-1 bg-white border rounded"
                  >
=======
                    className="px-2 py-1 bg-white border rounded">
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="hidden px-4 py-2 border md:table-cell">
<<<<<<< HEAD
                  <select
                    value={user?.blocked ? "true" : "false"}
                    onChange={(e) =>
                      updateBlockedStatus(user._id, e.target.value === "true")
                    }
                    className="px-2 py-1 border rounded"
                  >
                    <option value="true">Blocked</option>
                    <option value="false">Unblocked</option>
                  </select>
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    className="w-[100px] px-2 border"
                    value={user?.pricetopay ?? ""}
                    onChange={(e) =>
                      handlePriceChange(user._id, e.target.value)
                    }
                    placeholder="0"
                  />
                </td>
=======
                  {user.address?.city}, {user.address?.state}
                </td>
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
                <td className="hidden px-4 py-2 border md:table-cell">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDeleteClick(user)}
<<<<<<< HEAD
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
                  >
                    Details
=======
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700">
                    Delete
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Cards) */}
      <div className="flex flex-wrap w-full sm:hidden">
        {users.map((user, index) => (
          <div
            key={user._id}
<<<<<<< HEAD
            className="w-full p-3 mb-2 border rounded-md shadow-md"
          >
=======
            className="w-full p-3 mb-2 border rounded-md shadow-md">
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
            <p>
              <strong>S.No:</strong> {index + 1}
            </p>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p className="">
              <strong>State:</strong>
              <select
                value={user?.blocked ? "true" : "false"}
                onChange={(e) =>
                  updateBlockedStatus(user._id, e.target.value === "true")
                }
                className=""
              >
                <option value="true">Blocked</option>
                <option value="false">Unblocked</option>
              </select>
            </p>
            <p className="">
              <strong>Pricetopay</strong>
              <input
                type="number"
                className="w-[100px] px-2 border"
                value={user?.pricetopay ?? ""}
                onChange={(e) => handlePriceChange(user._id, e.target.value)}
                placeholder="0"
              />
            </p>
            <p>
              <strong>Location:</strong> {user.address?.city},{" "}
              {user.address?.state}
            </p>
            <p>
              <strong>Joining Date:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
<<<<<<< HEAD
                className="px-2 py-1 bg-white border rounded"
              >
=======
                className="px-2 py-1 bg-white border rounded">
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </p>
            <button
              onClick={() => handleDeleteClick(user)}
<<<<<<< HEAD
              className="w-full px-6 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-700"
            >
              Details
=======
              className="w-full px-6 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-700">
              Delete
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-50">
          <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-lg sm:max-w-sm md:max-w-md">
<<<<<<< HEAD
            <h3 className="mb-4 text-xl font-semibold text-center">Details</h3>
=======
            <h3 className="mb-4 text-xl font-semibold text-center">
              Confirm Deletion
            </h3>
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Street:</strong> {selectedUser.address?.street},{" "}
            </p>
            <p>
<<<<<<< HEAD
              <strong>Uid:</strong> {selectedUser.uid},{" "}
            </p>
            <p>
              <strong>Option:</strong> {selectedUser.option},{" "}
            </p>

            <p>
              <strong>Location:</strong> {selectedUser.address?.city},{" "}
=======
              <strong>Zipcode:</strong> {selectedUser.address?.zipcode},{" "}
            </p>
            <p>
            <p>
              <strong>Location:</strong> {selectedUser.address?.city},{" "}
            </p>
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
              <strong>State:</strong>
              {selectedUser.address?.state}
            </p>
            <p>
              <strong>Zipcode:</strong> {selectedUser.address?.zipcode},{" "}
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-500">
                Cancel
              </button>
<<<<<<< HEAD
=======
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2 text-white bg-red-500 rounded hover:bg-red-700">
                Delete
              </button>
>>>>>>> 3cb56b71ee13b48fba165cf1723853e41f942e4a
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
