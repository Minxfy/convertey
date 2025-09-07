"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  FileUp,
  ArrowRight,
  Settings,
  Rocket,
  AlertCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { downloadFile } from "@/lib/utils/utils";
import { CONVERSION_MAP, MIME_TYPES } from "@/lib/config/fileConversions";
import type { ConversionFormat } from "@/types/FileConversionFormats";

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<ConversionFormat>("pdf");
  const [quality, setQuality] = useState(80);
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string>("");
  const [, setConversionProgress] = useState(0);

  const getFileType = (file: File): string => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "md":
        return "text/markdown";
      case "txt":
        return "text/plain";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "pdf":
        return "application/pdf";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "ppt":
        return "application/vnd.ms-powerpoint";
      case "pptx":
        return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      case "epub":
        return "application/epub+zip";
      case "csv":
        return "text/csv";
      case "mp4":
        return "video/mp4";
      case "webm":
        return "video/webm";
      case "mov":
        return "video/quicktime";
      case "avi":
        return "video/x-msvideo";
      case "flv":
        return "video/x-flv";
      case "mp3":
        return "audio/mpeg";
      case "wav":
        return "audio/wav";
      case "ogg":
        return "audio/ogg";
      case "flac":
        return "audio/flac";
      default:
        return file.type;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const availableFormats = useMemo(() => {
    if (!file) return [];
    const fileType = getFileType(file);
    return CONVERSION_MAP[fileType] || [];
  }, [file]);

  useMemo(() => {
    if (file && availableFormats.length > 0) {
      setOutputFormat(availableFormats[0] as ConversionFormat);
    }
  }, [file, availableFormats]);

  const handleConvert = async () => {
    if (!file) {
      setError("No file selected");
      return;
    }

    setIsConverting(true);
    setError("");
    setConversionProgress(0);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      const fileData = Buffer.from(buffer).toString("base64");

      try {
        const response = await fetch("/api/convert/file", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileData,
            fileType: getFileType(file),
            format: outputFormat,
            fileName: file.name,
          }),
        });

        if (!response.ok) {
          throw new Error(`Conversion failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const convertedData = Buffer.from(data.convertedData, "base64");
        const outputFileName =
          data.fileName || `converted-file.${outputFormat}`;

        downloadFile(convertedData, outputFileName, MIME_TYPES[outputFormat]);

        setConversionProgress(100);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Conversion failed. Please try again or contact support."
        );
      } finally {
        setIsConverting(false);
      }
    };

    reader.onerror = () => {
      setError("Error reading file. Please try again.");
      setIsConverting(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Convert Your File</h1>

      <Card>
        <CardHeader>
          <CardTitle>File Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input id="file" type="file" onChange={handleFileChange} />
            </div>
            <div>
              <Label htmlFor="outputFormat">Output Format</Label>
              <Select
                onValueChange={(value) =>
                  setOutputFormat(value as ConversionFormat)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent>
                  {availableFormats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced-options">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Advanced Options
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="quality">Quality</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="quality"
                          min={0}
                          max={100}
                          step={1}
                          value={[quality]}
                          onValueChange={(value) => setQuality(value[0])}
                        />
                        <span>{quality}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="preserve-metadata"
                        checked={preserveMetadata}
                        onCheckedChange={setPreserveMetadata}
                      />
                      <Label htmlFor="preserve-metadata">
                        Preserve Metadata
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleConvert}
            disabled={!file || !outputFormat || isConverting}
            className="w-full"
          >
            {isConverting ? (
              <div className="flex items-center">
                <span className="mr-2">Converting...</span>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" /> Convert File
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {file && outputFormat && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <FileUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6" />
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <FileUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">
                    {file.name.split(".")[0]}.{outputFormat}
                  </p>
                  <p className="text-sm text-muted-foreground">Output Format</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
