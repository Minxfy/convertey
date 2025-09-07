/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import AdmZip from 'adm-zip';

@Injectable()
export class PptxService {
  async pptxToPdf(pptxBuffer: Buffer): Promise<Buffer> {
    try {
      // Extract text content from PPTX
      const textContent = this.extractTextFromPptx(pptxBuffer);

      // Create PDF from extracted content
      const pdfBuffer = await this.createPdfFromPptxContent(textContent);
      return pdfBuffer;
    } catch (error) {
      throw new HttpException(
        `PPTX to PDF conversion failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private extractTextFromPptx(pptxBuffer: Buffer): string[] {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const zip = new AdmZip(pptxBuffer);
      const slides: string[] = [];

      // Get all slide entries
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const slideEntries = zip.getEntries().filter(
        (entry) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
          entry.entryName.startsWith('ppt/slides/slide') &&
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          entry.entryName.endsWith('.xml'),
      );

      for (const entry of slideEntries) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const slideXml = entry.getData().toString('utf8');
        const textContent = this.extractTextFromSlideXml(slideXml);
        slides.push(textContent);
      }

      return slides.length > 0
        ? slides
        : ['PowerPoint presentation converted to PDF'];
    } catch (error) {
      console.warn('Text extraction failed, using fallback:', error.message);
      return [
        'PowerPoint presentation converted to PDF (text extraction failed)',
      ];
    }
  }

  private extractTextFromSlideXml(xml: string): string {
    try {
      // Simple regex to extract text content from XML
      const textMatches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g);
      if (!textMatches) {
        return 'Slide content (no readable text found)';
      }

      const texts = textMatches
        .map((match) => match.replace(/<[^>]*>/g, ''))
        .filter((text) => text.trim().length > 0)
        .join(' ');

      return texts || 'Slide content';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return 'Slide content (text parsing failed)';
    }
  }

  private async createPdfFromPptxContent(slides: string[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      doc.on('data', (chunk) => chunks.push(chunk));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      doc.on('error', reject);

      try {
        slides.forEach((slideContent, index) => {
          if (index > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            doc.addPage();
          }

          // Add slide header
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          doc
            .fontSize(16)
            .font('Helvetica-Bold')
            .text(`Slide ${index + 1}`, { align: 'center' });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          doc.moveDown();

          // Add slide content
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          doc
            .fontSize(12)
            .font('Helvetica')
            .text(slideContent, {
              width: doc.page.width - 100,
              align: 'left',
            });
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        doc.end();
      } catch (error) {
        reject(new Error(`PDF creation failed: ${error.message}`));
      }
    });
  }
}
