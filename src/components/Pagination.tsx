// Framework imports:
import React, { useMemo } from "react";
import Image from "next/image";
// Local imports:
import Right_arrow from "../../public/icons/right_arrow.svg";
import Left_arrow from "../../public/icons/left_arrow.svg";
import { PaginationProps } from "@/utils/interface";

const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  totalPages,
  onPageChange,
  pagesPerGroup = 2,
}) => {
  if (totalPages === 0) return null;
  let startPage = Math.floor(pageIndex / pagesPerGroup) * pagesPerGroup;
  let endPage = Math.min(startPage + pagesPerGroup, totalPages);

  // Shift window back if near the end and window is smaller than pagesPerGroup
  // if (endPage - startPage < pagesPerGroup && startPage > 0) {
  //   startPage = Math.max(0, totalPages - pagesPerGroup);
  //   endPage = totalPages;
  // }

  // Check if previous group exists
  const hasPrevGroup = startPage > 0;
  // Check if next group exists
  const hasNextGroup = endPage < totalPages;

  // Memoize page links for current window
  const paginationLinks = useMemo(() => {
    const links = [];
    for (let index = startPage; index < endPage; index++) {
      links.push(
        <li key={index} className="inline-block mx-1">
          <button
            className={`border cursor-pointer px-3 py-1 rounded ${
              index === pageIndex
                ? "text-peach border-peach font-medium text-sm"
                : "text-lightTeal border-lightTeal font-medium text-sm"
            }`}
            onClick={() => onPageChange(index)}
            aria-current={index === pageIndex ? "page" : undefined}
          >
            {index + 1}
          </button>
        </li>,
      );
    }
    return links;
  }, [startPage, endPage, pageIndex, onPageChange]);

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-end text-lightTeal"
    >
      <ul className="inline-flex items-center space-x-1">
        {/* ++++++++++++++ For First Page: ++++++++++++++ */}

        <li>
          <button
            className="border border-lightTeal cursor-pointer px-3 py-1 rounded flex"
            onClick={() => onPageChange(0)}
            disabled={pageIndex === 0}
            aria-label="Go to first page"
          >
            <Image src={Left_arrow} alt="" width={5} className="py-2" />
            <Image src={Left_arrow} alt="" width={5} className="py-2" />
          </button>
        </li>

        {/* ++++++++++++++ For Previous Page: ++++++++++++++ */}

        <li>
          <button
            className="border border-lightTeal cursor-pointer px-3 py-1 rounded flex"
            onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
            disabled={pageIndex === 0}
            aria-label="Go to previous page"
          >
            <Image src={Left_arrow} alt="" width={5} className="py-2" />
          </button>
        </li>

        {/* First page number (if not in current window) */}
        {startPage > 0 && (
          <>
            <li className="inline-block mx-1">
              <button
                className={`border  cursor-pointer px-3 py-1 rounded ${
                  pageIndex === 0 ? "text-white  font-bold" : "text-lightTeal"
                }`}
                onClick={() => onPageChange(0)}
                aria-current={pageIndex === 0 ? "page" : undefined}
              >
                1
              </button>
            </li>

            {/* ++++++++++++++ Ellipsis For Previous Group: ++++++++++++++ */}

            <li>
              <button
                className={`border cursor-pointer rounded-lg px-3 py-1 ${
                  hasPrevGroup
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
                onClick={() => {
                  if (hasPrevGroup) onPageChange(startPage - 1);
                }}
                aria-label="Go to previous page group"
                disabled={!hasPrevGroup}
                tabIndex={hasPrevGroup ? 0 : -1}
              >
                &hellip;
              </button>
            </li>
          </>
        )}

        {/* ++++++++++++++ Page Number Buttons For Current Window: ++++++++++++++ */}

        {paginationLinks}

        {/* ++++++++++++++ Ellipsis For Next Group: ++++++++++++++ */}

        {hasNextGroup && (
          <li>
            <button
              className={`border cursor-pointer rounded-lg px-3 py-1 ${
                hasNextGroup
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => {
                if (hasNextGroup) onPageChange(endPage);
              }}
              aria-label="Go to next page group"
              disabled={!hasNextGroup}
              tabIndex={hasNextGroup ? 0 : -1}
            >
              &hellip;
            </button>
          </li>
        )}

        {/* Last page number (if not in current window) */}
        {endPage < totalPages && (
          <li className="inline-block mx-1">
            <button
              className={`border cursor-pointer px-3 py-1 rounded ${
                pageIndex === totalPages - 1
                  ? "text-white bg-transparent font-bold"
                  : "text-lightTeal"
              }`}
              onClick={() => onPageChange(totalPages - 1)}
              aria-current={pageIndex === totalPages - 1 ? "page" : undefined}
            >
              {totalPages}
            </button>
          </li>
        )}

        {/* ++++++++++++++ For Next Page: ++++++++++++++ */}

        <li>
          <button
            className="border border-lightTeal cursor-pointer px-3 py-1 rounded"
            onClick={() =>
              onPageChange(Math.min(totalPages - 1, pageIndex + 1))
            }
            disabled={pageIndex === totalPages - 1}
            aria-label="Go to next page"
          >
            <Image src={Right_arrow} alt="" width={5} className="py-2" />
          </button>
        </li>

        {/* ++++++++++++++ For Last Page: ++++++++++++++ */}

        <li>
          <button
            className="border border-lightTeal cursor-pointer px-3 py-1 rounded flex"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={pageIndex === totalPages - 1}
            aria-label="Go to last page"
          >
            <Image src={Right_arrow} alt="" width={5} className="py-2" />
            <Image src={Right_arrow} alt="" width={5} className="py-2" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
