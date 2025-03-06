import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const LevelIncome = ({ token, userData }) => {
  const [level, setLevel] = useState([]);

  useEffect(() => {
    if (!userData?._id) return;

    const fetchLevel = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/level/getAllLevel`,
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Correct header usage
          }
        );

        console.log(response.data);
        setLevel(response.data.level);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchLevel();
  }, [userData?._id, backendUrl, token]);

  return (
    <div className="container mx-auto p-0">
      <div className="flex justify-around">
        <h2 className="mb-4 text-2xl font-bold text-center">All Level</h2>
        <h2 className="mb-4 text-2xl font-bold text-center">
          <button
            // onClick={() => setUploadShowModel(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Add New Level
          </button>
        </h2>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto w-[100%] hidden sm:block">
        <table className="w-full border-collapse border text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">S.No.</th>
              <th className="px-4 py-2 border">Level</th>
              <th className="px-4 py-2 border">Left</th>
              <th className="px-4 py-2 border">Right</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {level.map((level, index) => (
              <tr key={level._id} className="text-center">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{level.levelName}</td>
                <td className="px-4 py-2 border">{level.left}</td>
                <td className="px-4 py-2 border">{level.right}</td>
                <td className="px-4 py-2 border">{level.price}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Cards) */}
      {/* <div className="flex flex-wrap w-full sm:hidden">
      {image.map((user, index) => (
        <div
          key={user._id}
          className="p-3 mb-2 w-full border rounded-md shadow-md"
        >
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
              className="border rounded px-2 py-1 bg-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </p>
          <button
            onClick={() => handleDeleteClick(user)}
            className="mt-2 w-full px-6 py-2 text-white bg-red-500 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div> */}

      {/* Delete Confirmation Modal */}
      {/* {showModal && selectedUser && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-50">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 bg-white rounded-lg shadow-lg">
          <h3 className="mb-4 text-xl font-semibold text-center">
            Confirm Delete
          </h3>
          <p>Are you sure you want to delete this image</p>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-6 py-2 text-white bg-red-500 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )} */}
    </div>
  );
};

export default LevelIncome;
