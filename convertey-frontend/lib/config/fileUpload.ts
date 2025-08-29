// Create or update: convertey-frontend/lib/config/fileUpload.ts

export const FORMAT_GROUPS = {
  document: ["pdf", "docx"],
  image: ["jpg", "jpeg", "png"],
  presentation: ["pptx", "ppt"],
} as const;

// Supported file types for the conversion demo
export const SUPPORTED_FORMATS = [
  // PDF files
  "pdf",
  // Word documents  
  "docx",
  // Images
  "jpg", "jpeg", "png",
  // PowerPoint
  "pptx", "ppt"
] as const;