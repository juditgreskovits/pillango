import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leah',
  description: 'Welcome to Leah',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
