// components/common/pagination.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  showInfo?: boolean;
  siblingCount?: number;
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  className,
  showInfo = true,
  siblingCount = 1,
}: PaginationProps) {
  // Generate pagination range
  const paginationRange = () => {
    // Total pages to show (including first, last, current, and siblings)
    const totalPageNumbers = siblingCount * 2 + 5;

    // If total pages is less than the page numbers we want to show
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate left and right sibling indexes
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Determine if we need to show ellipsis
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // First page is always visible
    const firstPageIndex = 1;
    // Last page is always visible
    const lastPageIndex = totalPages;

    // If no left or right dots, show a continuous range
    if (!shouldShowLeftDots && !shouldShowRightDots) {
      return Array.from({ length: totalPageNumbers }, (_, i) => i + 1);
    }

    // If only left dots are missing
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = Array.from(
        { length: 3 + siblingCount * 2 },
        (_, i) => i + 1
      );
      return [...leftRange, "...", lastPageIndex];
    }

    // If only right dots are missing
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = Array.from(
        { length: 3 + siblingCount * 2 },
        (_, i) => totalPages - (2 + siblingCount * 2) + i + 1
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    // If both left and right dots are present
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    // Fallback
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const range = paginationRange();

  // Handle page navigation
  const goToPreviousPage = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const goToNextPage = () => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  const goToPage = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Page</span>
        </Button>

        {/* Page numbers */}
        {range.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-sm"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page)}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          );
        })}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Page</span>
        </Button>
      </div>

      {/* Page info */}
      {showInfo && (
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
}
