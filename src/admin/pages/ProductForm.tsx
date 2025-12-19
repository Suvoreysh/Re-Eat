import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = "https://re-eat-backend.onrender.com/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  isActive: boolean;  // Add this
  order: number;      // Add this
  description?: string; // Add this
  image?: string;     // Add this
  menuCount?: number; // Add this
  createdAt?: string; // Add this
}
type ProductFormProps = {
  initialData?: any;
  categories: Category[];
  onSuccess: () => void;
};

const ProductForm = ({ initialData, categories, onSuccess }: ProductFormProps) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "0",
    preparationTime: "15",
    calories: "0",
    isActive: true,
    isVeg: false,
    isSpicy: false,
    isBestSeller: false,
  });

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("adminToken");

  /* ---------- LOAD EDIT DATA ---------- */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        category: initialData.category?._id || "",
        price: String(initialData.price || ""),
        discount: String(initialData.discount || "0"),
        preparationTime: String(initialData.preparationTime || "15"),
        calories: String(initialData.calories || "0"),
        isActive: initialData.isActive ?? true,
        isVeg: initialData.isVeg ?? false,
        isSpicy: initialData.isSpicy ?? false,
        isBestSeller: initialData.isBestSeller ?? false,
      });

      setIngredients(initialData.ingredients || []);
      setPreview(
        initialData.image ? `https://re-eat-backend.onrender.com${initialData.image}` : null
      );
    }
  }, [initialData]);

  /* ---------- INPUT CHANGE ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------- IMAGE CHANGE ---------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------- REMOVE IMAGE ---------- */
  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  /* ---------- ADD INGREDIENT ---------- */
  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };

  /* ---------- REMOVE INGREDIENT ---------- */
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.price) {
      toast.error("Name, category, and price are required");
      return;
    }

    const price = parseFloat(form.price);
    const discount = parseFloat(form.discount);

    if (isNaN(price) || price < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (isNaN(discount) || discount < 0 || discount > 100) {
      toast.error("Discount must be between 0 and 100");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("category", form.category);
    data.append("price", form.price);
    data.append("discount", form.discount);
    data.append("preparationTime", form.preparationTime);
    data.append("calories", form.calories);
    data.append("isActive", String(form.isActive));
    data.append("isVeg", String(form.isVeg));
    data.append("isSpicy", String(form.isSpicy));
    data.append("isBestSeller", String(form.isBestSeller));
    data.append("ingredients", JSON.stringify(ingredients));

    if (image) {
      data.append("image", image);
    }

    try {
      setLoading(true);

      const res = await fetch(
        initialData ? `${API}/menu/${initialData._id}` : `${API}/menu`,
        {
          method: initialData ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");

      toast.success(json.message || (initialData ? "Product updated" : "Product created"));
      onSuccess();

      if (!initialData) {
        setForm({
          name: "",
          description: "",
          category: "",
          price: "",
          discount: "0",
          preparationTime: "15",
          calories: "0",
          isActive: true,
          isVeg: false,
          isSpicy: false,
          isBestSeller: false,
        });
        setIngredients([]);
        setImage(null);
        setPreview(null);
      }
    } catch (err: any) {
      console.error("Error saving product:", err);
      toast.error(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      <h2>{initialData ? "Edit Product" : "Create Product"}</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Left Column */}
        <div>
          {/* Name */}
          <input
            name="name"
            placeholder="Product Name *"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Category */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.9375rem",
              color: form.category ? "#1f2937" : "#FFB894",
              background: "#FFF9F0",
              border: "2px solid #FFE0D0",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            <option value="">Select Category *</option>
            {categories
              .filter((cat) => cat.isActive)
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
          </select>

          {/* Price & Discount */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <input
              type="number"
              name="price"
              placeholder="Price *"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
            <input
              type="number"
              name="discount"
              placeholder="Discount %"
              value={form.discount}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>

          {/* Final Price Display */}
          {form.price && (
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "#e8f5e9",
                borderRadius: "10px",
                marginBottom: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "14px", color: "#2e7d32", fontWeight: 600 }}>
                Final Price:
              </span>
              <span style={{ fontSize: "20px", color: "#2e7d32", fontWeight: 700 }}>
                $
                {(
                  parseFloat(form.price) -
                  (parseFloat(form.price) * parseFloat(form.discount)) / 100
                ).toFixed(2)}
              </span>
            </div>
          )}

          {/* Prep Time & Calories */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#666",
                  marginBottom: "4px",
                }}
              >
                Preparation Time (min)
              </label>
              <input
                type="number"
                name="preparationTime"
                placeholder="15"
                value={form.preparationTime}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#666",
                  marginBottom: "4px",
                }}
              >
                Calories
              </label>
              <input
                type="number"
                name="calories"
                placeholder="0"
                value={form.calories}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Description */}
          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            rows={5}
          />

          {/* Ingredients */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#666",
                marginBottom: "0.5rem",
              }}
            >
              Ingredients
            </label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input
                type="text"
                placeholder="Add ingredient"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIngredient();
                  }
                }}
                style={{ marginBottom: 0 }}
              />
              <button
                type="button"
                onClick={addIngredient}
                style={{
                  padding: "0.875rem 1rem",
                  background: "#FF6B35",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {ingredients.map((ing, index) => (
                <span
                  key={index}
                  style={{
                    padding: "0.5rem 0.75rem",
                    background: "#FFF3E0",
                    borderRadius: "20px",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {ing}
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#FF6B35",
                      cursor: "pointer",
                      fontSize: "16px",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {preview && (
        <div style={{ position: "relative" }}>
          <img
            src={preview}
            alt="Product Preview"
            style={{
              width: "100%",
              borderRadius: "12px",
              marginBottom: "15px",
              objectFit: "cover",
              maxHeight: "300px",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/800x400?text=Image+Preview";
            }}
          />
          <button
            type="button"
            onClick={removeImage}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(255, 107, 53, 0.9)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 107, 53, 1)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 107, 53, 0.9)";
              e.currentTarget.style.transform = "scale(1)";
            }}
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}

      {/* File Input */}
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {/* Checkboxes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0.75rem",
        }}
      >
        <label className="checkbox">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          <span>Active</span>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            name="isVeg"
            checked={form.isVeg}
            onChange={handleChange}
          />
          <span>🌱 Vegetarian</span>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            name="isSpicy"
            checked={form.isSpicy}
            onChange={handleChange}
          />
          <span>🌶️ Spicy</span>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            name="isBestSeller"
            checked={form.isBestSeller}
            onChange={handleChange}
          />
          <span>⭐ Best Seller</span>
        </label>
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading}>
        {loading ? (
          <>
            <span
              className="spinner spinner-sm"
              style={{ marginRight: "8px", display: "inline-block" }}
            ></span>
            Saving...
          </>
        ) : (
          <>{initialData ? "Update Product" : "Create Product"}</>
        )}
      </button>
    </form>
  );
};

export default ProductForm;