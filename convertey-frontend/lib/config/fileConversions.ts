// import type { ConversionFormat } from "@/types/FileConversionFormats";

export const CONVERSION_MAP: Record<string, string[]> = {
  // PDF conversions
  "application/pdf": ["docx", "jpg", "pptx"],

  // DOCX conversions
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    "pdf",
  ],

  // Image conversions (JPG/PNG → PDF)
  "image/jpeg": ["pdf"],
  "image/png": ["pdf"], // In case users upload PNG instead of JPG

  // PPTX conversions
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    "pdf",
  ],
  "application/vnd.ms-powerpoint": ["pdf"], // For older PPT files
};

export const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export const FORMAT_DESCRIPTIONS: Record<string, string> = {
  pdf: "Portable Document Format - Universal document format",
  docx: "Microsoft Word Document - Editable text document",
  jpg: "JPEG Image - Compressed image format",
  jpeg: "JPEG Image - Compressed image format",
  pptx: "PowerPoint Presentation - Editable presentation format",
};
