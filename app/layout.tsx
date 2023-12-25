import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const font = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-main",
});

const codefont = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-code",
});

export const metadata: Metadata = {
  title: "Nisab Mohd | Blog",
  description:
    "Explore a collection of personal blogs chronicling my coding journey and experiences, filled with insights, challenges, and solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${font.variable} ${codefont.variable} dark:bg-neutral-950 dark:text-slate-50 font-mono`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="max-w-[1000px] min-h-[75vh] mx-auto py-4 lg:px-0 px-5">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
