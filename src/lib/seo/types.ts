/**
 * Internal SEO pipeline types.
 *
 * These were originally defined inline in seo.ts. Extracted to break
 * circular dependencies between seo.ts and its sub-modules
 * (seo/jsonld.ts, seo/breadcrumbs.ts) which need to reference
 * `PageContext` and friends.
 *
 * Types here reference the public types (BreadcrumbItem, FaqEntry,
 * ProcurementField, ProductSpec) via type-only imports from seo.ts.
 * Type-only imports are erased at compile time so no runtime cycle.
 *
 * Extracted during the P2 split (2026-05-08).
 */
import type {
  BreadcrumbItem,
  FaqEntry,
  ProcurementField,
  ProductSpec,
} from "../seo";
import type { PageKind } from "./utils";

export interface ArticleMeta {
  authorName: string;
  authorUrl: string;
  authorTitle?: string;
  authorExpertise?: string[];
  reviewedBy?: string;
  reviewedByTitle?: string;
  lastReviewedDate?: string;
  publishedAt: string;
  modifiedAt: string;
  publishedLabel: string;
  modifiedLabel: string;
}

export interface ImageSelection {
  url: string;
  alt: string;
}

export interface ImageCandidate extends ImageSelection {
  score: number;
}

export interface PageContext {
  canonicalUrl: string;
  contentTitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageGallery: ImageSelection[];
  kind: PageKind;
  breadcrumbItems: BreadcrumbItem[];
  itemList: BreadcrumbItem[];
  faqEntries: FaqEntry[];
  procurementFields: ProcurementField[];
  collectionSummary: string[];
  collectionGuidanceFields: ProcurementField[];
  collectionRelatedPages: BreadcrumbItem[];
  collectionSourceLinks: BreadcrumbItem[];
  coreSummary: string[];
  coreGuidanceFields: ProcurementField[];
  coreRelatedPages: BreadcrumbItem[];
  coreSourceLinks: BreadcrumbItem[];
  articleSummary: string[];
  articleGuidanceFields: ProcurementField[];
  articleRelatedPages: BreadcrumbItem[];
  articleSourceLinks: BreadcrumbItem[];
  productRelatedPages: BreadcrumbItem[];
  productSourceLinks: BreadcrumbItem[];
  articleMeta: ArticleMeta | null;
  productSpecs: ProductSpec[];
}
