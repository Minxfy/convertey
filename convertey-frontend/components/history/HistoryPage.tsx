"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  FileImage,
  Video,
  Music,
  Archive,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";

// Mock data - replace with your actual data fetching
const mockConversions = [
  {
    id: "1",
    originalFileName: "document.pdf",
    convertedFileName: "document.docx",
    fromFormat: "PDF",
    toFormat: "DOCX",
    fileSize: "2.5 MB",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    downloadUrl: "/downloads/document.docx",
  },
  {
    id: "2",
    originalFileName: "presentation.pptx",
    convertedFileName: "presentation.pdf",
    fromFormat: "PPTX",
    toFormat: "PDF",
    fileSize: "5.2 MB",
    status: "completed",
    createdAt: "2024-01-14T14:22:00Z",
    downloadUrl: "/downloads/presentation.pdf",
  },
  {
    id: "3",
    originalFileName: "image.png",
    convertedFileName: "image.jpg",
    fromFormat: "PNG",
    toFormat: "JPG",
    fileSize: "1.8 MB",
    status: "failed",
    createdAt: "2024-01-13T09:15:00Z",
    error: "Invalid image format",
  },
  {
    id: "4",
    originalFileName: "video.mp4",
    convertedFileName: "video.avi",
    fromFormat: "MP4",
    toFormat: "AVI",
    fileSize: "125 MB",
    status: "processing",
    createdAt: "2024-01-12T16:45:00Z",
    progress: 75,
  },
  {
    id: "5",
    originalFileName: "audio.wav",
    convertedFileName: "audio.mp3",
    fromFormat: "WAV",
    toFormat: "MP3",
    fileSize: "45 MB",
    status: "completed",
    createdAt: "2024-01-11T11:30:00Z",
    downloadUrl: "/downloads/audio.mp3",
  },
];

const HistoryPage = () => {
  const [conversions, setConversions] = useState(mockConversions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort conversions
  const filteredConversions = conversions
    .filter((conversion) => {
      const matchesSearch =
        conversion.originalFileName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        conversion.convertedFileName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        conversion.fromFormat
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        conversion.toFormat.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || conversion.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

  interface Conversion {
    id: string;
    originalFileName: string;
    convertedFileName: string;
    fromFormat: string;
    toFormat: string;
    fileSize: string;
    status: "completed" | "failed" | "processing" | string;
    createdAt: string;
    downloadUrl?: string;
    error?: string;
    progress?: number;
  }

  const getFileIcon = (format: string): React.JSX.Element => {
    const iconClass = "w-5 h-5";
    switch (format.toLowerCase()) {
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return <FileText className={iconClass} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
        return <FileImage className="w-5 h-5" aria-hidden="true" />;
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
        return <Video className={iconClass} />;
      case "mp3":
      case "wav":
      case "flac":
      case "aac":
        return <Music className={iconClass} />;
      case "zip":
      case "rar":
      case "7z":
        return <Archive className={iconClass} />;
      default:
        return <FileText className={iconClass} />;
    }
  };

  interface StatusIconProps {
    status: string;
  }

  const getStatusIcon = (
    status: StatusIconProps["status"]
  ): React.JSX.Element => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "processing":
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  interface StatusBadgeProps {
    status: string;
  }

  const getStatusBadge = (status: StatusBadgeProps["status"]): string => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "completed":
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "failed":
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case "processing":
        return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  interface FormatDateOptions {
    year: "numeric";
    month: "short";
    day: "numeric";
    hour: "2-digit";
    minute: "2-digit";
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    } as FormatDateOptions);
  };

  interface HandleDownloadProps {
    convertedFileName: string;
    id: string;
    originalFileName: string;
    downloadUrl?: string;
  }

  const handleDownload = (conversion: HandleDownloadProps) => {
    // Implement download logic
    console.log("Downloading:", conversion.convertedFileName);
  };

  interface HandleRetryProps {
    id: string;
    originalFileName: string;
    error?: string;
  }

  const handleRetry = (conversion: HandleRetryProps) => {
    // Implement retry logic
    console.log("Retrying:", conversion.originalFileName);
  };

  interface HandleDeleteProps {
    conversionId: string;
  }

  const handleDelete = (conversionId: HandleDeleteProps["conversionId"]) => {
    setConversions(
      conversions.filter((c: Conversion) => c.id !== conversionId)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Conversion History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your file conversions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by filename or format..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Conversions List */}
        <div className="space-y-4">
          {filteredConversions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No conversions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start converting files to see your history here"}
              </p>
            </div>
          ) : (
            filteredConversions.map((conversion) => (
              <div
                key={conversion.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* File Icons */}
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {getFileIcon(conversion.fromFormat)}
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {getFileIcon(conversion.toFormat)}
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {conversion.originalFileName}
                        </h3>
                        <span className="text-gray-400">→</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conversion.convertedFileName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <span className="font-medium">
                            {conversion.fromFormat}
                          </span>
                          <span>to</span>
                          <span className="font-medium">
                            {conversion.toFormat}
                          </span>
                        </span>
                        <span>{conversion.fileSize}</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(conversion.createdAt)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(conversion.status)}
                        <span className={getStatusBadge(conversion.status)}>
                          {conversion.status.charAt(0).toUpperCase() +
                            conversion.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    {conversion.status === "completed" && (
                      <button
                        onClick={() => handleDownload(conversion)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    {conversion.status === "failed" && (
                      <button
                        onClick={() => handleRetry(conversion)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Retry"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(conversion.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar for processing files */}
                {conversion.status === "processing" && conversion.progress && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Processing...</span>
                      <span>{conversion.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${conversion.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error message for failed conversions */}
                {conversion.status === "failed" && conversion.error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      <strong>Error:</strong> {conversion.error}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination could be added here if needed */}
      </div>
    </div>
  );
};

export default HistoryPage;
