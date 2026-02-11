# Excel Updates (Categories Import)

This note captures what changed in the new `Categories/categories.xlsx` and what the importer needs to support.

## New columns

- `main_image_url`
  - Holds the main image path for the **category** (`category_name`).
  - Same `main_image_url` repeats across multiple rows for the same category.
- `industries`
  - A `/`-separated list of industries where the category applies.
  - Example: `Data centers/Photovoltaics/Industry/...`
  - Repeats across multiple rows for the same category, since each row is a subcategory.

## Existing columns still required

- `category_name`
- `brand_name`
- `subcategory_name`
- `page_url`
- `image_url`

## Hierarchy reminder

- One `category_name` can appear with multiple `brand_name` values.
- Each `(category_name, brand_name)` pair can have multiple `subcategory_name` values.
- Each subcategory row has its own `page_url` and `image_url`.

## Implications for import logic

- Category-level data (`main_image_url`, `industries`) should be extracted **once per category**.
- The importer should:
  - Upsert categories with `main_image_url` and `industries` in addition to `name` and `slug`.
  - Continue to upsert brands and subcategories as before.
- If the database does not have fields for `main_image_url` or `industries`, schema changes are required before import can store them.

## Existing import flow (current code)

1. Admin uploads Excel (`catalog` sheet).
2. Client validates required columns and field formats.
3. Optional: upload ZIP images, then apply public URLs to `image_url`.
4. Client POSTs rows to `/api/admin/categories/import`.
5. API validates rows.
6. API upserts:
   - `categories` by name (name, slug)
   - `brands` by name (name, slug)
   - `subcategories` by `(category_id, brand_id, slug)` with `page_url`, `image_url`

## New import flow (needed for the updated Excel)

1. Admin uploads Excel (`catalog` sheet).
2. Client validates required columns plus new fields (optional on client, required if you need to store them).
3. Optional: upload ZIP images, then apply public URLs to `image_url` and `main_image_url`.
4. Client POSTs rows to `/api/admin/categories/import`.
5. API validates rows, including `main_image_url` and `industries`.
6. API upserts:
   - `categories` by name (name, slug, `main_image_url`, `industries`)
   - `brands` by name
   - `subcategories` by `(category_id, brand_id, slug)` with `page_url`, `image_url`

## Differences

- New columns are present in Excel: `main_image_url`, `industries`.
- Category-level fields must be stored on the category record, not per subcategory row.
- Importer must deduplicate `main_image_url` and `industries` per category.
- Optional ZIP mapping should handle both subcategory images and category main images.
- Both main images and subcategory images are stored in the same uploaded ZIP.
