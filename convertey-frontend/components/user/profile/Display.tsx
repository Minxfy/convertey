"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Badge component defined inline
import { createSupabaseClient } from "@/lib/utils/supabase/client";
import { toast } from "sonner";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  FileText,
  Download,
  Upload,
  Calendar,
  Shield,
  Mail,
  User,
  Activity,
} from "lucide-react";

interface UserInfo {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  twoFAEnabled: boolean;
  joinDate: string;
}

interface ConversionHistory {
  id: string;
  fileName: string;
  fromFormat: string;
  toFormat: string;
  status: "completed" | "failed" | "processing";
  createdAt: string;
  fileSize: number;
}

interface Analytics {
  totalConversions: number;
  mostUsedFormat: string;
  totalFilesProcessed: number;
}

// Mock conversion history - replace with real data
const mockConversionHistory: ConversionHistory[] = [
  {
    id: "1",
    fileName: "document.pdf",
    fromFormat: "PDF",
    toFormat: "DOCX",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    fileSize: 2048000,
  },
  {
    id: "2",
    fileName: "spreadsheet.xlsx",
    fromFormat: "XLSX",
    toFormat: "CSV",
    status: "completed",
    createdAt: "2024-01-14T14:22:00Z",
    fileSize: 1024000,
  },
  {
    id: "3",
    fileName: "presentation.pptx",
    fromFormat: "PPTX",
    toFormat: "PDF",
    status: "failed",
    createdAt: "2024-01-13T09:15:00Z",
    fileSize: 5120000,
  },
  {
    id: "4",
    fileName: "image.png",
    fromFormat: "PNG",
    toFormat: "JPG",
    status: "completed",
    createdAt: "2024-01-12T16:45:00Z",
    fileSize: 512000,
  },
  {
    id: "5",
    fileName: "report.docx",
    fromFormat: "DOCX",
    toFormat: "PDF",
    status: "processing",
    createdAt: "2024-01-11T11:20:00Z",
    fileSize: 3072000,
  },
];

export default function DisplayPage() {
  const [supabase] = useState(() => createSupabaseClient());
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: "",
    email: "",
    avatarUrl: null,
    twoFAEnabled: false,
    joinDate: "",
  });
  const [analytics, setAnalytics] = useState<Analytics>({
    totalConversions: 0,
    mostUsedFormat: "",
    totalFilesProcessed: 0,
  });
  const [conversionHistory, setConversionHistory] = useState<
    ConversionHistory[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Mock analytics data - replace with real data from your backend
  const mockAnalyticsData = {
    conversionActivity: [
      { date: "2024-01-01", conversions: 5, failed: 0 },
      { date: "2024-01-02", conversions: 8, failed: 1 },
      { date: "2024-01-03", conversions: 3, failed: 0 },
      { date: "2024-01-04", conversions: 12, failed: 0 },
      { date: "2024-01-05", conversions: 7, failed: 0 },
      { date: "2024-01-06", conversions: 15, failed: 1 },
      { date: "2024-01-07", conversions: 9, failed: 0 },
      { date: "2024-01-08", conversions: 6, failed: 0 },
      { date: "2024-01-09", conversions: 11, failed: 0 },
      { date: "2024-01-10", conversions: 4, failed: 0 },
    ],
    formatDistribution: [
      { name: "PDF", value: 35, color: "#10B981" },
      { name: "DOCX", value: 28, color: "#3B82F6" },
      { name: "XLSX", value: 20, color: "#8B5CF6" },
      { name: "PNG", value: 17, color: "#F59E0B" },
    ],
    processingTimes: [
      { time: "0-5s", count: 45 },
      { time: "5-10s", count: 32 },
      { time: "10-30s", count: 18 },
      { time: "30s+", count: 5 },
    ],
  };

  // Fetch user data and analytics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserInfo({
            fullName: user.user_metadata?.full_name || "Unknown User",
            email: user.email || "",
            avatarUrl: user.user_metadata?.avatar_url || null,
            twoFAEnabled: user.user_metadata?.two_factor_enabled || false,
            joinDate: user.created_at || new Date().toISOString(),
          });
        }

        // Set mock analytics data - replace with real API calls
        setAnalytics({
          totalConversions: 156,
          mostUsedFormat: "PDF",
          totalFilesProcessed: 1.2,
        });

        setConversionHistory(mockConversionHistory);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: ConversionHistory["status"]) => {
    const variants = {
      completed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Dashboard
          </h1>

          {/* Main Section - User Info */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 dark:text-white flex items-center">
                <User className="mr-2 h-6 w-6" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Avatar and Basic Info */}
                <div className="lg:col-span-1 flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 ring-4 ring-emerald-500 ring-offset-4 mb-4">
                    <AvatarImage src={userInfo.avatarUrl || ""} alt="Profile" />
                    <AvatarFallback className="bg-emerald-500 text-white text-2xl">
                      {userInfo.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {userInfo.fullName}
                  </h2>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <Mail className="mr-2 h-4 w-4" />
                    {userInfo.email}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <Calendar className="mr-2 h-4 w-4" />
                    Joined {formatDate(userInfo.joinDate).split(",")[0]}
                  </div>
                  {userInfo.twoFAEnabled && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      <Shield className="mr-1 h-3 w-3" />
                      2FA Enabled
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-3 sm:p-6 text-white h-32 md:h-40">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-base font-medium md:text-sm">
                          Total Conversions
                        </p>
                        <p className="text-3xl font-bold">
                          {analytics.totalConversions}
                        </p>
                      </div>
                      <FileText className="h-8 w-8 text-emerald-200 sm:h-8 sm:w-8 sm:text-2xl md:h-10 md:w-10" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 sm:p-6 text-white h-32 md:h-40">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-base font-medium md:text-sm">
                          Files Processed (GB)
                        </p>
                        <p className="text-3xl font-bold">
                          {analytics.totalFilesProcessed}
                        </p>
                      </div>
                      <Upload className="h-8 w-8 text-purple-200 sm:h-8 sm:w-8 sm:text-2xl md:h-10 md:w-10" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Section - Analytics and History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Analytics */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 dark:text-white flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Conversion Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={mockAnalyticsData.conversionActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="conversions"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 dark:text-white">
                    File Format Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={mockAnalyticsData.formatDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockAnalyticsData.formatDistribution.map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Conversion History */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Recent Conversions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {conversionHistory.map((conversion) => (
                    <div
                      key={conversion.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900 dark:text-white truncate">
                            {conversion.fileName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            {conversion.fromFormat} → {conversion.toFormat}
                          </span>
                          <span>•</span>
                          <span>{formatFileSize(conversion.fileSize)}</span>
                          <span>•</span>
                          <span>{formatDate(conversion.createdAt)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(conversion.status)}
                      </div>
                    </div>
                  ))}
                </div>
                {conversionHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No conversion history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
