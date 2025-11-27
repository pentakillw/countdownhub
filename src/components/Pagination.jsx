import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-10">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="p-2 rounded-full border border-border-default bg-white dark:bg-bg-muted text-text-default disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-muted dark:hover:bg-bg-subtle transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft size={20} />
      </button>

      <span className="text-sm font-medium text-text-subtle">
        Página <span className="text-text-default font-bold">{currentPage}</span> de <span className="text-text-default font-bold">{totalPages}</span>
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full border border-border-default bg-white dark:bg-bg-muted text-text-default disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-muted dark:hover:bg-bg-subtle transition-colors"
        aria-label="Página siguiente"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default Pagination;