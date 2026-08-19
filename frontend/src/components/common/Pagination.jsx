import React from 'react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  totalItems
}) => {
  if (totalPages < 1 && totalItems === 0) return null;
console.log(totalPages,"this  count of  total pages")
  const canPrev = hasPreviousPage !== undefined ? hasPreviousPage : currentPage > 1;
  console.log(canPrev);
  const canNext = hasNextPage !== undefined ? hasNextPage : currentPage < totalPages;
  console.log(canNext)


  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
console.log(startPage)
console.log(endPage)
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();
console.log(pages)
  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Page {currentPage} of {totalPages || 1} {totalItems !== undefined ? `(${totalItems} total)` : ''}
      </div>

      <div className="pagination-buttons">
        <button
          type="button"
          className="pagination-btn"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {pages[0] > 1 && (
          <>
            <button
              type="button"
              className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {pages[0] > 2 && <span className="pagination-ellipsis">&hellip;</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="pagination-ellipsis">&hellip;</span>}
            <button
              type="button"
              className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          className="pagination-btn"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
