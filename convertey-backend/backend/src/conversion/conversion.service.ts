import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConversionDto, ConversionResponse } from './dto/conversion.dto';
import { PdfService } from './services/pdf.service';
import { DocxService } from './services/docx.service';
import { ImageService } from './services/image.service';
import { PptxService } from './services/pptx.service';

@Injectable()
export class ConversionService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly docxService: DocxService,
    private readonly imageService: ImageService,
    private readonly pptxService: PptxService,
  ) {}

  async convertFile(conversionDto: ConversionDto): Promise<ConversionResponse> {
    const { fileType, format, fileData, fileName } = conversionDto;

    // Validate supported conversions
    const isValidConversion = this.validateConversion(fileType, format);
    if (!isValidConversion) {
      throw new HttpException(
        `Conversion from ${fileType} to ${format} is not supported`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const buffer = Buffer.from(fileData, 'base64');

    try {
      let convertedBuffer: Buffer;
      let outputFileName: string;
      let mimeType: string;

      // Handle different conversion scenarios
      switch (true) {
        // PDF → DOCX
        case fileType === 'application/pdf' && format === 'docx':
          convertedBuffer = await this.pdfService.pdfToDocx(buffer);
          outputFileName = this.getOutputFileName(fileName, 'docx');
          mimeType =
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;

        // DOCX → PDF
        case fileType ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
          format === 'pdf':
          convertedBuffer = await this.docxService.docxToPdf(buffer);
          outputFileName = this.getOutputFileName(fileName, 'pdf');
          mimeType = 'application/pdf';
          break;

        // PDF → JPG
        case fileType === 'application/pdf' &&
          (format === 'jpg' || format === 'jpeg'):
          convertedBuffer = await this.pdfService.pdfToJpg(buffer);
          outputFileName = this.getOutputFileName(fileName, 'jpg');
          mimeType = 'image/jpeg';
          break;

        // JPG → PDF
        case (fileType === 'image/jpeg' || fileType === 'image/png') &&
          format === 'pdf':
          convertedBuffer = await this.imageService.imageToPdf(buffer);
          outputFileName = this.getOutputFileName(fileName, 'pdf');
          mimeType = 'application/pdf';
          break;

        // PDF → PPTX
        case fileType === 'application/pdf' && format === 'pptx':
          convertedBuffer = await this.pdfService.pdfToPptx(buffer);
          outputFileName = this.getOutputFileName(fileName, 'pptx');
          mimeType =
            'application/vnd.openxmlformats-officedocument.presentationml.presentation';
          break;

        // PPTX → PDF
        case (fileType ===
          'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
          fileType === 'application/vnd.ms-powerpoint') &&
          format === 'pdf':
          convertedBuffer = await this.pptxService.pptxToPdf(buffer);
          outputFileName = this.getOutputFileName(fileName, 'pdf');
          mimeType = 'application/pdf';
          break;

        default:
          throw new HttpException(
            'Conversion not implemented',
            HttpStatus.NOT_IMPLEMENTED,
          );
      }

      return {
        convertedData: convertedBuffer.toString('base64'),
        fileName: outputFileName,
        mimeType,
      };
    } catch (error) {
      console.error('Service conversion error:', error);
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Conversion failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validateConversion(fileType: string, format: string): boolean {
    const validConversions = [
      // PDF conversions
      { from: 'application/pdf', to: 'docx' },
      { from: 'application/pdf', to: 'jpg' },
      { from: 'application/pdf', to: 'jpeg' },
      { from: 'application/pdf', to: 'pptx' },

      // DOCX conversions
      {
        from: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        to: 'pdf',
      },

      // Image conversions
      { from: 'image/jpeg', to: 'pdf' },
      { from: 'image/png', to: 'pdf' },

      // PPTX conversions
      {
        from: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        to: 'pdf',
      },
      { from: 'application/vnd.ms-powerpoint', to: 'pdf' },
    ];

    return validConversions.some(
      (conversion) => conversion.from === fileType && conversion.to === format,
    );
  }

  private getOutputFileName(
    originalName: string,
    newExtension: string,
  ): string {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}.${newExtension}`;
  }
}
