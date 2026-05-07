// Pagination bar: shows Prev, page numbers, Next
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis logic for large page counts
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Prev
      </button>

      {getPages().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} style={{ color: "var(--color-text-muted)", padding: "0 0.25rem" }}>…</span>
        ) : (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
