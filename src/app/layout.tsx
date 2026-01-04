import type { Metadata } from "next";
import "./globals.css"; // Ensure you have standard Tailwind directives here
import { fontKalam, fontPacifico, fontAmaticSC, fontCaveat } from '@/lib/font-def';

export const metadata: Metadata = {
  title: "MailSmith AI - Draft Emails Instantly",
  description: "Generate professional email drafts using AI",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        // className={inter.className}>
        className={`${fontKalam.variable} ${fontPacifico.variable} ${fontCaveat.variable} ${fontAmaticSC.variable}`}>
        {children}
      </body>
    </html>
  );
}