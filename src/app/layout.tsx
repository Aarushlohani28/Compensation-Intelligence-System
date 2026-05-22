import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Compensation Intelligence",
  description: "A structured compensation intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="font-bold text-xl tracking-tight">
              CompIntel
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/salaries" className="hover:text-primary transition-colors">Salaries</Link>
              <Link href="/compare" className="hover:text-primary transition-colors">Compare</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Compensation Intelligence MVP.
          </div>
        </footer>
      </body>
    </html>
  );
}
