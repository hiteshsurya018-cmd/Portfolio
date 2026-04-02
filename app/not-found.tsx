export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background:
          "radial-gradient(circle at top, rgba(75, 153, 255, 0.15), transparent 45%), #060913",
        color: "#f6fbff",
        textAlign: "center",
      }}
    >
      <div>
        <p
          style={{
            marginBottom: "0.75rem",
            fontSize: "0.85rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#8fdcff",
          }}
        >
          404
        </p>
        <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", marginBottom: "0.75rem" }}>Page not found</h1>
        <p style={{ maxWidth: "32rem", margin: "0 auto", color: "#b8c4e9", lineHeight: 1.6 }}>
          The page you requested does not exist. Return to the portfolio home page and continue browsing from there.
        </p>
      </div>
    </main>
  )
}
