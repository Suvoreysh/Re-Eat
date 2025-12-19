import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import CategoryForm from "./CategoryForm";

const API = "https://re-eat-backend.onrender.com";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon: string;
  isActive: boolean;
  order: number;
  menuCount?: number;
  createdAt: string;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  const token = localStorage.getItem("adminToken");

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      toast.error(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setToggleLoading(id);
      const res = await axios.patch(
        `${API}/api/categories/${id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      fetchCategories();
    } catch (err: any) {
      console.error("Error toggling status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setToggleLoading(null);
    }
  };

  /* ================= DELETE CATEGORY ================= */
  const deleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const res = await axios.delete(`${API}/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message);
      fetchCategories();
    } catch (err: any) {
      console.error("Error deleting category:", err);
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  /* ================= HANDLE EDIT ================= */
  const handleEdit = (category: Category) => {
    setEditing(category);
    setIsModalOpen(true);
  };

  /* ================= HANDLE ADD ================= */
  const handleAdd = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  /* ================= CLOSE MODAL ================= */
  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="admin-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2 className="admin-title" style={{ margin: 0 }}>
          Category Management
        </h2>
        <div style={{ color: "#666", fontSize: "14px" }}>
          Total: <strong>{categories.length}</strong> categor
          {categories.length !== 1 ? "ies" : "y"}
        </div>
      </div>

      {/* ===== FLOATING ADD BUTTON ===== */}
      <button
        className="floating-add-btn"
        onClick={handleAdd}
        title="Add New Category"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* ===== MODAL ===== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} title="Close">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <CategoryForm
              initialData={editing}
              onSuccess={() => {
                closeModal();
                fetchCategories();
              }}
            />
          </div>
        </div>
      )}

      {/* ===== LOADING STATE ===== */}
      {loading && (
        <div className="text-center" style={{ padding: "3rem" }}>
          <div className="spinner" style={{ margin: "0 auto" }}></div>
          <p style={{ marginTop: "1rem", color: "#666", fontSize: "14px" }}>
            Loading categories...
          </p>
        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {!loading && categories.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <h3>No Categories Yet</h3>
          <p>Create your first category to organize your menu</p>
          <button
            onClick={handleAdd}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #FF6B35, #ff8a50)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(255, 107, 53, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Create Category
          </button>
        </div>
      )}

      {/* ===== CATEGORIES GRID ===== */}
      {!loading && categories.length > 0 && (
        <div className="banner-grid">
          {categories.map((category) => (
            <div className="banner-card" key={category._id}>
              {/* Image */}
              {category.image ? (
                <img
                  src={`${API}${category.image}`}
                  alt={category.name}
                  className="banner-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    background: "linear-gradient(135deg, #FFE0D0, #FFF3E0)",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "64px",
                    border: "2px solid #FFF3E0",
                  }}
                >
                  {category.icon}
                </div>
              )}

              {/* Title */}
              <h3 style={{ marginBottom: "0.25rem" }}>{category.name}</h3>

              {/* Description */}
              {category.description && (
                <p
                  style={{
                    marginBottom: "0.5rem",
                    color: "#666",
                    fontSize: "13px",
                  }}
                >
                  {category.description}
                </p>
              )}

              {/* Slug */}
              <div
                style={{
                  fontSize: "11px",
                  color: "#999",
                  marginBottom: "0.5rem",
                  padding: "4px 8px",
                  background: "#FFF9F0",
                  borderRadius: "6px",
                  display: "inline-block",
                }}
              >
                <strong>Slug:</strong> {category.slug}
              </div>

              {/* Menu Count */}
              <div
                style={{
                  fontSize: "12px",
                  color: "#999",
                  marginBottom: "0.5rem",
                  padding: "4px 8px",
                  background: "#e8f5e9",
                  borderRadius: "6px",
                  display: "inline-block",
                }}
              >
                <strong>{category.menuCount || 0}</strong> menu item
                {category.menuCount !== 1 ? "s" : ""}
              </div>

              {/* Status Badge */}
              <span
                className={`status ${category.isActive ? "active" : "inactive"}`}
              >
                {category.isActive ? "● ACTIVE" : "○ INACTIVE"}
              </span>

              {/* Actions */}
              <div className="banner-actions">
                <button
                  onClick={() => handleEdit(category)}
                  title="Edit Category"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => toggleStatus(category._id, category.isActive)}
                  disabled={toggleLoading === category._id}
                  title={category.isActive ? "Deactivate" : "Activate"}
                  style={{
                    opacity: toggleLoading === category._id ? 0.6 : 1,
                    cursor:
                      toggleLoading === category._id
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {toggleLoading === category._id ? (
                    <>⏳ Loading...</>
                  ) : category.isActive ? (
                    <>🔴 Deactivate</>
                  ) : (
                    <>🟢 Activate</>
                  )}
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteCategory(category._id, category.name)}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "8px",
                  background: "#ffebee",
                  color: "#c62828",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ffcdd2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffebee";
                }}
                title="Delete Category"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;