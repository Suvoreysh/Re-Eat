import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = "http://localhost:5000/api";

type CategoryFormProps = {
  initialData?: any;
  onSuccess: () => void;
};

const CategoryForm = ({ initialData, onSuccess }: CategoryFormProps) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "🍔",
    order: "0",
    isActive: true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("adminToken");

  // Common emoji icons for categories
  const commonIcons = ["🍔", "🍕", "🍗", "🌮", "🥤", "🍰", "🍟", "🥗", "🍜", "🍱"];

  /* ---------- LOAD EDIT DATA ---------- */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        icon: initialData.icon || "🍔",
        order: String(initialData.order || "0"),
        isActive: initialData.isActive ?? true,
      });

      setPreview(
        initialData.image
          ? `http://localhost:5000${initialData.image}`
          : null
      );
    }
  }, [initialData]);

  /* ---------- INPUT CHANGE ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

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

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name) {
      toast.error("Category name is required");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("icon", form.icon);
    data.append("order", form.order);
    data.append("isActive", String(form.isActive));

    if (image) {
      data.append("image", image);
    }

    try {
      setLoading(true);

      const res = await fetch(
        initialData
          ? `${API}/categories/${initialData._id}`
          : `${API}/categories`,
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

      toast.success(
        json.message || (initialData ? "Category updated" : "Category created")
      );
      onSuccess();

      if (!initialData) {
        setForm({
          name: "",
          description: "",
          icon: "🍔",
          order: "0",
          isActive: true,
        });
        setImage(null);
        setPreview(null);
      }
    } catch (err: any) {
      console.error("Error saving category:", err);
      toast.error(err.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      <h2>{initialData ? "Edit Category" : "Create Category"}</h2>

      {/* NAME */}
      <input
        name="name"
        placeholder="Category Name *"
        value={form.name}
        onChange={handleChange}
        required
      />

      {/* DESCRIPTION */}
      <textarea
        name="description"
        placeholder="Category Description"
        value={form.description}
        onChange={handleChange}
        rows={3}
      />

      {/* ICON SELECTOR */}
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
          Category Icon
        </label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1.25rem",
          }}
        >
          {commonIcons.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setForm({ ...form, icon: emoji })}
              style={{
                width: "50px",
                height: "50px",
                fontSize: "24px",
                border: form.icon === emoji ? "3px solid #FF6B35" : "2px solid #FFE0D0",
                background: form.icon === emoji ? "#FFF3E0" : "#FFF9F0",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {emoji}
            </button>
          ))}
          <input
            type="text"
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="Or type emoji"
            style={{
              width: "50px",
              height: "50px",
              textAlign: "center",
              fontSize: "24px",
              marginBottom: 0,
            }}
          />
        </div>
      </div>

      {/* ORDER */}
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
          Display Order (lower number appears first)
        </label>
        <input
          type="number"
          name="order"
          placeholder="0"
          value={form.order}
          onChange={handleChange}
          min="0"
        />
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div style={{ position: "relative" }}>
          <img
            src={preview}
            alt="Category Preview"
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

      {/* FILE INPUT */}
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {/* ACTIVE CHECKBOX */}
      <label className="checkbox">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
        />
        <span>Active</span>
      </label>

      {/* SUBMIT BUTTON */}
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
          <>{initialData ? "Update Category" : "Create Category"}</>
        )}
      </button>
    </form>
  );
};

export default CategoryForm;