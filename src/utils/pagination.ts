// @ts-nocheck
export class Paginator {
  static async paginate(model, options = {}) {
    const {
      page = 1,
      limit = 10,
      filter = {},
      search = null,
      searchFields = [],
      sort = { createdAt: -1 },
      select = "",
      populate = null,
      lean = true,
    } = options;

    // ✅ ADD: Input validation
    const validPage = Math.max(1, parseInt(page));
    const validLimit = Math.min(Math.max(1, parseInt(limit)), 100); // Max 100
    const skip = (validPage - 1) * validLimit;

    // Build search query
    let query = { ...filter };

    if (search && searchFields.length > 0) {
      const searchQuery = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));

      query =
        Object.keys(filter).length > 0
          ? { $and: [filter, { $or: searchQuery }] }
          : { $or: searchQuery };
    }

    // ✅ ADD: Try-catch for better error handling
    try {
      let queryBuilder = model.find(query);

      if (select) queryBuilder = queryBuilder.select(select);
      if (populate) queryBuilder = queryBuilder.populate(populate);
      if (lean) queryBuilder = queryBuilder.lean();

      const [data, totalCount] = await Promise.all([
        queryBuilder.sort(sort).skip(skip).limit(validLimit),
        model.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / validLimit);

      // ✅ ADD: Warning if page exceeds total
      const currentPage =
        validPage > totalPages && totalPages > 0 ? totalPages : validPage;

      return {
        success: true,
        data,
        pagination: {
          currentPage,
          totalPages,
          totalCount,
          limit: validLimit,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
          nextPage: currentPage < totalPages ? currentPage + 1 : null,
          prevPage: currentPage > 1 ? currentPage - 1 : null,
        },
      };
    } catch (error) {
      // ✅ ADD: Structured error response
      throw {
        success: false,
        error: error.message,
        code: error.code || "PAGINATION_ERROR",
      };
    }
  }
}
