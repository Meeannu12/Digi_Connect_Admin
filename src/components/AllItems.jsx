import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AllItems = ({ token, userData }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!userData?._id) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/product/list/`,
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Correct header usage
          }
        );

        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [userData?._id, backendUrl, token]);

  // ✅ Function to handle product removal
  const handleRemove = async (productId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/product/remove/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setProducts(products.filter((product) => product._id !== productId)); 
        toast.success("Successfully removed")
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Items</h2>
      {products.length === 0 ? (
        <p className="text-gray-600">No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-md">
              <img
                src={product.image[0]} // ✅ Assuming `image` field exists
                alt={product.name}
                className="w-full h-40 object-contain rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-sm text-gray-600">Category: {product.category}</p>
              <button
                onClick={() => handleRemove(product._id)}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllItems;
