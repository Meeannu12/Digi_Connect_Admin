import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const ListProducts = ({ token, userData }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, [token, userData]);

  const fetchProducts = async () => {
    try {
      if (!userData?._id) return;

      const response = await axios.get(
        `${backendUrl}/api/product/list/${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Product removed successfully");
        // Remove product from local state
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (products.length === 0) {
    return <div>No products found</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Your Products</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="overflow-hidden border rounded-lg shadow-md"
          >
            {/* Product Image */}
            <img
              src={product.image[0]}
              alt={product.name}
              className="object-cover w-full h-48"
            />

            {/* Product Details */}
            <div className="p-4">
              <h3 className="mb-2 text-xl font-semibold">{product.name}</h3>
              <p className="mb-2 text-gray-600">
                {product.description.substring(0, 100)}...
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold">
                  {currency}
                  {product.price}
                </span>
                <span className="text-sm text-gray-500">
                  {product.category} - {product.subCategory}
                </span>
              </div>

              {/* Product Variants */}
              <div className="mb-2">
                <p className="text-sm text-gray-600">
                  Sizes: {product.sizes.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  Colors: {product.color.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  Cc: {product.cc}🪙
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-4 py-2 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProducts;