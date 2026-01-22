"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminSidebar } from "@/components/admin/sidebar";
import { PrimeCard } from "@/components/ui/prime-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@/components/blocks/editor-x/editor";
import { DatePickerTime } from "@/components/admin/date-picker-time";
import { ImageUploader } from "@/components/ui/image-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionsMenu } from "@/components/admin/actions-menu";
import { supabaseClient } from "@/lib/supabase/client";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  author: string;
  date: string | null;
  readTimeMinutes: number | null;
};

export default function AdminBlogsPage() {
  const [checked, setChecked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const [editorStateJson, setEditorStateJson] = useState("");
  const [status, setStatus] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<Array<File | null>>([
    null,
    null,
    null,
  ]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [author, setAuthor] = useState("");
  const [readTimeMinutes, setReadTimeMinutes] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined,
  );
  const [scheduledTime, setScheduledTime] = useState("10:30:00");
  const [search, setSearch] = useState("");
  const [blogRows, setBlogRows] = useState<BlogRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const loadBlogs = async () => {
    const { data } = await supabaseClient.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      return;
    }

    const response = await fetch("/api/admin/blogs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return;
    }
    const result = (await response.json().catch(() => ({ blogs: [] }))) as {
      blogs?: Array<{
        id: string;
        title: string;
        slug: string;
        category: string;
        status: string;
        author: string;
        published_at?: string | null;
        created_at?: string | null;
        read_time_minutes?: number | null;
      }>;
    };
    const mapped = (result.blogs ?? []).map((blog) => {
      const dateValue = blog.published_at ?? blog.created_at ?? null;
      return {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        status: blog.status,
        author: blog.author,
        date: dateValue ? new Date(dateValue).toLocaleDateString() : null,
        readTimeMinutes: blog.read_time_minutes ?? null,
      } satisfies BlogRow;
    });
    setBlogRows(mapped);
  };

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      const { data } = await supabaseClient.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        router.replace("/ns-admin");
        return;
      }

      const response = await fetch("/api/admin/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.isAdmin) {
        router.replace("/ns-admin");
        return;
      }

      if (isMounted) {
        setChecked(true);
        loadBlogs();
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return blogRows;
    }
    return blogRows.filter(
      (row) =>
        row.title.toLowerCase().includes(query) ||
        row.category.toLowerCase().includes(query) ||
        row.author.toLowerCase().includes(query),
    );
  }, [blogRows, search]);

  if (!checked) {
    return null;
  }

  const uploadFile = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`/api/uploads?folder=${folder}`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Upload failed.");
    }
    return response.json() as Promise<{ path: string; publicUrl: string }>;
  };

  const handleSave = async (
    saveStatus: "draft" | "published" | "scheduled",
  ) => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required.");
      return;
    }
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }
    if (!author.trim()) {
      toast.error("Author is required.");
      return;
    }
    if (!readTimeMinutes.trim()) {
      toast.error("Read time is required.");
      return;
    }
    if (!featuredImage) {
      toast.error("Featured image is required.");
      return;
    }
    if (saveStatus === "scheduled" && !scheduledDate) {
      toast.error("Please select a scheduled date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await supabaseClient.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        toast.error("Session expired. Please sign in again.");
        return;
      }

      const featuredUpload = await uploadFile(featuredImage, "blogs/featured");
      const galleryFiles = galleryImages.filter((file): file is File =>
        Boolean(file),
      );
      const galleryUploads = await Promise.all(
        galleryFiles.map((file) => uploadFile(file, "blogs/gallery")),
      );

      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const scheduledAt =
        saveStatus === "scheduled" && scheduledDate
          ? new Date(
              `${scheduledDate.toISOString().split("T")[0]}T${scheduledTime}`,
            ).toISOString()
          : null;

      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          category: category.trim(),
          tags,
          featuredImageUrl: featuredUpload.publicUrl,
          featuredImagePath: featuredUpload.path,
          galleryImages: galleryUploads.map((item) => ({
            url: item.publicUrl,
            path: item.path,
          })),
          author: author.trim(),
          readTimeMinutes: Number(readTimeMinutes),
          status: saveStatus,
          scheduledAt,
          bodyJson: editorStateJson ? JSON.parse(editorStateJson) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save blog.");
      }

      toast.success("Blog saved.");
      setShowForm(false);
      setTitle("");
      setSlug("");
      setSlugDirty(false);
      setCategory("");
      setTagsInput("");
      setAuthor("");
      setReadTimeMinutes("");
      setStatus("");
      setFeaturedImage(null);
      setGalleryImages([null, null, null]);
      setEditorStateJson("");
      setScheduledDate(undefined);
      setScheduledTime("10:30:00");
      await loadBlogs();
    } catch {
      toast.error("Could not save blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground lg:px-10">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
        <AdminSidebar />

        <div className="space-y-6">
          <section>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Blogs
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Blog management
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage posts, publish dates, and featured content.
            </p>
          </section>

          <PrimeCard className="p-6">
            {showForm ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Add new blog</h2>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={() => setShowForm(false)}
                  >
                    Back to list
                  </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Title
                    </label>
                    <Input
                      placeholder="Enter blog title"
                      value={title}
                      onChange={(event) => {
                        const nextTitle = event.target.value;
                        setTitle(nextTitle);
                        if (!slugDirty) {
                          setSlug(slugify(nextTitle));
                        }
                        if (!nextTitle) {
                          setSlug("");
                          setSlugDirty(false);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Slug
                    </label>
                    <Input
                      placeholder="Auto-generated slug (editable)"
                      value={slug}
                      onChange={(event) => {
                        const nextSlug = event.target.value;
                        setSlug(nextSlug);
                        setSlugDirty(nextSlug !== slugify(title));
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Category
                    </label>
                    <Input
                      placeholder="Power Systems, Automation, Design..."
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Tags
                    </label>
                    <Input
                      placeholder="Comma-separated tags"
                      value={tagsInput}
                      onChange={(event) => setTagsInput(event.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Author
                    </label>
                    <Input
                      placeholder="Author name"
                      value={author}
                      onChange={(event) => setAuthor(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Read time (minutes)
                    </label>
                    <Input
                      placeholder="e.g. 6"
                      value={readTimeMinutes}
                      onChange={(event) =>
                        setReadTimeMinutes(event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Featured image upload
                    </label>
                    <ImageUploader
                      onFileChange={setFeaturedImage}
                      maxSizeKb={200}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Gallery images (3)
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {galleryImages.map((_, index) => (
                        <ImageUploader
                          key={`gallery-${index}`}
                          onFileChange={(file) => {
                            setGalleryImages((prev) => {
                              const next = [...prev];
                              next[index] = file;
                              return next;
                            });
                          }}
                          maxSizeKb={200}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Status
                    </label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Publish date
                    </label>
                    {status === "scheduled" ? (
                      <DatePickerTime
                        date={scheduledDate}
                        time={scheduledTime}
                        onDateChange={setScheduledDate}
                        onTimeChange={setScheduledTime}
                      />
                    ) : (
                      <Input placeholder="Auto" disabled />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Body content (rich text)
                  </label>
                  <Editor
                    onSerializedChange={(state) =>
                      setEditorStateJson(JSON.stringify(state))
                    }
                  />
                  <input type="hidden" value={editorStateJson} readOnly />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    disabled={isSubmitting}
                    onClick={() => handleSave("draft")}
                  >
                    Save as draft
                  </Button>
                  <Button
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isSubmitting}
                    onClick={() =>
                      handleSave(
                        status === "scheduled" ? "scheduled" : "published",
                      )
                    }
                  >
                    Save blog
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Input
                    placeholder="Search blogs"
                    className="w-full sm:max-w-xs"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <Button
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setShowForm(true)}
                  >
                    Add blog
                  </Button>
                </div>

                <div className="mt-6">
                  {filteredRows.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Read time</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-semibold">
                              {row.title}
                            </TableCell>
                            <TableCell>{row.category}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.author}</TableCell>
                            <TableCell>{row.date ?? "-"}</TableCell>
                            <TableCell>
                              {row.readTimeMinutes
                                ? `${row.readTimeMinutes} min`
                                : "-"}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center">
                                <ActionsMenu
                                  onView={() =>
                                    window.open(`/blog/${row.slug}`, "_blank")
                                  }
                                  onDelete={async () => {
                                    const { data } =
                                      await supabaseClient.auth.getSession();
                                    const token = data.session?.access_token;
                                    if (!token) {
                                      toast.error("Session expired.");
                                      return;
                                    }
                                    const response = await fetch(
                                      `/api/admin/blogs/${row.id}`,
                                      {
                                        method: "DELETE",
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      },
                                    );
                                    if (!response.ok) {
                                      toast.error("Failed to delete blog.");
                                      return;
                                    }
                                    toast.success("Blog deleted.");
                                    loadBlogs();
                                  }}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/10 px-6 py-10 text-center">
                      <p className="text-base font-semibold text-foreground">
                        No blogs yet.
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Start by creating your first post to share updates,
                        insights, and product news.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </PrimeCard>
        </div>
      </div>
    </main>
  );
}
