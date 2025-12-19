import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProductForm from "./ProductForm";

const API = "https://re-eat-backend.onrender.com";

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

interface Product {
  _id: string;
  name: string;
  description?: string;
  category: Category;
  image?: string;
  price: number;
  discount: number;
  finalPrice: number;
  isActive: boolean;
  isVeg: boolean;
  isSpicy: boolean;
  isBestSeller: boolean;
  ingredients: string[];
  preparationTime: number;
  calories: number;
  createdAt: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const token = localStorage.getItem("adminToken");

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
    }
  }, [token]);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setToggleLoading(id);
      const res = await axios.patch(
        `${API}/api/menu/${id}/status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      fetchProducts();
    } catch (err: any) {
      console.error("Error toggling status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setToggleLoading(null);
    }
  };

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const res = await axios.delete(`${API}/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      fetchProducts();
    } catch (err: any) {
      console.error("Error deleting product:", err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  /* ================= HANDLE EDIT ================= */
  const handleEdit = (product: Product) => {
    setEditing(product);
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

  /* ================= FILTER PRODUCTS ================= */
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      filterCategory === "All" || product.category?._id === filterCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  return (
    <div className="admin-page">
      {/* ===== HEADER ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h2 className="admin-title" style={{ margin: 0, marginBottom: "0.5rem" }}>
            Product Management
          </h2>
          <div style={{ color: "#666", fontSize: "14px" }}>
            Total: <strong>{products.length}</strong> product
            {products.length !== 1 ? "s" : ""}
            {filterCategory !== "All" && (
              <>
                {" "}
                • Showing: <strong>{filteredProducts.length}</strong>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "16px",
          marginBottom: "2rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Category Filter */}
          <div style={{ flex: "1", minWidth: "200px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#666",
                marginBottom: "0.5rem",
              }}
            >
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #FFE0D0",
                borderRadius: "10px",
                fontSize: "14px",
                background: "#FFF9F0",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All">All Categories</option>
              {categories
                .filter((cat) => cat.isActive)
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Search */}
          <div style={{ flex: "1", minWidth: "250px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#666",
                marginBottom: "0.5rem",
              }}
            >
              Search Products
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #FFE0D0",
                borderRadius: "10px",
                fontSize: "14px",
                background: "#FFF9F0",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* ===== FLOATING ADD BUTTON ===== */}
      <button
        className="floating-add-btn"
        onClick={handleAdd}
        title="Add New Product"
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
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "900px" }}
          >
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

            <ProductForm
              initialData={editing}
              categories={categories}
              onSuccess={() => {
                closeModal();
                fetchProducts();
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
            Loading products...
          </p>
        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {!loading && filteredProducts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🍔</div>
          <h3>
            {searchQuery || filterCategory !== "All"
              ? "No Products Found"
              : "No Products Yet"}
          </h3>
          <p>
            {searchQuery || filterCategory !== "All"
              ? "Try adjusting your filters"
              : "Create your first product to get started"}
          </p>
          {!searchQuery && filterCategory === "All" && (
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
              Create Product
            </button>
          )}
        </div>
      )}

      {/* ===== PRODUCTS GRID ===== */}
    {/* ===== PRODUCTS TABLE-GRID ===== */}
{!loading && filteredProducts.length > 0 && (
  <div className="product-table-grid">
    {filteredProducts.map((product) => (
      <div className="product-table-card" key={product._id}>
        {/* Image */}
        {product.image ? (
          <img
            src={`${API}${product.image}`}
            alt={product.name}
            className="product-table-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";
            }}
          />
        ) : (
          <div className="product-table-image-placeholder">
            🍽️
          </div>
        )}

        {/* Info */}
        <div className="product-table-info">
          <div className="product-table-header">
            <h3 className="product-table-title">{product.name}</h3>
            <span className="product-table-category">
              {product.category?.icon} {product.category?.name}
            </span>
          </div>

          {product.description && (
            <p className="product-table-description">
              {product.description}
            </p>
          )}

          <div className="product-table-meta">
            <div className="product-table-price">
              <span className="product-table-final-price">
                ${product.finalPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="product-table-original-price">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="product-table-discount">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="product-table-tags">
              {product.isVeg && (
                <span className="product-table-tag veg">🌱 VEG</span>
              )}
              {product.isSpicy && (
                <span className="product-table-tag spicy">🌶️ SPICY</span>
              )}
              {product.isBestSeller && (
                <span className="product-table-tag bestseller">⭐ BEST</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="product-table-actions">
          <span
            className={`product-table-status ${
              product.isActive ? "active" : "inactive"
            }`}
          >
            {product.isActive ? "● ACTIVE" : "○ INACTIVE"}
          </span>

          <div className="product-table-buttons">
            <button
              className="product-table-btn edit"
              onClick={() => handleEdit(product)}
              title="Edit Product"
            >
              ✏️ Edit
            </button>
            <button
              className="product-table-btn toggle"
              onClick={() => toggleStatus(product._id, product.isActive)}
              disabled={toggleLoading === product._id}
              title={product.isActive ? "Deactivate" : "Activate"}
            >
              {toggleLoading === product._id
                ? "⏳"
                : product.isActive
                ? "🔴"
                : "🟢"}
            </button>
          </div>

          <button
            className="product-table-btn delete"
            onClick={() => deleteProduct(product._id, product.name)}
            title="Delete Product"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    ))}
  </div>
)}
    </div>
  );
};

export default Products;