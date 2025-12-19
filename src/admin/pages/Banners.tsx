import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BannerForm from "./BannerForm";

const API = "https://re-eat-backend.onrender.com";

interface Banner {
  _id: string;
  key: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  createdAt: string;
}

const Banners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  const token = localStorage.getItem("adminToken");

  /* ================= FETCH BANNERS ================= */
  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/banners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBanners(res.data);
    } catch (err: any) {
      console.error("Error fetching banners:", err);
      toast.error(err.response?.data?.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setToggleLoading(id);
      const res = await axios.patch(
        `${API}/api/banners/${id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(
        res.data.message || 
        `Banner ${currentStatus ? "deactivated" : "activated"} successfully`
      );
      fetchBanners();
    } catch (err: any) {
      console.error("Error toggling status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setToggleLoading(null);
    }
  };

  /* ================= DELETE BANNER ================= */
  const deleteBanner = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await axios.delete(`${API}/api/banners/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Banner deleted successfully");
      fetchBanners();
    } catch (err: any) {
      console.error("Error deleting banner:", err);
      toast.error(err.response?.data?.message || "Failed to delete banner");
    }
  };

  /* ================= HANDLE EDIT ================= */
  const handleEdit = (banner: Banner) => {
    setEditing(banner);
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
    fetchBanners();
  }, [fetchBanners]);

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
          Banners Management
        </h2>
        <div style={{ color: "#666", fontSize: "14px" }}>
          Total: <strong>{banners.length}</strong> banner
          {banners.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ===== FLOATING ADD BUTTON ===== */}
      <button
        className="floating-add-btn"
        onClick={handleAdd}
        title="Add New Banner"
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

            <BannerForm
              initialData={editing}
              onSuccess={() => {
                closeModal();
                fetchBanners();
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
            Loading banners...
          </p>
        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {!loading && banners.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🎨</div>
          <h3>No Banners Yet</h3>
          <p>Create your first banner by clicking the + button</p>
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
            Create Banner
          </button>
        </div>
      )}

      {/* ===== BANNERS GRID ===== */}
      {!loading && banners.length > 0 && (
        <div className="banner-grid">
          {banners.map((banner) => (
            <div className="banner-card" key={banner._id}>
              {/* Image with Fallback */}
              {banner.image ? (
                <img
                  src={`${API}${banner.image}`}
                  alt={banner.title}
                  className="banner-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=200&fit=crop";
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
                    color: "#FF6B35",
                    fontSize: "48px",
                    border: "2px solid #FFF3E0",
                  }}
                >
                  🖼️
                </div>
              )}

              {/* Title */}
              <h3 style={{ marginBottom: "0.25rem" }}>{banner.title}</h3>

              {/* Subtitle */}
              {banner.subtitle && (
                <p style={{ marginBottom: "0.5rem", color: "#666" }}>
                  {banner.subtitle}
                </p>
              )}

              {/* Key */}
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
                <strong>Key:</strong> {banner.key}
              </div>

              {/* Status Badge */}
              <span
                className={`status ${banner.isActive ? "active" : "inactive"}`}
              >
                {banner.isActive ? "● ACTIVE" : "○ INACTIVE"}
              </span>

              {/* Actions */}
              <div className="banner-actions">
                <button onClick={() => handleEdit(banner)} title="Edit Banner">
                  ✏️ Edit
                </button>
                <button
                  onClick={() => toggleStatus(banner._id, banner.isActive)}
                  disabled={toggleLoading === banner._id}
                  title={banner.isActive ? "Deactivate" : "Activate"}
                  style={{
                    opacity: toggleLoading === banner._id ? 0.6 : 1,
                    cursor:
                      toggleLoading === banner._id
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {toggleLoading === banner._id ? (
                    <>⏳ Loading...</>
                  ) : banner.isActive ? (
                    <>🔴 Deactivate</>
                  ) : (
                    <>🟢 Activate</>
                  )}
                </button>
              </div>

              {/* Optional Delete Button */}
              <button
                onClick={() => deleteBanner(banner._id, banner.title)}
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
                title="Delete Banner"
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

export default Banners;