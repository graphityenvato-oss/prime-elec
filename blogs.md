Blog admin form fields

- Title
- Slug (auto-generated from title, editable)
- Category
- Tags
- Featured image upload
- Publish date (auto)
- Author
- Read time (minutes)
- Body content (rich text)
- Status
- Gallery images (for the 3-image grid)

Admin blogs page layout

- Table listing blogs
- Search input on the left above the table
- "Add blog" button on the right above the table

Supabase integration plan

Database (table: blogs)

- id (uuid, primary key)
- title (text)
- slug (text, unique)
- category (text)
- tags (text[])
- featured_image_url (text)
- featured_image_path (text)
- gallery_images (jsonb array of { url, path })
- author (text)
- read_time_minutes (int)
- status (text: draft | published | scheduled)
- published_at (timestamp)
- scheduled_at (timestamp, nullable)
- body_json (jsonb) (Lexical editor state)
- created_at, updated_at (timestamps)

Storage

- Use existing /api/uploads endpoint and uploads bucket
- featured image -> folder blogs/featured
- gallery images -> folder blogs/gallery

Admin API

- GET /api/admin/blogs (list)
- POST /api/admin/blogs (create)
- PATCH /api/admin/blogs/:id (edit)
- DELETE /api/admin/blogs/:id (delete)

Admin UI

- Save blog: upload images -> POST blog payload
- Save as draft: status=draft
- Table list fetches GET /api/admin/blogs

Blog detail

- Replace lib/blogs.ts with Supabase fetch (supabaseServer)
- Render body_json using Lexical renderer (or HTML conversion)
