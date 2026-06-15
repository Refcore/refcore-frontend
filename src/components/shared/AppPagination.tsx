'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type AppPaginationProps = {
  currentPage: number;
  totalPages: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onPageChange?: (page: number) => void;
};

type PaginationPageItem = number | 'ellipsis';

const getPageRange = (start: number, end: number) => {
  if (end < start) return [];

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationPageItem[] => {
  const siblingCount = 1;
  const boundaryCount = 1;

  const totalVisibleItems = boundaryCount * 2 + siblingCount * 2 + 3;

  if (totalPages <= totalVisibleItems) {
    return getPageRange(1, totalPages);
  }

  const leftSiblingIndex = Math.max(
    currentPage - siblingCount,
    boundaryCount + 2,
  );

  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPages - boundaryCount - 1,
  );

  const shouldShowLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
  const shouldShowRightEllipsis =
    rightSiblingIndex < totalPages - boundaryCount - 1;

  const firstPages = getPageRange(1, boundaryCount);
  const lastPages = getPageRange(totalPages - boundaryCount + 1, totalPages);

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = boundaryCount + siblingCount * 2 + 2;
    const leftPages = getPageRange(1, leftItemCount);

    return [...leftPages, 'ellipsis', ...lastPages];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = boundaryCount + siblingCount * 2 + 2;
    const rightPages = getPageRange(
      totalPages - rightItemCount + 1,
      totalPages,
    );

    return [...firstPages, 'ellipsis', ...rightPages];
  }

  const middlePages = getPageRange(leftSiblingIndex, rightSiblingIndex);

  return [...firstPages, 'ellipsis', ...middlePages, 'ellipsis', ...lastPages];
};

const AppPagination = ({
  currentPage,
  totalPages,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  onPageChange,
}: AppPaginationProps) => {
  const safeTotalPages = Math.max(totalPages, 0);
  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    safeTotalPages || 1,
  );

  const displayPage = safeTotalPages === 0 ? 0 : safeCurrentPage;

  const pages = getPaginationItems(safeCurrentPage, safeTotalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border/50 px-1 py-4 md:flex-row md:px-4">
    <p className="text-sm text-muted-foreground">
  Page {displayPage} of {safeTotalPages}
</p>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault();

                if (!canPreviousPage) return;
                onPreviousPage?.();
              }}
              aria-disabled={!canPreviousPage}
              className={
                !canPreviousPage ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>

          {pages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
                    ...
                  </span>
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === safeCurrentPage}
                  onClick={(event) => {
                    event.preventDefault();

                    if (page === safeCurrentPage) return;
                    onPageChange?.(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault();

                if (!canNextPage) return;
                onNextPage?.();
              }}
              aria-disabled={!canNextPage}
              className={!canNextPage ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AppPagination;
