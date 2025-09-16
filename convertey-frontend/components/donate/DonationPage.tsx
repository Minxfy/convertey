"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Zap, Shield } from "lucide-react";
import DonationForm from "./DonationForm";
import ExternalDonationLinks from "./ExternalDonationLinks";

export default function DonationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-emerald-600 bg-clip-text text-transparent pb-2">
            Support Convertey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Help us maintain and enhance the world&apos;s most trusted file
            conversion platform. Your support keeps our services free, fast, and
            secure for millions of users worldwide.
          </p>

          {/* Stats
          <div className="flex justify-center mt-12 gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                1M+
              </div>
              <div className="text-sm text-gray-500">Files Converted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                50+
              </div>
              <div className="text-sm text-gray-500">File Formats</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                99.9%
              </div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
          </div>
        </div> */}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-3 order-1">
            <Card className="flex flex-col shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
                  Donate to Convertey
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <DonationForm />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 order-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Alternative Donation Methods */}
              <Card className="shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
                    Other Ways to Help
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ExternalDonationLinks />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              {/* Impact Card */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white h-full">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Your Impact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span className="text-sm">
                        Secure server infrastructure
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span className="text-sm">Faster conversion speeds</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-sm">Free access for everyone</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
