import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

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
  

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${backendUrl}/api/user/deleteuser/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { id: selectedUser._id }, // ✅ Sending ID in body
        }
      );

      if (response.data.success) {
        setUsers(users.filter((user) => user._id !== selectedUser._id));
        setShowModal(false);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (loading) return <p className="text-center">Loading users...</p>;
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
              <th className="hidden px-4 py-2 border md:table-cell">
                Location
              </th>
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
                    className="px-2 py-1 bg-white border rounded">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="hidden px-4 py-2 border md:table-cell">
                  {user.address?.city}, {user.address?.state}
                </td>
                <td className="hidden px-4 py-2 border md:table-cell">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700">
                    Delete
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
            className="w-full p-3 mb-2 border rounded-md shadow-md">
            <p>
              <strong>S.No:</strong> {index + 1}
            </p>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
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
                className="px-2 py-1 bg-white border rounded">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </p>
            <button
              onClick={() => handleDeleteClick(user)}
              className="w-full px-6 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-700">
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-50">
          <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-lg sm:max-w-sm md:max-w-md">
            <h3 className="mb-4 text-xl font-semibold text-center">
              Confirm Deletion
            </h3>
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
              <strong>Zipcode:</strong> {selectedUser.address?.zipcode},{" "}
            </p>
            <p>
            <p>
              <strong>Location:</strong> {selectedUser.address?.city},{" "}
            </p>
              <strong>State:</strong>
              {selectedUser.address?.state}
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-500">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2 text-white bg-red-500 rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
