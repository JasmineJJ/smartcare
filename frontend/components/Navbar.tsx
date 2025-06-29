"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("FR");

  return (
    <nav className="bg-teal-600 shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-teal-700 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-4">
              <span>Welcome to SmartCare - Your digital health assistant</span>
              <span className="text-teal-200">مرحباً بكم في سمارت كير</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 hover:text-teal-200 transition-colors">
                <GlobeAltIcon className="w-4 h-4" />
                <span>{language}</span>
              </button>
              <div className="flex space-x-2">
                <a href="#" className="hover:text-teal-200 transition-colors">
                  Facebook
                </a>
                <a href="#" className="hover:text-teal-200 transition-colors">
                  Twitter
                </a>
                <a href="#" className="hover:text-teal-200 transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <div className="text-teal-600 font-bold text-xl">CNSS</div>
            </div>
            <div className="text-white">
              <div className="font-bold text-lg">SmartCare</div>
              <div className="text-xs text-teal-200">Digital Health Platform</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/patients"
              className="text-white hover:text-teal-200 font-medium transition-colors"
            >
              PATIENTS
            </Link>
            <Link
              href="/providers"
              className="text-white hover:text-teal-200 font-medium transition-colors"
            >
              PROVIDERS
            </Link>
            <Link
              href="/services"
              className="text-white hover:text-teal-200 font-medium transition-colors"
            >
              SERVICES
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-teal-200 font-medium transition-colors"
            >
              ABOUT CNSS
            </Link>
            <Link
              href="/news"
              className="text-white hover:text-teal-200 font-medium transition-colors"
            >
              NEWS & UPDATES
            </Link>
 
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-white/20 bg-white/10 text-white placeholder-teal-200"
              />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white hover:text-teal-200 transition-colors"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-teal-700">
          <div className="px-4 py-6 space-y-4">
            <Link href="/patients" className="block text-white hover:text-teal-200 py-2">
              PATIENTS / المرضى
            </Link>
            <Link href="/providers" className="block text-white hover:text-teal-200 py-2">
              PROVIDERS / مقدمو الخدمة
            </Link>
            <Link href="/services" className="block text-white hover:text-teal-200 py-2">
              SERVICES / الخدمات
            </Link>
            <Link href="/about" className="block text-white hover:text-teal-200 py-2">
              ABOUT CNSS / حول الصندوق
            </Link>
            <Link href="/news" className="block text-white hover:text-teal-200 py-2">
              NEWS & UPDATES / الأخبار
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
} 