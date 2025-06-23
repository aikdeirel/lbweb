export interface PaginationParams {
    currentPage: number;
    totalItems: number;
    pageSize: number;
}

export interface PaginationResult {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export function validatePageParam(pageParam: string | null): number {
    if (pageParam === null) return 1;
    
    const parsed = parseInt(pageParam);
    if (isNaN(parsed) || parsed < 1) {
        throw new Error('Invalid page parameter');
    }
    
    return parsed;
}

export function calculatePagination(params: PaginationParams): PaginationResult {
    const { currentPage, totalItems, pageSize } = params;
    
    const totalPages = Math.ceil(totalItems / pageSize);
    const validPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
    const startIndex = (validPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    
    return {
        currentPage: validPage,
        totalPages,
        startIndex,
        endIndex,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1
    };
}

export function shouldRedirectToFirstPage(currentPage: number, totalPages: number): boolean {
    return currentPage > totalPages && totalPages > 0;
}