import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { RelatedProducts } from "@/components/related-products";
import { AddToQuoteButton } from "@/components/add-to-quote-button";
import { Button } from "@/components/ui/button";
import { resolveBrandLogo } from "@/lib/catalog-data-db";
import { getProductById as getFallbackProductById } from "@/lib/products";
import { products as fallbackProducts } from "@/lib/products";
import {
  getStockProductByIdDb,
  getStockProductsDb,
} from "@/lib/stock-products-db";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    notFound();
  }
  const product =
    (await getStockProductByIdDb(resolvedParams.id)) ??
    getFallbackProductById(resolvedParams.id);
  if (!product) {
    notFound();
  }
  const dbProducts = await getStockProductsDb();
  const products = dbProducts.length ? dbProducts : fallbackProducts;
  const brandLogo = resolveBrandLogo(product.brand);
  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .filter(
      (item) =>
        item.category === product.category &&
        item.subcategory === product.subcategory,
    )
    .slice(0, 3);

  return (
    <section className="py-10 sm:py-14">
      <Breadcrumb className="text-foreground/70">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/stock">Stock</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <ProductImageGallery images={product.images} title={product.title} />

        <div className="space-y-6 lg:min-h-[520px]">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-foreground/60">
              <span className="text-primary">{product.brand}</span>
              <span className="h-1 w-1 rounded-full bg-foreground/30" />
              <span>{product.category}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {product.title}
              </h1>
              <Image
                src={brandLogo}
                alt={`${product.brand} logo`}
                width={128}
                height={128}
                className="h-32 w-32 rounded-2xl object-contain"
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Part No.{" "}
              <span className="font-semibold text-primary">
                {product.codeNo ?? product.title}
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Code No.{" "}
              <span className="font-semibold text-primary">
                {product.partNumber}
              </span>
            </p>
            <p className="mt-4 text-base text-foreground/75">
              {product.longDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.specs.slice(0, 3).map((spec) => (
                <span
                  key={`${product.id}-tag-${spec.label}`}
                  className="rounded-full border border-border/60 dark:border-primary bg-muted/30 px-3 py-1 text-xs font-semibold text-foreground/80"
                >
                  {spec.label}: {spec.value}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background p-5">
            <div className="grid gap-2">
              <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                Request Price Quotation
              </Button>
              <AddToQuoteButton
                product={{
                  id: product.id,
                  name: product.title,
                  partNumber: product.partNumber,
                  codeNo: product.codeNo,
                  image: product.image,
                  brand: product.brand,
                  category: product.category,
                }}
                variant="outline"
                label="Add to Quote List"
                className="w-full rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-lg font-semibold text-primary">Product details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.specs.map((spec) => (
            <div
              key={`${product.id}-${spec.label}`}
              className="rounded-xl border border-border/60 bg-muted/20 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                {spec.label}
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </section>
  );
}
