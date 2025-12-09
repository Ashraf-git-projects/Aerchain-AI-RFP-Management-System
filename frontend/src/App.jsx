import { useState } from "react";
import VendorPage from "./VendorPage";
import RFPPage from "./RFPPage";

function App() {
  const [activePage, setActivePage] = useState("rfps");

  return (
    <div>
      <header
        style={{
          backgroundColor: "#111827",
          color: "#f9fafb",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ fontWeight: 600 }}>Aerchain – AI RFP Management</div>
        <nav style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setActivePage("rfps")}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              backgroundColor:
                activePage === "rfps" ? "#f9fafb" : "transparent",
              color: activePage === "rfps" ? "#111827" : "#e5e7eb"
            }}
          >
            RFPs
          </button>
          <button
            onClick={() => setActivePage("vendors")}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              backgroundColor:
                activePage === "vendors" ? "#f9fafb" : "transparent",
              color: activePage === "vendors" ? "#111827" : "#e5e7eb"
            }}
          >
            Vendors
          </button>
        </nav>
      </header>

      {activePage === "rfps" ? <RFPPage /> : <VendorPage />}
    </div>
  );
}

export default App;
