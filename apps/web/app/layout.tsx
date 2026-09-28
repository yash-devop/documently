import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers/providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const description =
  "Upload your PDFs and ask questions. Documently finds the passages that matter and answers from them, instead of answering from memory.";

export const metadata: Metadata = {
  // Read directly rather than through the zod env module, which throws at
  // module scope during SSR when the variable is absent.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Documently — Stop re-reading the same 40 pages",
    template: "%s · Documently",
  },
  description,
  applicationName: "Documently",
  openGraph: {
    type: "website",
    siteName: "Documently",
    title: "Documently — Stop re-reading the same 40 pages",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Documently — Stop re-reading the same 40 pages",
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Scroll reveals render at their hidden state on the server, so
            without JS nothing below the fold would ever become visible. This
            forces them visible instead, and only applies when JS is off. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
