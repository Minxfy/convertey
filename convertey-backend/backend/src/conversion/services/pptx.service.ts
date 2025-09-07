/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
 
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
       
      const zip = new AdmZip(pptxBuffer);
      const slides: string[] = [];

      // Get all slide entries
       
      const slideEntries = zip.getEntries().filter(entry => 
         
        entry.entryName.startsWith('ppt/slides/slide') && 
         
        entry.entryName.endsWith('.xml')
      );

      for (const entry of slideEntries) {
         
        const slideXml = entry.getData().toString('utf8');
        const textContent = this.extractTextFromSlideXml(slideXml);
        slides.push(textContent);
      }

      return slides.length > 0 ? slides : ['PowerPoint presentation converted to PDF'];
    } catch (error) {
      console.warn('Text extraction failed, using fallback:', error.message);
      return ['PowerPoint presentation converted to PDF (text extraction failed)'];
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
        .map(match => match.replace(/<[^>]*>/g, ''))
        .filter(text => text.trim().length > 0)
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
      
       
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
      });

       
      doc.on('data', (chunk) => chunks.push(chunk));
       
      doc.on('end', () => resolve(Buffer.concat(chunks)));
       
      doc.on('error', reject);

      try {
        slides.forEach((slideContent, index) => {
          if (index > 0) {
             
            doc.addPage();
          }

          // Add slide header
           
          doc.fontSize(16)
             .font('Helvetica-Bold')
             .text(`Slide ${index + 1}`, { align: 'center' });
          
           
          doc.moveDown();

          // Add slide content
           
          doc.fontSize(12)
             .font('Helvetica')
             .text(slideContent, {
               width: doc.page.width - 100,
               align: 'left',
             });
        });

         
        doc.end();
      } catch (error) {
        reject(new Error(`PDF creation failed: ${error.message}`));
      }
    });
  }
}