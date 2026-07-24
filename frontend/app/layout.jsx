import "./globals.css";

export const metadata = {
  title: "URL Watch Desk",
  description: "Create short URLs and inspect watch-list history.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
