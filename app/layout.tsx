import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Easy Life Aesthetic Clinic — Dr. Zakia Noor",
  description: "Book your appointment at Easy Life Aesthetic Clinic, Lahore. Skin care, hair care and aesthetic treatments by Dr. Zakia Noor (FJMU).",
  keywords: "aesthetic clinic, lahore, skin care, hair care, dr zakia noor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
