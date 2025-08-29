/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConversionController } from './conversion.controller';
import { ConversionService } from './conversion.service';
import { PdfService } from './services/pdf.service';
import { DocxService } from './services/docx.service';
import { ImageService } from './services/image.service';
import { PptxService } from './services/pptx.service';

@Module({
  controllers: [ConversionController],
  providers: [
    ConversionService,
    PdfService,
    DocxService,
    ImageService,
    PptxService,
  ],
})
export class ConversionModule {}