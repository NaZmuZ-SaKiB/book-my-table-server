export type TPaginationOptions = {
  page?: number;
  limit?: number;
};

type TPaginationResult = {
  page: number;
  limit: number;
  skip: number;
};

const calculatePagination = (
  options: TPaginationOptions
): TPaginationResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (page - 1) * limit;

  return { page, limit, skip };
};

export const paginationHelper = {
  calculatePagination,
};
