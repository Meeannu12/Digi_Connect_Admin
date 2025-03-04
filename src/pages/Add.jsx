import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token, userData }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Phone");
  const [customCategory, setCustomCategory] = useState("");
  const [subCategory, setSubCategory] = useState("20k");
  const [customSubCategory, setCustomSubCategory] = useState("");
  const [bestseller, setBestseller] = useState("");
  const [sizes, setSizes] = useState([]);

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
      formData.append(
        "category",
        category === "Other" ? customCategory : category
      );
      formData.append(
        "subCategory",
        subCategory === "Other" ? customSubCategory : subCategory
      );
      formData.append("bestseller", bestseller);
      formData.append(
        "sizes",
        JSON.stringify(sizes.length > 0 ? sizes : ["Default"])
      );

      if (category === "Phone" || category === "Laptop") {
        formData.append(
          "color",
          JSON.stringify(Array.isArray(color) ? color : [color])
        );
        formData.append("ram", ram);
        formData.append("rom", rom);
      }

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
            // Don't set Content-Type with FormData, axios will set it automatically
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
        setCustomColor("");
        setSizes([]);
        setBestseller(false);
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

  // Show loading state while waiting for userData
  if (!userData) {
    return (
      <>
        <p>Loading user data...</p>
      </>
    );
  }

  if (userData.role === "user") {
    return (
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:pl-2 pl-0 items-start w-full gap-3"
      >
        <div>
          <p className="text-xl mb-2">Upload Image</p>
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
          <p className="text-xl mb-2">Product name</p>
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
          <p className="text-xl mb-2">Product description</p>
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
            <p className="text-xl mb-2">Product category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2"
            >
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
            <p className="text-xl mb-2">Sub category</p>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-3 py-2"
            >
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
            <p className="text-xl mb-2">Product Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-3 py-2 sm:w-[120px]"
              type="number"
              placeholder="25"
            />
          </div>
        </div>

        <div>
          <p className="text-xl mb-2">Select Colors</p>
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
                }`}
              >
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
                  className="px-3 py-1 bg-green-200 border rounded cursor-pointer"
                >
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
                className="px-3 py-1 text-white bg-blue-500 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xl mb-2">Product Variant (RAM/ROM)</p>
          <div className="flex gap-3">
            {/* Predefined sizes (4GB/64GB, 6GB/64GB, etc.) */}
            {["4/64", "6/64", "8/128", "12/256"].map((variant) => (
              <div
                key={variant}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(variant)
                      ? prev.filter((item) => item !== variant)
                      : [...prev, variant]
                  )
                }
              >
                <p
                  className={`${
                    sizes.includes(variant)
                      ? "bg-pink-100 border-pink-500"
                      : "bg-slate-200"
                  } px-3 py-1 cursor-pointer border rounded`}
                >
                  {variant}
                </p>
              </div>
            ))}

            {/* Option for custom RAM/ROM */}
            <div>
              <input
                type="text"
                placeholder="Type default if no size"
                className="px-3 py-1"
                value={customVariant}
                onChange={(e) => setCustomVariant(e.target.value)}
                onBlur={() => {
                  if (customVariant) {
                    setSizes((prev) => [...prev, customVariant]);
                    setCustomVariant(""); // Reset custom input after adding
                  }
                }}
              />
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

        <button type="submit" className="py-3 mt-4 text-white bg-black w-28">
          ADD
        </button>
      </form>
    );
  }
};

export default Add;
