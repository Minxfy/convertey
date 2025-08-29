/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class ImageService {
  async imageToPdf(imageBuffer: Buffer): Promise<Buffer> {
    try {
      // Process image with Sharp to ensure compatibility
      const processedImage = await sharp(imageBuffer)
        .jpeg({ quality: 90 })
        .toBuffer();

      // Create PDF document
      const pdfDoc = await PDFDocument.create();

      // Get image dimensions
      const metadata = await sharp(imageBuffer).metadata();
      const { width = 800, height = 600 } = metadata;

      // Calculate page size (A4 proportions, but fit image)
      const maxWidth = 595; // A4 width in points
      const maxHeight = 842; // A4 height in points

      let pageWidth = maxWidth;
      let pageHeight = (height / width) * pageWidth;

      if (pageHeight > maxHeight) {
        pageHeight = maxHeight;
        pageWidth = (width / height) * pageHeight;
      }

      // Add page with calculated dimensions
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Embed image in PDF
      const pdfImage = await pdfDoc.embedJpg(processedImage);

      // Draw image to fill the page
      page.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      });

      // Save PDF
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      throw new HttpException(
        `Image to PDF conversion failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async convertImageFormat(
    imageBuffer: Buffer,
    targetFormat: 'jpeg' | 'png',
  ): Promise<Buffer> {
    try {
      const sharpInstance = sharp(imageBuffer);

      switch (targetFormat) {
        case 'jpeg':
          return await sharpInstance.jpeg({ quality: 90 }).toBuffer();
        case 'png':
          return await sharpInstance.png({ compressionLevel: 6 }).toBuffer();
        default:
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          throw new Error(`Unsupported target format: ${targetFormat}`);
      }
    } catch (error) {
      throw new HttpException(
        `Image format conversion failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
