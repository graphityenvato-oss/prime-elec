# Excel Reference: categories.xlsx

Source file:
- `Categories/categories.xlsx`

Sheet: `catalog`

Columns:
- `category_name`
- `brand_name`
- `subcategory_name`
- `page_url`
- `image_url`

Relationship:
- `category_name` = main category.
- `brand_name` groups within a main category.
- Each row is a subcategory under its `(category_name, brand_name)` pair.
- `page_url` and `image_url` belong to that subcategory.

Note:
- `image_url` values are relative paths like `images/Surge protection`.

Example: Emergency Lighting
- Main category: `Emergency Lighting`
- Brand: `Teknoware`
- Subcategories (8):
1. Central Battery Systems (image: `images/Central Battery Systems`)
2. Emergency exit lights for CBS (image: `images/Emergency exit lights for CBS`)
3. Emergency lights for open areas for CBS (image: `images/Emergency lights for open areas for CBS`)
4. Emergency lights for escape routes for CBS (image: `images/Emergency lights for escape routes for CBS`)
5. Emergency lights for points of emphasis for CBS (image: `images/Emergency lights for points of emphasis for CBS`)
6. Remote monitoring (image: `images/Remote monitoring`)
7. Self-Contained Systems and Luminaires (image: `images/Self-Contained Systems and Luminaires`)
8. Escap supercapacitor (image: `images/Escap supercapacitor`)

Example: Earthing and Lightning protection system
- Main category: `Earthing and Lightning protection system`
- Brands: `OBO Battermann`, `Indelec`
- Subcategories (6):
1. Surge protection (OBO Battermann, image: `images/Surge protection`)
2. External lightning protection-British standard (OBO Battermann, image: `images/External lightning protection-British standard`)
3. External lightning protection-French standard (Indelec, image: `images/External lightning protection-French standard`)
4. Equipotential bonding and earthing (OBO Battermann, image: `images/Equipotential bonding and earthing`)
5. Lightning Flash Counter (Indelec, image: `images/Lightning Flash Counter`)
6. Thunderstorm Warning System (Indelec, image: `images/Thunderstorm Warning System`)


Here’s how it’s typically done, end-to-end:

1. Admin UI

Add an upload section in your admin page with a file input (.xlsx only) and a submit button.
Show a preview table + a “dry run” summary (rows parsed, rows with errors).
2. API Route

Create a Next.js API route like route.ts.
It receives the uploaded file (multipart form), parses the Excel, validates columns and values, and returns a summary.
3. Excel Parsing

Use a server-side parser (e.g. xlsx or exceljs) to read the catalog sheet.
Convert rows into normalized records: category_name, brand_name, subcategory_name, page_url, image_url.
4. Validation

Ensure required columns exist.
Validate URLs, required fields, and duplicates.
Optionally normalize (trim, title case, slug).
5. Database Import

Insert or upsert into Supabase:
Table design usually separates categories, brands, and subcategories.
Or one flattened table if you want quick import.
Use upsert to avoid duplicates based on a unique constraint.
6. Results

Return a report: inserted/updated/skipped/failed, with row numbers and error messages.
If you want me to implement it, I need:

Your Supabase table schema (or let me inspect it).
Which admin page to place the uploader in.
Whether you want upsert or strict inserts.
If you need the file saved in Supabase Storage or just processed.
Once you confirm those, I can build it.