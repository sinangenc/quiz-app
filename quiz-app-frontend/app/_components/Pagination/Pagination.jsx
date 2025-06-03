import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [];

    const start = Math.max(currentPage - 3, 0);
    const end = Math.min(start + 7, totalPages);

    for (let i = start; i < end; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center mt-6 space-x-2 text-sm">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
                Prev
            </button>
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded border ${
                        currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    {page + 1}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}