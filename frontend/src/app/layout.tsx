
import React from 'react';
import  Providers  from './Providers';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI CV Generator",
  description: "Generator CV z wykorzystaniem sztucznej inteligencji",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        < Providers >
            {children}
        </ Providers >
      </body>
    </html>
  );
}
