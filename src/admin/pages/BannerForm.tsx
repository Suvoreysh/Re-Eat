import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = "https://re-eat-backend.onrender.com/api";

type BannerFormProps = {
  initialData?: any;
  onSuccess: () => void;
};

const BannerForm = ({ initialData, onSuccess }: BannerFormProps) => {
  const [form, setForm] = useState({
    key: "",
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    isActive: true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("adminToken");

  /* ---------- LOAD EDIT DATA ---------- */
  useEffect(() => {
    if (initialData) {
      setForm({
        key: initialData.key || "",
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        description: initialData.description || "",
        buttonText: initialData.buttonText || "",
        buttonLink: initialData.buttonLink || "",
        isActive: initialData.isActive ?? true,
      });

      setPreview(
        initialData.image
          ? `https://re-eat-backend.onrender.com${initialData.image}`
          : null
      );
    }
  }, [initialData]);

  /* ---------- INPUT CHANGE ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------- IMAGE CHANGE ---------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
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

    // Validation
    if (!form.key || !form.title) {
      toast.error("Key and title are required");
      return;
    }

    // Key validation (lowercase, no spaces)
    const keyRegex = /^[a-z0-9_]+$/;
    if (!keyRegex.test(form.key)) {
      toast.error("Key must be lowercase with no spaces (use underscores)");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, String(value))
    );

    if (image) {
      data.append("image", image);
    }

    try {
      setLoading(true);

      const res = await fetch(
        initialData
          ? `${API}/banners/${initialData._id}`
          : `${API}/banners`,
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

      toast.success(json.message || (initialData ? "Banner updated" : "Banner created"));
      onSuccess();

      // Reset form if creating new
      if (!initialData) {
        setForm({
          key: "",
          title: "",
          subtitle: "",
          description: "",
          buttonText: "",
          buttonLink: "",
          isActive: true,
        });
        setImage(null);
        setPreview(null);
      }
    } catch (err: any) {
      console.error("Error saving banner:", err);
      toast.error(err.message || "Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      <h2>{initialData ? "Edit Banner" : "Create Banner"}</h2>

      {/* KEY */}
      <div>
        <input
          name="key"
          placeholder="Banner Key (e.g., home_hero)"
          value={form.key}
          onChange={handleChange}
          disabled={!!initialData}
          style={
            initialData
              ? { opacity: 0.6, cursor: "not-allowed", background: "#f5f5f5" }
              : {}
          }
          required
        />
        {!initialData && (
          <small
            style={{
              color: "#999",
              fontSize: "12px",
              display: "block",
              marginTop: "-8px",
              marginBottom: "12px",
            }}
          >
            Use lowercase letters, numbers, and underscores only
          </small>
        )}
      </div>

      {/* TITLE */}
      <input
        name="title"
        placeholder="Title *"
        value={form.title}
        onChange={handleChange}
        required
      />

      {/* SUBTITLE */}
      <input
        name="subtitle"
        placeholder="Subtitle"
        value={form.subtitle}
        onChange={handleChange}
      />

      {/* DESCRIPTION */}
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={4}
      />

      {/* BUTTON TEXT */}
      <input
        name="buttonText"
        placeholder="Button Text"
        value={form.buttonText}
        onChange={handleChange}
      />

      {/* BUTTON LINK */}
      <input
        name="buttonLink"
        placeholder="Button Link"
        value={form.buttonLink}
        onChange={handleChange}
      />

      {/* IMAGE PREVIEW */}
      {preview && (
        <div style={{ position: "relative" }}>
          <img
            src={preview}
            alt="Banner Preview"
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
          <>{initialData ? "Update Banner" : "Create Banner"}</>
        )}
      </button>
    </form>
  );
};

export default BannerForm;