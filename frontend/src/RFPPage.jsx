import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./api";

function RFPPage() {
  const [rfps, setRfps] = useState([]);
  const [title, setTitle] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [budget, setBudget] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [warranty, setWarranty] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [editingRfp, setEditingRfp] = useState(null);
  const [editBudget, setEditBudget] = useState("");
  const [editRequirementsText, setEditRequirementsText] = useState("");

  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [selectedRfpForSend, setSelectedRfpForSend] = useState(null);
  const [selectedVendorIds, setSelectedVendorIds] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendMessage, setSendMessage] = useState("");

  const fetchRfps = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE_URL}/rfps`);
      setRfps(res.data || []);
    } catch (err) {
      setError("Failed to load RFPs");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      setVendorsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/vendors`);
      setVendors(res.data || []);
    } catch (err) {
      console.error("Failed to load vendors", err);
    } finally {
      setVendorsLoading(false);
    }
  };

  useEffect(() => {
    fetchRfps();
    fetchVendors();
  }, []);

  const toggleVendorSelection = (id) => {
    setSelectedVendorIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSendRfp = async () => {
    if (!selectedRfpForSend || selectedVendorIds.length === 0) {
      setError("Select at least one vendor");
      return;
    }
    try {
      setSendLoading(true);
      setError("");
      setSendMessage("");

      const res = await axios.post(
        `${API_BASE_URL}/rfps/${selectedRfpForSend}/send`,
        { vendorIds: selectedVendorIds }
      );

      setSendMessage(res.data?.message || "RFP sent");
    } catch {
      setError("Failed to send RFP to vendors");
    } finally {
      setSendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Title is required");
      return;
    }

    const requirements = requirementsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      setError("");
      await axios.post(`${API_BASE_URL}/rfps`, {
        title,
        requirements,
        budget: budget ? Number(budget) : undefined,
        deliveryTime,
        paymentTerms,
        warranty
      });

      setTitle("");
      setRequirementsText("");
      setBudget("");
      setDeliveryTime("");
      setPaymentTerms("");
      setWarranty("");
      fetchRfps();
    } catch {
      setError("Failed to create RFP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (rfp) => {
    setEditingRfp(rfp);
    setEditBudget(rfp.budget || "");
    setEditRequirementsText(
      Array.isArray(rfp.requirements) ? rfp.requirements.join("\n") : ""
    );
    setSendMessage("");
    setError("");
  };

  const handleUpdateRfp = async () => {
    if (!editingRfp) return;

    const requirements = editRequirementsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      setError("");

      await axios.put(`${API_BASE_URL}/rfps/${editingRfp._id}`, {
        requirements,
        budget: editBudget ? Number(editBudget) : null
      });

      setEditingRfp(null);
      setEditBudget("");
      setEditRequirementsText("");
      fetchRfps();
    } catch (err) {
      setError("Failed to update RFP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRfp = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this RFP?");
    if (!confirmed) return;

    try {
      setError("");
      await axios.delete(`${API_BASE_URL}/rfps/${id}`);
      if (editingRfp && editingRfp._id === id) {
        setEditingRfp(null);
        setEditBudget("");
        setEditRequirementsText("");
      }
      if (selectedRfpForSend === id) {
        setSelectedRfpForSend(null);
        setSelectedVendorIds([]);
        setSendMessage("");
      }
      fetchRfps();
    } catch (err) {
      setError("Failed to delete RFP");
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h1>RFPs</h1>
        <p style={{ color: "#555" }}>
          Create procurement RFPs and view existing ones.
        </p>

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

        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#eef2ff",
            border: "1px solid #c7d2fe"
          }}
        >
          <h3>Create RFP using AI</h3>
          <textarea
            placeholder="Describe what you want to procure..."
            value={aiDescription}
            onChange={(e) => setAiDescription(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              marginBottom: "8px"
            }}
          />
          <button
            onClick={async () => {
              if (!aiDescription.trim()) return;
              try {
                setAiLoading(true);
                setError("");
                await axios.post(`${API_BASE_URL}/rfps/from-text`, {
                  description: aiDescription
                });
                setAiDescription("");
                fetchRfps();
              } catch {
                setError("Failed to generate RFP with AI");
              } finally {
                setAiLoading(false);
              }
            }}
            disabled={aiLoading}
            style={{
              padding: "10px 16px",
              backgroundColor: aiLoading ? "#999" : "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: aiLoading ? "not-allowed" : "pointer"
            }}
          >
            {aiLoading ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rfp-form-grid">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <h3>Create RFP manually</h3>
            <input
              type="text"
              placeholder="RFP title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
            <textarea
              placeholder="Requirements (one per line)"
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              rows={5}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
            
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <input
              type="number"
              placeholder="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
            <input
              type="text"
              placeholder="Delivery time"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
            <input
              type="text"
              placeholder="Payment terms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
            <input
              type="text"
              placeholder="Warranty"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: "6px",
                padding: "10px",
                backgroundColor: submitting ? "#999" : "#2563eb",
                color: "#fff",
                borderRadius: "4px",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer"
              }}
            >
              {submitting ? "Saving..." : "Create RFP"}
            </button>
          </div>
        </form>
        <h2 style={{
              paddingTop:"10px",
              color:"rgba(0, 101, 18, 1)",
              textAlign:"center",
              fontFamily:"monospace"
            }}>Created RFPs</h2>
        <div className="table-wrapper">
          <div
            style={{
              padding: "5px 12px",
              borderBottom: "1px solid #ddd",
              backgroundColor: "#f0f0f0",
              fontWeight: 600
            }}
            className="rfp-row"
          >
            <span>Title</span>
            <span>Requirements</span>
            <span>Budget</span>
            <span>Created</span>
            <span>Actions</span>
          </div>

          {loading ? (
  <div style={{ padding: "12px" }}>Loading...</div>
) : rfps.length === 0 ? (
  <div style={{ padding: "12px" }}>No RFPs found</div>
) : (
  rfps.map((r) => (
    <div
      key={r._id}
      className="rfp-row"
      style={{
        padding: "10px 12px",
        borderBottom: "1px solid #eee",
        color: "#111827"
      }}
    >
      {editingRfp && editingRfp._id === r._id ? (
        <>
          <span style={{ fontWeight: 600 }}>{r.title}</span>

          <textarea
            value={editRequirementsText}
            onChange={(e) => setEditRequirementsText(e.target.value)}
            rows={3}
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "13px",
              width: "100%"
            }}
          />

          <input
            type="number"
            value={editBudget}
            onChange={(e) => setEditBudget(e.target.value)}
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%"
            }}
          />

          <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
            <button
              onClick={handleUpdateRfp}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#16a34a",
                color: "#fff",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditingRfp(null);
                setEditBudget("");
                setEditRequirementsText("");
              }}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <span>{r.title}</span>
          <span>{r.requirements?.join(", ")}</span>
          <span>{r.budget ? `$${r.budget}` : "-"}</span>
          <span>{new Date(r.createdAt).toLocaleDateString()}</span>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button
              onClick={() => handleEditClick(r)}
              style={{
                padding: "6px 8px",
                borderRadius: "4px",
                backgroundColor: "#f59e0b",
                color: "#fff",
                fontSize: "12px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Edit
            </button>

            <button
              onClick={() => handleDeleteRfp(r._id)}
              style={{
                padding: "6px 8px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#dc2626",
                color: "#fff",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>

            <button
              onClick={() => {
                setSelectedRfpForSend(r._id);
                setSelectedVendorIds([]);
                setSendMessage("");
                setError("");
              }}
              style={{
                padding: "6px 8px",
                borderRadius: "4px",
                backgroundColor:
                  selectedRfpForSend === r._id ? "#111827" : "#2563eb",
                color: "#fff",
                border: "none",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              {selectedRfpForSend === r._id ? "Selected" : "Send RFP"}
            </button>
          </div>
        </>
      )}
    </div>
  ))
)}

        </div>

        {editingRfp && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "8px",
              // border: "1px solid "#ddd",
              // background: "#fff7ed"
            }}
          >
            <h3 style={{ marginTop: 0 }}>Edit RFP</h3>
            <p style={{ margin: "4px 0 8px", fontSize: "14px" }}>
              Title: <strong>{editingRfp.title}</strong>
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr",
                gap: "12px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                <label style={{ fontSize: "13px" }}>
                  Requirements (one per line)
                </label>
                <textarea
                  rows={4}
                  value={editRequirementsText}
                  onChange={(e) => setEditRequirementsText(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    // border: "1px solid "#ccc",
                    // fontSize: "14px"
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                <label style={{ fontSize: "13px" }}>Budget</label>
                <input
                  type="number"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  placeholder="Budget"
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    // border: "1px solid "#ccc",
                    // fontSize: "14px"
                  }}
                />

                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    gap: "8px"
                  }}
                >
                  <button
                    type="button"
                    onClick={handleUpdateRfp}
                    disabled={submitting}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: submitting ? "#999" : "#16a34a",
                      color: "#fff",
                      fontSize: "14px",
                      cursor: submitting ? "not-allowed" : "pointer"
                    }}
                  >
                    {submitting ? "Updating..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRfp(null);
                      setEditBudget("");
                      setEditRequirementsText("");
                    }}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      backgroundColor: "#fff",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedRfpForSend && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#f9fafb"
            }}
          >
            <h3>Send selected RFP to vendors</h3>

            {vendorsLoading ? (
              <p>Loading vendors...</p>
            ) : vendors.length === 0 ? (
              <p>No vendors found</p>
            ) : (
              <>
                <div
                  style={{
                    maxHeight: "150px",
                    overflowY: "auto",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    marginBottom: "10px"
                  }}
                >
                  {vendors.map((v) => (
                    <label
                      key={v._id}
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "6px"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedVendorIds.includes(v._id)}
                        onChange={() => toggleVendorSelection(v._id)}
                      />
                      <span>
                        {v.name}{" "}
                        <small style={{ color: "#666" }}>({v.email})</small>
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleSendRfp}
                  disabled={sendLoading || selectedVendorIds.length === 0}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    backgroundColor: sendLoading ? "#aaa" : "#16a34a",
                    color: "#fff",
                    cursor: sendLoading ? "not-allowed" : "pointer",
                    border: "none"
                  }}
                >
                  {sendLoading ? "Sending..." : "Send RFP"}
                </button>

                {sendMessage && (
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#15803d",
                      fontSize: "14px"
                    }}
                  >
                    {sendMessage}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RFPPage;
