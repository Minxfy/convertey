"use client";

import React, { useState, ReactElement } from "react";
import {
  FileText,
  Download,
  // Clock,
  Calendar,
  ArrowUp,
  ArrowDown,
  FileImage,
  FileVideo,
  Music,
  Archive,
  // CheckCircle,
  // XCircle,
  // TrendingUp,
  // Activity,
  // Target,
  Zap,
  // Star,
  // Users,
  // Globe,
} from "lucide-react";
import {
  // LineChart,
  // Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  // BarChart,
  // Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const UserAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("30d");
  // const [loading, setLoading] = useState(false);

  // Sample user data - replace with real data from your backend
  const userStats = {
    totalConversions: 127,
    successfulConversions: 124,
    failedConversions: 3,
    totalFilesProcessed: 145,
    avgProcessingTime: 1.8,
    totalDataProcessed: 2.4, // in GB
    accountAge: 45, // days
    favoriteFormat: "PDF",
  };

  const userConversions = [
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
  ];

  const userFileTypes = [
    { type: "PDF", count: 45, percentage: 35.4, color: "#ef4444" },
    { type: "Images", count: 32, percentage: 25.2, color: "#3b82f6" },
    { type: "Documents", count: 28, percentage: 22.0, color: "#10b981" },
    { type: "Videos", count: 15, percentage: 11.8, color: "#f59e0b" },
    { type: "Audio", count: 7, percentage: 5.5, color: "#8b5cf6" },
  ];

  const popularConversions = [
    { name: "PDF → DOCX", count: 24, percentage: 18.9 },
    { name: "JPG → PNG", count: 19, percentage: 15.0 },
    { name: "DOCX → PDF", count: 16, percentage: 12.6 },
    { name: "PNG → JPG", count: 12, percentage: 9.4 },
    { name: "MP4 → AVI", count: 8, percentage: 6.3 },
  ];

  // interface RecentConversion {
  //   from: string;
  //   to: string;
  //   filename: string;
  //   date: string;
  //   status: "success" | "failed";
  //   size: string;
  // }

  // const recentConversions: RecentConversion[] = [
  //   {
  //     from: "DOCX",
  //     to: "PDF",
  //     filename: "report_2024.docx",
  //     date: "2024-01-10",
  //     status: "success",
  //     size: "2.1 MB",
  //   },
  //   {
  //     from: "JPG",
  //     to: "PNG",
  //     filename: "image.jpg",
  //     date: "2024-01-10",
  //     status: "success",
  //     size: "1.5 MB",
  //   },
  //   {
  //     from: "MP4",
  //     to: "AVI",
  //     filename: "video.mp4",
  //     date: "2024-01-09",
  //     status: "failed",
  //     size: "45.2 MB",
  //   },
  //   {
  //     from: "XLSX",
  //     to: "CSV",
  //     filename: "data.xlsx",
  //     date: "2024-01-09",
  //     status: "success",
  //     size: "856 KB",
  //   },
  //   {
  //     from: "PNG",
  //     to: "JPG",
  //     filename: "screenshot.png",
  //     date: "2024-01-08",
  //     status: "success",
  //     size: "3.2 MB",
  //   },
  // ];

  interface FileIconProps {
    type: "Images" | "Videos" | "Audio" | "Archives" | string;
  }

  const getFileIcon = (type: FileIconProps["type"]): ReactElement => {
    switch (type) {
      case "Images":
        return <FileImage className="h-5 w-5" />;
      case "Videos":
        return <FileVideo className="h-5 w-5" />;
      case "Audio":
        return <Music className="h-5 w-5" />;
      case "Archives":
        return <Archive className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // interface StatusIconProps {
  //   status: "success" | "failed";
  // }

  // const getStatusIcon = (status: StatusIconProps["status"]): ReactElement => {
  //   return status === "success" ? (
  //     <CheckCircle className="h-4 w-4 text-green-500" />
  //   ) : (
  //     <XCircle className="h-4 w-4 text-red-500" />
  //   );
  // };

  interface StatCardProps {
    title: string;
    value: string;
    change?: number;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
    subtitle?: string;
  }

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    color = "emerald",
    subtitle,
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
          {change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change > 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(change)}% from last month
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}
        >
          <Icon
            className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your file conversion activity and progress
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Personal Stats - Reduced to 2 main stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Total Conversions"
            value={userStats.totalConversions.toString()}
            change={15.2}
            icon={Zap}
            color="emerald"
            subtitle="Files converted"
          />
          <StatCard
            title="Data Processed"
            value={`${userStats.totalDataProcessed}GB`}
            change={22.1}
            icon={Download}
            color="purple"
            subtitle="Total file size"
          />
        </div>

        {/* Conversion Activity */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Conversion Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userConversions}>
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
          </div>
        </div>

        {/* File Types and Popular Conversions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Your File Types */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your File Types
            </h3>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={userFileTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {userFileTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                {userFileTypes.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex items-center space-x-1">
                      {getFileIcon(item.type)}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Conversions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Top Conversions
            </h3>
            <div className="space-y-4">
              {popularConversions.map((conversion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {conversion.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {conversion.percentage}% of total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {conversion.count}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      conversions
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Conversions
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Conversions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">File</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Conversion</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Size</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentConversions.map((conversion, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white truncate max-w-xs">{conversion.filename}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{conversion.from}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">→</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{conversion.to}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{conversion.size}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{conversion.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(conversion.status)}
                        <span className={`text-sm capitalize ${conversion.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                          {conversion.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UserAnalyticsPage;
