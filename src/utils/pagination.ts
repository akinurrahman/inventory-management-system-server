interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Creates a standardized pagination object
 * @param options - Pagination options containing page, limit, and total
 * @returns Standardized pagination object
 */
export const createPagination = (
  options: PaginationOptions
): PaginationResult => {
  const { page, limit, total } = options;
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Calculates skip value for database queries
 * @param page - Current page number (1-indexed)
 * @param limit - Number of items per page
 * @returns Number of items to skip
 */
export const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const getPaginationParams = (query: Record<string, string | string[]>) => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = calculateSkip(page, limit);
  return { page, limit, skip };
};
