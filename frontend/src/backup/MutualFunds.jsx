
import { useEffect, useState } from "react";
import { getMutualFunds } from "../api";

function MutualFunds() {
  const [funds, setFunds] = useState([]);
  const [category, setCategory] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFunds = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMutualFunds(category, riskLevel, search);
      setFunds(data.funds || data.results || []);
    } catch (err) {
      setError(
        err.message ||
          "Could not load mutual funds. Please check that the backend is running."
      );
      setFunds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadFunds();
  };

  return (
    <div className="mutual-funds-page">
      <h1>Explore Mutual Funds</h1>

      <p>
        Explore mutual fund data and compare funds by category and risk level.
      </p>

      <p>
        <strong>Educational information only.</strong> This page does not
        provide personalized financial advice.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search fund name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Equity">Equity</option>
          <option value="Debt">Debt</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Other">Other</option>
          <option value="Solution Oriented">Solution Oriented</option>
        </select>

        <select
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value)}
        >
          <option value="">All Risk Levels</option>
          <option value="1">Risk Level 1</option>
          <option value="2">Risk Level 2</option>
          <option value="3">Risk Level 3</option>
          <option value="4">Risk Level 4</option>
          <option value="5">Risk Level 5</option>
          <option value="6">Risk Level 6</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search Funds"}
        </button>
      </form>

      {loading && <p>Loading mutual funds...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="funds-grid">
          {funds.length === 0 ? (
            <p>No funds found. Try different filters.</p>
          ) : (
            funds.map((fund, index) => (
              <div
                className="fund-card"
                key={`${fund.scheme_name}-${index}`}
              >
                <h3>{fund.scheme_name || "Unnamed Fund"}</h3>

                <p>Category: {fund.category ?? "Not available"}</p>
                <p>Risk Level: {fund.risk_level ?? "Not available"}</p>
                <p>Rating: {fund.rating ?? "Not available"}</p>

                <p>
                  Minimum SIP:{" "}
                  {fund.min_sip == null
                    ? "Not available"
                    : `₹${fund.min_sip}`}
                </p>

                <p>
                  Expense Ratio:{" "}
                  {fund.expense_ratio == null
                    ? "Not available"
                    : `${fund.expense_ratio}%`}
                </p>

                <p>
                  3-Year Returns:{" "}
                  {fund.returns_3yr == null
                    ? "Not available"
                    : `${fund.returns_3yr}%`}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MutualFunds;
