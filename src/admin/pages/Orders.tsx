import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, Filter, Download } from "lucide-react";

const API = "http://localhost:5000";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("adminToken");

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/orders/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      toast.error(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ================= UPDATE STATUS ================= */
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await axios.patch(
        `${API}/api/orders/admin/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Order status updated successfully");
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(response.data.order);
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  /* ================= VIEW ORDER DETAILS ================= */
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  /* ================= FILTER ORDERS ================= */
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  /* ================= GET STATUS BADGE ================= */
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "#fff3e0",
      confirmed: "#e3f2fd",
      preparing: "#f3e5f5",
      out_for_delivery: "#e1f5fe",
      delivered: "#e8f5e9",
      cancelled: "#ffebee",
    };

    const textColors: Record<string, string> = {
      pending: "#e65100",
      confirmed: "#1565c0",
      preparing: "#6a1b9a",
      out_for_delivery: "#0277bd",
      delivered: "#2e7d32",
      cancelled: "#c62828",
    };

    return {
      bg: statusColors[status] || "#f5f5f5",
      color: textColors[status] || "#666",
      label: status.replace("_", " ").toUpperCase(),
    };
  };

  /* ================= EXPORT TO CSV ================= */
  const exportToCSV = () => {
    const csvData = filteredOrders.map((order) => ({
      OrderNumber: order.orderNumber,
      Date: new Date(order.createdAt).toLocaleDateString(),
      Customer: order.user?.name || order.shippingInfo.fullName,
      Items: order.items.length,
      Total: `$${order.total.toFixed(2)}`,
      Status: order.status,
      Payment: order.paymentMethod,
    }));

    const headers = Object.keys(csvData[0]);
    const csv = [
      headers.join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Orders exported successfully");
  };

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
            Order Management
          </h2>
          <div style={{ color: "#666", fontSize: "14px" }}>
            Total: <strong>{orders.length}</strong> orders
            {filterStatus !== "all" && (
              <>
                {" "}
                • Showing: <strong>{filteredOrders.length}</strong>
              </>
            )}
          </div>
        </div>
        <button
          onClick={exportToCSV}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "14px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1b5e20";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#2e7d32";
          }}
        >
          <Download size={18} />
          Export CSV
        </button>
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
          {/* Status Filter */}
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
              <Filter size={16} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
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
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
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
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Order #, Customer name..."
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

      {/* ===== LOADING STATE ===== */}
      {loading && (
        <div className="text-center" style={{ padding: "3rem" }}>
          <div className="spinner" style={{ margin: "0 auto" }}></div>
          <p style={{ marginTop: "1rem", color: "#666", fontSize: "14px" }}>
            Loading orders...
          </p>
        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {!loading && filteredOrders.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>
            {searchQuery || filterStatus !== "all"
              ? "No Orders Found"
              : "No Orders Yet"}
          </h3>
          <p>
            {searchQuery || filterStatus !== "all"
              ? "Try adjusting your filters"
              : "Orders will appear here once customers place them"}
          </p>
        </div>
      )}

      {/* ===== ORDERS TABLE ===== */}
      {!loading && filteredOrders.length > 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(135deg, #FF6B35, #ff8a50)",
                    color: "white",
                  }}
                >
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Order #
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Date
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Customer
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Items
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Total
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Payment
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Status
                  </th>
                  <th style={{ padding: "1rem", textAlign: "center", fontWeight: 600 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  return (
                    <tr
                      key={order._id}
                      style={{
                        borderBottom: "1px solid #FFE0D0",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#FFF9F0";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      <td style={{ padding: "1rem", fontWeight: 600, color: "#FF6B35" }}>
                        {order.orderNumber}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "14px", color: "#666" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                        <br />
                        <span style={{ fontSize: "12px", color: "#999" }}>
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "14px" }}>
                        <div style={{ fontWeight: 600, color: "#1a1a1a" }}>
                          {order.user?.name || order.shippingInfo.fullName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#999" }}>
                          {order.shippingInfo.phone}
                        </div>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "14px", color: "#666" }}>
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "#2e7d32",
                        }}
                      >
                        ${order.total.toFixed(2)}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "14px" }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            background: "#e3f2fd",
                            color: "#1565c0",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {order.paymentMethod.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            padding: "6px 12px",
                            background: statusBadge.bg,
                            color: statusBadge.color,
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 700,
                            display: "inline-block",
                          }}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <button
                          onClick={() => viewOrderDetails(order)}
                          style={{
                            padding: "8px 16px",
                            background: "#FFF3E0",
                            color: "#FF6B35",
                            border: "2px solid #FFE0D0",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#FFE0D0";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#FFF3E0";
                          }}
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== ORDER DETAILS MODAL ===== */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "800px", maxHeight: "90vh", overflow: "auto" }}
          >
            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
              title="Close"
            >
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

            <h2 style={{ marginBottom: "1.5rem", color: "#FF6B35" }}>
              Order Details - {selectedOrder.orderNumber}
            </h2>

            {/* Customer Info */}
            <div
              style={{
                padding: "1.5rem",
                background: "#FFF9F0",
                borderRadius: "12px",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ marginBottom: "1rem", fontSize: "16px" }}>Customer Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <strong>Name:</strong> {selectedOrder.shippingInfo.fullName}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedOrder.shippingInfo.phone}
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <strong>Address:</strong> {selectedOrder.shippingInfo.address},{" "}
                  {selectedOrder.shippingInfo.city}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ marginBottom: "1rem", fontSize: "16px" }}>Order Items</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#FFF3E0" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left" }}>Item</th>
                    <th style={{ padding: "0.75rem", textAlign: "center" }}>Qty</th>
                    <th style={{ padding: "0.75rem", textAlign: "right" }}>Price</th>
                    <th style={{ padding: "0.75rem", textAlign: "right" }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #FFE0D0" }}>
                      <td style={{ padding: "0.75rem" }}>{item.name}</td>
                      <td style={{ padding: "0.75rem", textAlign: "center" }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: "0.75rem", textAlign: "right" }}>
                        ${item.price.toFixed(2)}
                      </td>
                      <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: 600 }}>
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  textAlign: "right",
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#FFF3E0",
                  borderRadius: "8px",
                }}
              >
                <strong style={{ fontSize: "18px", color: "#FF6B35" }}>
                  Total: ${selectedOrder.total.toFixed(2)}
                </strong>
              </div>
            </div>

            {/* Update Status */}
            <div>
              <h3 style={{ marginBottom: "1rem", fontSize: "16px" }}>Update Order Status</h3>
              <select
                value={selectedOrder.status}
                onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #FFE0D0",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  background: "white",
                  cursor: "pointer",
                  color: "#FF6B35",
                }}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;