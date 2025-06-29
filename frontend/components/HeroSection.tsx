"use client";

import React from "react";
import Link from "next/link";
import {
  ClipboardDocumentListIcon,
  UserPlusIcon,
  DocumentCheckIcon,
  CreditCardIcon,
  ChartBarIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

interface ServiceTile {
  title: string;
  titleAr: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
}

const services: ServiceTile[] = [
  {
    title: "New Medical Claim",
    titleAr: "طلب تعويض طبي جديد",
    icon: ClipboardDocumentListIcon,
    href: "/claims/new",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Register as Patient",
    titleAr: "تسجيل كمريض",
    icon: UserPlusIcon,
    href: "/signup",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Check Claim Status",
    titleAr: "فحص حالة الطلب",
    icon: DocumentCheckIcon,
    href: "/claims/status",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Make Payment",
    titleAr: "دفع المستحقات",
    icon: CreditCardIcon,
    href: "/payments",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "View Reports",
    titleAr: "عرض التقارير",
    icon: ChartBarIcon,
    href: "/reports",
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "Contact Support",
    titleAr: "الدعم الفني",
    icon: PhoneIcon,
    href: "/support",
    color: "from-red-500 to-red-600",
  },
];

export default function HeroSection() {
  return (
    <div className="relative">
      {/* Hero Background with City Skyline */}
      <div
        className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.85), rgba(15, 118, 110, 0.85)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 200\"><defs><linearGradient id=\"skyline\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\"><stop offset=\"0%\" style=\"stop-color:%23374151;stop-opacity:0.3\"/><stop offset=\"100%\" style=\"stop-color:%23111827;stop-opacity:0.5\"/></linearGradient></defs><polygon fill=\"url(%23skyline)\" points=\"0,200 0,150 50,150 50,120 100,120 100,100 150,100 150,80 200,80 200,60 250,60 250,40 300,40 300,70 350,70 350,90 400,90 400,110 450,110 450,130 500,130 500,140 550,140 550,120 600,120 600,100 650,100 650,80 700,80 700,60 750,60 750,40 800,40 800,70 850,70 850,90 900,90 900,110 950,110 950,130 1000,130 1000,150 1050,150 1050,170 1100,170 1100,180 1200,180 1200,200\"/></svg>')`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Main Content */}
            <div className="text-white">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-white p-3 rounded-lg shadow-lg mr-4">
                    <div className="text-teal-600 font-bold text-2xl">CNSS</div>
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">TOP</h1>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">REQUESTED</h1>
                    <div className="w-24 h-1 bg-yellow-400 mt-2"></div>
                  </div>
                </div>

                <p className="text-xl text-teal-100 mb-6">
                  الخدمات الأكثر طلباً في النظام الصحي
                </p>
                <p className="text-lg text-teal-200">
                  Access the most requested medical services and manage your healthcare claims efficiently
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">25K+</div>
                  <div className="text-sm text-teal-100">Claims Processed</div>
                  <div className="text-xs text-teal-200">المطالبات المعالجة</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">98%</div>
                  <div className="text-sm text-teal-100">Success Rate</div>
                  <div className="text-xs text-teal-200">معدل النجاح</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-teal-100">Support</div>
                  <div className="text-xs text-teal-200">الدعم الفني</div>
                </div>
              </div>
            </div>

            {/* Right Side - Service Grid */}
            <div className="grid grid-cols-2 gap-6">
              {services.map((service, index) => (
                <Link
                  key={index}
                  href={service.href}
                  className="group bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-white"
                >
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${service.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <service.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed" dir="rtl">
                      {service.titleAr}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 border-2 border-white/30 rounded-full flex items-center justify-center animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Medical Services:
            </h2>
            <div className="flex justify-center space-x-8">
              <button className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                NEAR YOU
              </button>
              <button className="px-8 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-600 hover:text-white transition-colors">
                BY TYPE
                <div className="w-16 h-1 bg-yellow-400 mx-auto mt-1"></div>
              </button>
            </div>
          </div>

          {/* Service Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Submit Medical Claim</h3>
              <p className="text-gray-600 text-sm mb-4">
                تقديم مطالبة طبية - Submit your medical expenses for reimbursement through our digital platform.
              </p>
              <Link href="/claims/new" className="text-teal-600 font-medium hover:text-teal-700">
                Start Claim →
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Find Healthcare Providers</h3>
              <p className="text-gray-600 text-sm mb-4">
                البحث عن مقدمي الرعاية الصحية - Locate certified healthcare providers in your network.
              </p>
              <Link href="/providers" className="text-teal-600 font-medium hover:text-teal-700">
                Search Providers →
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Track Your Benefits</h3>
              <p className="text-gray-600 text-sm mb-4">
                تتبع مزاياك - Monitor your medical benefits and coverage details in real-time.
              </p>
              <Link href="/benefits" className="text-teal-600 font-medium hover:text-teal-700">
                View Benefits →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 