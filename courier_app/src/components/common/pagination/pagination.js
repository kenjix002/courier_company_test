import { useState, useEffect } from "react";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    const [pagination, setPagination] = useState([]);

    useEffect(() => {
        const setPaginationView = (currentPage, totalPages) => {
            let pages = [];

            if (totalPages <= 3) {
                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
            } else if (currentPage <= 2) {
                pages = [1, 2, 3, "...", totalPages];
            } else if (currentPage >= totalPages - 1) {
                pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
            }

            setPagination(pages);
        };

        setPaginationView(currentPage, totalPages);
    }, [currentPage, totalPages]);

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                <li className="page-item">
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                    </button>
                </li>

                {pagination.map((n, index) => (
                    <li key={index}>
                        {n === "..." ? (
                            <button className="page-link" disabled>
                                {n}
                            </button>
                        ) : (
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(n)}
                                disabled={currentPage === n}
                            >
                                {n}
                            </button>
                        )}
                    </li>
                ))}

                <li className="page-item">
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
