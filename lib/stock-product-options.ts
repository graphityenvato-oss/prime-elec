export type StockProductOptionRow = {
  brand: string;
  category: string;
  subcategory: string;
  details?: Record<string, string> | null;
};

const unique = (values: string[]) =>
  [...new Set(values.filter((value) => value.trim()))].sort((a, b) =>
    a.localeCompare(b),
  );

export function getStockProductOptions(
  rows: StockProductOptionRow[],
  brand = "",
  category = "",
) {
  const brandRows = rows.filter((row) => !brand || row.brand === brand);
  const categoryRows = brandRows.filter(
    (row) => !category || row.category === category,
  );
  return {
    brands: unique(rows.map((row) => row.brand)),
    categories: unique(brandRows.map((row) => row.category)),
    subcategories: unique(categoryRows.map((row) => row.subcategory)),
  };
}
