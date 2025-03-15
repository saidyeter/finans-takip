import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finans Takip",
  description: "Json olarak bulunan verinizi analiz etmek için kullanılan bir uygulamadır.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
