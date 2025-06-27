// @ts-nocheck
import "../styles/globals.css";
import { ReactNode } from "react";
import React from "react";

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
      <body>{children}</body>
    </html>
  );
} 