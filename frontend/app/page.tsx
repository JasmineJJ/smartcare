// @ts-nocheck
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col-reverse lg:flex-row items-center max-w-7xl mx-auto p-6 gap-8">
        {/* Text column */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            Trusted <span className="text-primary">Specialist</span>
            <br /> for Every Medical Need
          </h1>
          <p className="text-gray-600 max-w-lg">
            We provide a comprehensive range of medical services to meet all
            your healthcare needs.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="px-5 py-3 bg-primary text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
              Schedule an Appointment
            </Link>
            <Link
              href="#"
              className="px-5 py-3 border border-primary text-primary rounded-lg shadow hover:bg-blue-50 transition-colors"
            >
              Find Doctor
            </Link>
          </div>
        </div>

        {/* Doctor Image */}
        <div className="flex-1 relative w-full h-96 lg:h-[600px]">
          <Image
            src="https://images.unsplash.com/photo-1580281658627-8462a8f3e073?auto=format&fit=crop&w=687&q=80"
            alt="Doctor"
            className="object-cover rounded-2xl shadow-lg"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-2xl font-extrabold text-gray-900">30M+</p>
            <p className="text-gray-500">Global Users</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">30%</p>
            <p className="text-gray-500">Upto Savings rate</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">$100M</p>
            <p className="text-gray-500">Capital raised</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">60+</p>
            <p className="text-gray-500">Team Members</p>
          </div>
        </div>
      </section>
    </main>
  );
} 