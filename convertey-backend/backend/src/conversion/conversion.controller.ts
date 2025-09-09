import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ConversionService } from "./conversion.service";
import { ConversionDto, ConversionResponse } from "./dto/conversion.dto";

@Controller("convert")
export class ConversionController {
  constructor(private readonly conversionService: ConversionService) {}

  @Post("file")
  async convertFile(
    @Body() conversionDto: ConversionDto
  ): Promise<ConversionResponse> {
    try {
      console.log("Conversion request:", {
        fileType: conversionDto.fileType,
        format: conversionDto.format,
        fileName: conversionDto.fileName,
      });

      const result = await this.conversionService.convertFile(conversionDto);
      return result;
    } catch (error) {
      console.error("Conversion error:", error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: "Conversion failed",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          error: error.message || "Unknown error occurred",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
