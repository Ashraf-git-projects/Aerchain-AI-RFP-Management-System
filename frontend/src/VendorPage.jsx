import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./api";

function VendorPage() {
  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE_URL}/vendors`);
      setVendors(res.data || []);
    } catch (err) {
      setError("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Name and email are required");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      await axios.post(`${API_BASE_URL}/vendors`, {
        name,
        email,
        category
      });
      setName("");
      setEmail("");
      setCategory("");
      fetchVendors();
    } catch (err) {
      setError("Failed to create vendor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="page-container">
    <div className="page-card">
      <h1>Vendors</h1>
      <p style={{ color: "#555" }}>Manage vendor list and add new suppliers.</p>

      {error && (
        <div
          style={{
            margin: "12px 0",
            padding: "10px",
            borderRadius: "4px",
            backgroundColor: "#ffe6e6",
            color: "#b00020",
            fontSize: "14px"
          }}
        >
          {error}
        </div>
      )}

      {/* ADD VENDOR FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
          border: "1px solid #ddd",
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: "#f9fafb"
        }}
      >
        <h3 style={{ margin: 0 }}>Add Vendor</h3>

        <input
          type="text"
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <input
          type="email"
          placeholder="Vendor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <input
          type="text"
          placeholder="Category (e.g. hardware, furniture)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: "4px",
            padding: "10px",
            backgroundColor: submitting ? "#999" : "#2563eb",
            borderRadius: "6px",
            border: "none",
            color: "#fff",
            cursor: submitting ? "not-allowed" : "pointer"
          }}
        >
          {submitting ? "Saving..." : "Add Vendor"}
        </button>
      </form>

      {/* VENDOR LIST TABLE */}
      <div className="table-wrapper">
        <div
          className="rfp-row"
          style={{
            padding: "10px 12px",
            borderBottom: "1px solid #ddd",
            backgroundColor: "#f0f0f0",
            fontWeight: 600
          }}
        >
          <span>Name</span>
          <span>Email</span>
          <span>Category</span>
          <span>Created</span>
        </div>

        {loading ? (
          <div style={{ padding: "12px" }}>Loading...</div>
        ) : vendors.length === 0 ? (
          <div style={{ padding: "12px" }}>No Vendors found</div>
        ) : (
          vendors.map((v) => (
            <div
              key={v._id}
              className="rfp-row"
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid #eee",
                color: "#111827"
              }}
            >
              <span>{v.name}</span>
              <span>{v.email}</span>
              <span>{v.category}</span>
              <span>
                {v.createdAt
                  ? new Date(v.createdAt).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
}

export default VendorPage;
