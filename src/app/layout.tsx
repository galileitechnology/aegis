"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ProgressProvider } from "@bprogress/next/app";
import { ReactFlowProvider } from "@xyflow/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="dark bg-neutral-900">
       
       <ProgressProvider
          color="#fff"
          options={{ showSpinner: false }}
          shallowRouting
        >
          <main>{children}</main>
          <Toaster className="border-none" />
        </ProgressProvider>
      </body>
    </html>
  );
}
