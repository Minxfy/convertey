"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, AlertCircle } from "lucide-react";
import FileUpload from "@/components/file-upload/FileUpload";
import { downloadFile } from "@/lib/utils/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ConversionFormat } from "@/types/FileConversionFormats";
import {
  CONVERSION_MAP,
  MIME_TYPES,
  FORMAT_DESCRIPTIONS,
} from "@/lib/config/fileConversions";

/**
 * FileConverterWrapper is a React component that provides a user interface for converting files
 * from one format to another. It allows users to upload a file, select a target format, and
 * initiate the conversion process. The component handles file type detection, displays available
 * conversion formats, and manages the conversion state and progress.
 *
 * Free users can try the file conversion feature five times. If they need to convert more than
 * five files, they are required to subscribe to one of our plans from the pricing page.
 *
 * @component
 * @example
 * return (
 *   <FileConverterWrapper />
 * )
 */
export default function FileConverterWrapper() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<ConversionFormat>("pdf");
  const [conversionProgress, setConversionProgress] = useState(0);

  const getFileType = (file: File): string => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    switch (extension) {
      // Document formats
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

      // Presentation formats
      case "ppt":
        return "application/vnd.ms-powerpoint";
      case "pptx":
        return "application/vnd.openxmlformats-officedocument.presentationml.presentation";

      // Ebook format
      case "epub":
        return "application/epub+zip";

      // Data formats
      case "csv":
        return "text/csv";

      // Audio formats
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

  const handleFileUpload = (file: File) => {
    console.log("Uploaded file type:", file.type); // Debug log
    console.log("Uploaded file name:", file.name); // Debug log
    setSelectedFile(file);
  };

  // Get available conversion formats for the selected file
  const availableFormats = useMemo(() => {
    if (!selectedFile) return [];
    const fileType = getFileType(selectedFile); // Use the custom function
    console.log("Detected file type:", fileType); // Debug log
    const formats = CONVERSION_MAP[fileType] || [];
    console.log("Available formats:", formats); // Debug log
    return formats;
  }, [selectedFile]);

  // Set first available format when file is selected
  useMemo(() => {
    if (selectedFile && availableFormats.length > 0) {
      setTargetFormat(availableFormats[0]);
    }
  }, [selectedFile, availableFormats]);

  const handleFileConvert = async () => {
    if (!selectedFile) {
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

      console.log("File type:", selectedFile.type); // Debug log
      console.log("Target format:", targetFormat); // Debug log
      console.log("File name:", selectedFile.name); // Debug log

      try {
        const response = await fetch("/api/convert/file", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileData,
            fileType: getFileType(selectedFile), // Use the custom function
            format: targetFormat,
            fileName: selectedFile.name,
          }),
        });

        console.log("Response status:", response.status); // Debug log

        if (!response.ok) {
          throw new Error(`Conversion failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const convertedData = Buffer.from(data.convertedData, "base64");
        const outputFileName =
          data.fileName || `converted-file.${targetFormat}`;

        downloadFile(convertedData, outputFileName, MIME_TYPES[targetFormat]);

        setConversionProgress(100);
      } catch (error) {
        console.error("Error during file conversion:", error);
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

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <section className="py-20 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto px-6 w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent pb-2">
            Try Converting Files with Convertey
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto leading-tight">
            Transform files seamlessly with our powerful conversion platform.
            Upload, select your target format, and convert with enterprise-grade
            reliability.
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Free users can convert{" "}
            <span className="font-semibold text-emerald-600">5 FILES </span>
            daily. For more conversions, explore our plans.
          </p>
        </div>

        {/* Converter Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 border-dashed border-2 border-emerald-400 dark:border-emerald-400 transition-all duration-300 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-300">
          <FileUpload onConvert={handleFileUpload} maxSizeMB={4} />
          {selectedFile && availableFormats.length > 0 && (
            <div className="mt-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative group">
                  <select
                    value={targetFormat}
                    onChange={(e) =>
                      setTargetFormat(e.target.value as ConversionFormat)
                    }
                    className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-700 dark:text-gray-200 font-medium min-w-[200px]"
                  >
                    {availableFormats.map((format) => (
                      <option key={format} value={format}>
                        Convert to {format.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10">
                    {FORMAT_DESCRIPTIONS[targetFormat]}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  onClick={handleFileConvert}
                  disabled={isConverting}
                >
                  {isConverting ? (
                    <div className="flex items-center">
                      <span className="mr-2">Converting...</span>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-5 w-5" /> Convert Now
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Converting:{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {selectedFile.name}
                  </span>
                </p>
              </div>

              {conversionProgress > 0 && conversionProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${conversionProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert
              variant="destructive"
              className="mt-6 border-red-200 bg-red-50 dark:bg-red-900/20"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700 dark:text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {selectedFile && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Need a different format?{" "}
              <span className="text-emerald-600 hover:text-emerald-700 cursor-pointer font-medium">
                Contact us
              </span>{" "}
              for custom conversions!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
