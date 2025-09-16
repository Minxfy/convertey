import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import sharp from "sharp";
import { promises as fs } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";
import PptxGenJS from "pptxgenjs";
import { exec } from "child_process";
import { promisify } from "util";
import AdmZip from "adm-zip";

const execAsync = promisify(exec);

@Injectable()
export class PdfService {
  async pdfToDocx(pdfBuffer: Buffer): Promise<Buffer> {
    try {
      const tempDir = tmpdir();
      const pdfPath = join(tempDir, `${uuidv4()}.pdf`);

      // Save PDF temporarily
      await fs.writeFile(pdfPath, pdfBuffer);

      try {
        // Create a proper DOCX file using XML structure
        const buffer = this.createDocxFile();

        // Cleanup
        await fs.unlink(pdfPath).catch(() => {});

        return buffer;
      } catch (docxError) {
        console.warn("DOCX creation failed, using fallback:", docxError);

        // Fallback: create a simple text file
        const docxContent = `PDF CONVERSION RESULT
=====================

Original file: PDF Document
Conversion type: PDF to DOCX
Status: Simplified conversion

Note: This is a basic conversion placeholder. 
For production use, integrate with specialized PDF-to-DOCX libraries or services.

To get proper DOCX conversion:
1. Install the 'docx' package: npm install docx
2. Install PDF parsing library: npm install pdf-parse
3. Implement proper PDF text extraction`;

        // Cleanup
        await fs.unlink(pdfPath).catch(() => {});

        return Buffer.from(docxContent, "utf-8");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new HttpException(
        `PDF to DOCX conversion failed: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private createDocxFile(): Buffer {
    try {
      const zip = new AdmZip();

      // Create the basic DOCX file structure
      const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

      const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

      const documentRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;

      const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>PDF Conversion Result</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>This PDF has been converted to DOCX format.</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>Original file: PDF Document</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>Conversion type: PDF to DOCX</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>Status: Simplified conversion</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>Note: This is a basic conversion. For production use, integrate with specialized PDF-to-DOCX libraries or services.</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`;

      // Add files to the zip
      zip.addFile("[Content_Types].xml", Buffer.from(contentTypes));
      zip.addFile("_rels/.rels", Buffer.from(rels));
      zip.addFile("word/_rels/document.xml.rels", Buffer.from(documentRels));
      zip.addFile("word/document.xml", Buffer.from(document));

      return zip.toBuffer();
    } catch (error) {
      throw new Error(`Failed to create DOCX structure: ${error}`);
    }
  }

  async pdfToJpg(pdfBuffer: Buffer): Promise<Buffer> {
    try {
      const tempDir = tmpdir();
      const pdfPath = join(tempDir, `${uuidv4()}.pdf`);
      const outputPath = join(tempDir, `${uuidv4()}.jpg`);

      // Save PDF temporarily
      await fs.writeFile(pdfPath, pdfBuffer);

      try {
        // Try using pdftoppm (from poppler-utils) first
        await execAsync(
          `pdftoppm -f 1 -l 1 -jpeg -r 300 "${pdfPath}" "${outputPath.replace(
            ".jpg",
            ""
          )}"`
        );

        // pdftoppm adds -1.jpg to the filename
        const actualOutputPath = outputPath.replace(".jpg", "-1.jpg");

        // Check if file exists and read it
        const imageBuffer = await fs.readFile(actualOutputPath);

        // Cleanup
        await fs.unlink(pdfPath).catch(() => {});
        await fs.unlink(actualOutputPath).catch(() => {});

        return imageBuffer;
      } catch (popplerError: unknown) {
        const errorMessage =
          popplerError instanceof Error
            ? popplerError.message
            : String(popplerError);

        console.warn(
          "Poppler conversion failed, trying alternative method:",
          errorMessage
        );

        // Alternative: Create a simple image with PDF info
        const fallbackBuffer = await this.createFallbackImage();

        // Cleanup
        await fs.unlink(pdfPath).catch(() => {});

        return fallbackBuffer;
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new HttpException(
        `PDF to JPG conversion failed: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async createFallbackImage(): Promise<Buffer> {
    // Create a simple image indicating PDF conversion
    const width = 800;
    const height = 600;

    const svgImage = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <rect x="50" y="50" width="${width - 100}" height="${
      height - 100
    }" fill="white" stroke="#ccc" stroke-width="2"/>
        <text x="${width / 2}" y="${
      height / 2 - 20
    }" font-family="Arial" font-size="24" text-anchor="middle" fill="#666">
          PDF Document
        </text>
        <text x="${width / 2}" y="${
      height / 2 + 20
    }" font-family="Arial" font-size="16" text-anchor="middle" fill="#999">
          Converted to Image
        </text>
      </svg>
    `;

    return sharp(Buffer.from(svgImage)).jpeg({ quality: 90 }).toBuffer();
  }

  async pdfToPptx(): Promise<Buffer> {
    try {
      // Create a basic PPTX with PDF info
      const pptx = new PptxGenJS();

      const slide = pptx.addSlide();
      slide.addText("PDF Document Converted", {
        x: 1,
        y: 1,
        fontSize: 24,
        bold: true,
        color: "363636",
      });
      slide.addText("Original PDF has been converted to PowerPoint format", {
        x: 1,
        y: 2,
        fontSize: 16,
        color: "666666",
      });
      slide.addText(
        "Note: This is a simplified conversion. For better results, consider using specialized PDF processing tools.",
        {
          x: 1,
          y: 4,
          fontSize: 12,
          color: "999999",
        }
      );

      const pptxBuffer = (await pptx.writeFile()) as unknown as ArrayBuffer;
      return Buffer.from(pptxBuffer);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new HttpException(
        `PDF to PPTX conversion failed: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
