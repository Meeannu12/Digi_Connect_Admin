import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
// import Loader from "../components/Loader";

const Add = ({ token, userData }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Phone");
  const [customCategory, setCustomCategory] = useState("");
  const [subCategory, setSubCategory] = useState("20k");
  const [customSubCategory, setCustomSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [cc, setcc] = useState("");
  const [show , setShow] = useState(false);

  // For Phone/Laptop specific details
  const [color, setColor] = useState([]);
  const [customVariant, setCustomVariant] = useState("Default");
  const [customColor, setCustomColor] = useState("Black");
  const [ram, setRam] = useState("");
  const [rom, setRom] = useState("");

  useEffect(() => {
    if (!token) {
      console.error("No token available");
      toast.error("Please login again");
    }
  }, [token]);

  const onSubmitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!token) {
      toast.error("Please login again");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);

      const cate = category === "Other" ? customCategory : category;

      formData.append("category", cate);
      const sub = subCategory === "Other" ? customSubCategory : subCategory;

      formData.append("subCategory", sub);
      formData.append("bestseller", bestseller);
      formData.append(
        "sizes",
        JSON.stringify(sizes.length > 0 ? sizes : ["Default"])
      );

      formData.append("cc", cc);
      if (category === "Phone" || category === "Laptop") {
        formData.append("ram", ram);
        formData.append("rom", rom);
      }
      formData.append(
        "color",
        JSON.stringify(Array.isArray(color) ? color : [color])
      );

      // Adding image files
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);


        // Updating userData.products
        if (userData && userData.products) {
          const newProduct = response.data.product; // Assuming backend returns the newly added product
          userData.products = [...userData.products, newProduct]; // Update the products array
        }

        setName("");
        setDescription("");
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setPrice("");
        setCustomCategory("");
        setCustomSubCategory("");
        setColor([]);
        setRam("");
        setRom("");
        setcc("");
        setCustomColor("");
        setSizes([]);
        setBestseller(false);
        setLoading(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error details:", error.response || error);
      toast.error(error.response?.data?.message || "Error adding product");
    }
  };

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    setImage(file);
  };

  console.log(userData.blocked)
  // Show loading state while waiting for userData
  if (!userData) {
    return (
      <>
        "Loader....."
      </>
    );
  }

  if (userData.role === "user") {
    return !userData?.blocked ? (
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-start w-full gap-3 pl-0 sm:pl-2">
        <div>
          <p className="mb-2 text-xl">Upload Image</p>
          <div className="flex gap-2">
            {/* Image Inputs */}
            {[image1, image2, image3, image4].map((image, index) => (
              <label key={index} htmlFor={`image${index + 1}`}>
                <img
                  className="w-20 transition cursor-pointer hover:scale-105"
                  src={!image ? assets.upload_area : URL.createObjectURL(image)}
                  alt={`Upload image ${index + 1}`}
                />
                <input
                  onChange={(e) =>
                    handleImageChange(e, eval(`setImage${index + 1}`))
                  }
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2 text-xl">Product name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Type here"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2 text-xl">Product description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-3 py-2 max-w-[500px]"
            placeholder="Write content here"
            required
          />
        </div>

        <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
          <div>
            <p className="mb-2 text-xl">Product category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2">
              <option value="Phone">Smart Phone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Other">Other</option>
            </select>
            {category === "Other" && (
              <input
                type="text"
                placeholder="Enter custom category"
                className="w-full px-3 py-2 mt-2"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
              />
            )}
          </div>

          <div>
            <p className="mb-2 text-xl">Sub category</p>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-3 py-2">
              <option value="20k">Under 20000</option>
              <option value="35k">Under 35000</option>
              <option value="40k">Under 40000</option>
              <option value="over 50k">Above 50000</option>
              <option value="Other">Other</option>
            </select>
            {subCategory === "Other" && (
              <input
                type="text"
                placeholder="Enter custom subcategory"
                className="w-full px-3 py-2 mt-2"
                value={customSubCategory}
                onChange={(e) => setCustomSubCategory(e.target.value)}
                required
              />
            )}
          </div>

          <div>
            <p className="mb-2 text-xl">Product Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-3 py-2 sm:w-[120px]"
              type="number"
              placeholder="25"
            />
          </div>
          <div>
            <p className="mb-2 text-xl">Product cc</p>
            <input
              onChange={(e) => setcc(e.target.value)}
              value={cc}
              className="w-full px-3 py-2 sm:w-[120px]"
              type="number"
              placeholder="5"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-xl">Select Colors</p>
          <div className="flex flex-wrap gap-3">
            {/* Predefined color options */}
            {["Black", "White", "Blue", "Red"].map((clr) => (
              <div
                key={clr}
                onClick={() =>
                  setColor((prev) =>
                    prev.includes(clr)
                      ? prev.filter((c) => c !== clr)
                      : [...prev, clr]
                  )
                }
                className={`px-3 py-1 cursor-pointer border rounded ${
                  color.includes(clr)
                    ? "bg-pink-100 border-pink-500"
                    : "bg-slate-200"
                }`}>
                {clr}
              </div>
            ))}

            {/* Selected Custom Colors */}
            {color
              .filter((clr) => !["Black", "White", "Blue", "Red"].includes(clr))
              .map((clr, index) => (
                <div
                  key={index}
                  onClick={() =>
                    setColor((prev) => prev.filter((c) => c !== clr))
                  }
                  className="px-3 py-1 bg-green-200 border rounded cursor-pointer">
                  {clr}
                </div>
              ))}

            {/* Custom color input with add button */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter custom color"
                className="px-3 py-1 border rounded"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customColor.trim()) {
                    setColor((prev) => [...prev, customColor.trim()]); // Add custom color
                    setCustomColor(""); // Clear input
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (customColor.trim()) {
                    setColor((prev) => [...prev, customColor.trim()]);
                    setCustomColor(""); // Clear input after adding
                  }
                }}
                className="px-3 py-1 text-white bg-blue-500 rounded">
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
          />
          <label className="cursor-pointer" htmlFor="bestseller">
            Add to bestseller
          </label>
        </div>

        <button
          type="submit"
          className="py-3 mt-4 text-white bg-black w-28"
          disabled={loading}>
          {loading ? "Loading..." : "ADD"}
        </button>
      </form>
    ) : (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center p-6 bg-red-100 border border-red-300 rounded-lg shadow-lg">
          <svg
            className="w-16 h-16 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
          <h1 className="mt-4 text-2xl font-semibold text-red-600">
            Access Denied
          </h1>
          <p className="mt-2 text-gray-700">
            Your account has been blocked. Please contact support for
            assistance.
          </p>
          <button
            className="px-4 py-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600"
            onClick={() => setShow(true)}>
            Contact Support
          </button>
          {show && (
            <p
              onClick={() => {
                navigator.clipboard.writeText("9462365447");
                setShow(false); 
                toast.success("Phone number copied to clipboard");
              }}
              className="mt-3 text-xl text-red-500 transition cursor-pointer hover:text-red-700">
              9462365447
            </p>
          )}
        </div>
      </div>
    );
  }

  
};

export default Add;
