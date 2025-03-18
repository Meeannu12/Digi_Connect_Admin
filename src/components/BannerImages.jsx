import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const BannerImages = ({ token, userData }) => {
  const [image, setimage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [uploadShowModel, setUploadShowModel] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (!userData?._id) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/banner`, {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Correct header usage
        });

        // if (response.data) {
        console.log(response.data.results.data);
        setimage(response.data.results.data);
        // }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [userData?._id, backendUrl, token]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${backendUrl}/api/banner/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          //   data: { id: selectedUser._id }, // ✅ Sending ID in body
        }
      );

      if (response.data.success) {
        setimage(image.filter((image) => image._id !== selectedUser._id));
        setShowModal(false);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile); // 'image' should match the backend key

    try {
      const response = await axios.post(
        `${backendUrl}/api/banner`, // Change to your API URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // ✅ Correct header usage
          },
        }
      );

      alert("Image uploaded successfully!");

      setUploadShowModel(false); // Close modal after upload
      setSelectedFile(null); // Reset file input
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="container p-0 mx-auto">
      <div className="flex justify-around">
        <h2 className="mb-4 text-2xl font-bold text-center">All Banner</h2>
        <h2 className="mb-4 text-2xl font-bold text-center">
          <button
            onClick={() => setUploadShowModel(true)}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
          >
            Add Banner
          </button>
        </h2>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto w-[100%] hidden sm:block">
        <table className="w-full text-sm border border-collapse sm:text-base">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">S.No.</th>
              <th className="px-4 py-2 border">Images</th>
              <th className="px-4 py-2 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {image.map((user, index) => (
              <tr key={user._id} className="text-center">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 text-center border">
                  <img
                    src={user.image}
                    alt="Uploaded"
                    width="100"
                    className="mx-auto"
                  />
                </td>
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
      <div className="flex flex-wrap w-full sm:hidden">
        {image.map((user, index) => (
          <div
            key={user._id}
            className="w-full p-3 mb-2 border rounded-md shadow-md"
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
                className="px-2 py-1 bg-white border rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </p>
            <button
              onClick={() => handleDeleteClick(user)}
              className="w-full px-6 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-700"
            >
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
      )}

      {/* Modal for Uploading Image */}
      {uploadShowModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-50">
          <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-center">
              Upload Banner Image
            </h3>

            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 mb-4 border rounded"
            />

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setUploadShowModel(false)}
                className="px-6 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-6 py-2 text-white bg-green-500 rounded hover:bg-green-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    // <div>hello</div>
  );
};

export default BannerImages;
