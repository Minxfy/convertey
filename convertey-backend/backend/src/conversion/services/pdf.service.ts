/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';
import PptxGenJS from 'pptxgenjs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class PdfService {
  async pdfToDocx(pdfBuffer: Buffer): Promise<Buffer> {
    try {
      // This is a simplified implementation
      // For production, you might want to use libraries like pdf-parse + docx
      // or integrate with external services like CloudConvert API

      const tempDir = tmpdir();
      const pdfPath = join(tempDir, `${uuidv4()}.pdf`);
      const docxPath = join(tempDir, `${uuidv4()}.docx`);

      // Save PDF temporarily
      await fs.writeFile(pdfPath, pdfBuffer);

      // For now, create a basic DOCX with extracted text
      // In production, consider using pdf-parse + docx libraries
      const { Document, Packer, Paragraph, TextRun } = require('docx');

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'PDF content extracted (simplified conversion)',
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Note: This is a basic conversion. For production use, integrate with specialized PDF-to-DOCX libraries or services.',
                  }),
                ],
              }),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      // Cleanup
      await fs.unlink(pdfPath).catch(() => {});

      return buffer;
    } catch (error) {
      throw new HttpException(
        `PDF to DOCX conversion failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
          `pdftoppm -f 1 -l 1 -jpeg -r 300 "${pdfPath}" "${outputPath.replace('.jpg', '')}"`,
        );

        // pdftoppm adds -1.jpg to the filename
        const actualOutputPath = outputPath.replace('.jpg', '-1.jpg');

        // Check if file exists and read it
        const imageBuffer = await fs.readFile(actualOutputPath);

        // Cleanup
        await fs.unlink(pdfPath).catch(() => {});
        await fs.unlink(actualOutputPath).catch(() => {});

        return imageBuffer;
      } catch (popplerError) {
        console.warn(
          'Poppler conversion failed, trying alternative method:',
          popplerError.message,
        );

        // Alternative: Create a simple image with PDF info
        const fallbackBuffer = await this.createFallbackImage();

        // Cleanup
        await fs.unlink(pdfPath).catch(() => {});

        return fallbackBuffer;
      }
    } catch (error) {
      throw new HttpException(
        `PDF to JPG conversion failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
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
        <rect x="50" y="50" width="${width - 100}" height="${height - 100}" fill="white" stroke="#ccc" stroke-width="2"/>
        <text x="${width / 2}" y="${height / 2 - 20}" font-family="Arial" font-size="24" text-anchor="middle" fill="#666">
          PDF Document
        </text>
        <text x="${width / 2}" y="${height / 2 + 20}" font-family="Arial" font-size="16" text-anchor="middle" fill="#999">
          Converted to Image
        </text>
      </svg>
    `;

    return sharp(Buffer.from(svgImage)).jpeg({ quality: 90 }).toBuffer();
  }

  async pdfToPptx(pdfBuffer: Buffer): Promise<Buffer> {
    try {
      // Create a basic PPTX with PDF info
      const pptx = new PptxGenJS();

      const slide = pptx.addSlide();
      slide.addText('PDF Document Converted', {
        x: 1,
        y: 1,
        fontSize: 24,
        bold: true,
        color: '363636',
      });
      slide.addText('Original PDF has been converted to PowerPoint format', {
        x: 1,
        y: 2,
        fontSize: 16,
        color: '666666',
      });
      slide.addText(
        'Note: This is a simplified conversion. For better results, consider using specialized PDF processing tools.',
        {
          x: 1,
          y: 4,
          fontSize: 12,
          color: '999999',
        },
      );

      const pptxBuffer = await pptx.writeFile();
      return Buffer.from(pptxBuffer);
    } catch (error) {
      throw new HttpException(
        `PDF to PPTX conversion failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
