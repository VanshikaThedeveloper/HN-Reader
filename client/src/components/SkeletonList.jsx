// Animated skeleton placeholder cards shown while stories are loading
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-block" style={{ width: 28, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 4 }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <div className="skeleton-block" style={{ height: 16, width: "80%" }} />
      <div className="skeleton-block" style={{ height: 13, width: "45%" }} />
    </div>
    <div className="skeleton-block" style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }} />
  </div>
);

const SkeletonList = ({ count = 10 }) => (
  <div className="stories-list">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonList;
