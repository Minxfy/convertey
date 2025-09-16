import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as mammoth from "mammoth";
import PDFDocument from "pdfkit";

@Injectable()
export class DocxService {
  async docxToPdf(docxBuffer: Buffer): Promise<Buffer> {
    try {
      // Extract text and basic formatting from DOCX
      const result = await mammoth.extractRawText({ buffer: docxBuffer });
      const text = result.value;

      if (!text || text.trim().length === 0) {
        throw new Error("No text content found in DOCX file");
      }

      // Create PDF from extracted text
      const pdfBuffer = await this.createPdfFromText(text);
      return pdfBuffer;
    } catch (error: any) {
      throw new HttpException(
        `DOCX to PDF conversion failed: ${error as Error}.message`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async createPdfFromText(text: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      // Create PDF document
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      });

      // Collect PDF chunks
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Add content to PDF
      try {
        // Set font and basic styling
        doc.fontSize(12);
        doc.font("Helvetica");

        // Split text into paragraphs and add to PDF
        const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);

        if (paragraphs.length === 0) {
          doc.text("Document converted from DOCX", { align: "center" });
          doc.moveDown();
          doc.text("(No readable content found)", { align: "center" });
        } else {
          paragraphs.forEach((paragraph, index) => {
            if (index > 0) {
              doc.moveDown();
            }
            doc.text(paragraph.trim(), {
              width: doc.page.width - 100, // Account for margins
              align: "left",
            });
          });
        }

        doc.end();
      } catch (error: any) {
        reject(new Error(`PDF creation failed: ${error as Error}.message`));
      }
    });
  }
}
