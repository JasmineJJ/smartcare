// @ts-nocheck
import "../styles/globals.css";
import { ReactNode } from "react";
import React from "react";
import Navbar from "../components/Navbar";
import ClientProviders from "../components/ClientProviders";

export const metadata = {
  title: "SmartCare – Trusted Specialist for Every Medical Need",
  description: "Digital health assistant for medical insurance claims.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
} 