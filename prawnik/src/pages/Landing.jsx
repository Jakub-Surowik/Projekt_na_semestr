import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <>
      <div style={{
        textAlign: "center",
        padding: "120px 20px",
        background: "linear-gradient(to bottom, white, #f9f9f9)"
      }}>
        <h1 style={{ fontSize: "48px" }}>
          Nowoczesny rynek usług prawnych
        </h1>
        <p style={{ fontSize: "18px", color: "#666" }}>
          Bezpiecznie. Transparentnie. Profesjonalnie.
        </p>

        <Link to="/intake">
          <button className="btn-gold" style={{ marginTop: 30 }}>
            Zleć sprawę
          </button>
        </Link>
      </div>
    </>
  );
}
