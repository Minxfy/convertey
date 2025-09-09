import { IsString, IsNotEmpty, IsIn } from "class-validator";

export class ConversionDto {
  @IsString()
  @IsNotEmpty()
  fileData: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint",
  ])
  fileType: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(["pdf", "docx", "jpg", "jpeg", "png", "pptx"])
  format: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;
}

export interface ConversionResponse {
  convertedData: string;
  fileName: string;
  mimeType: string;
}
