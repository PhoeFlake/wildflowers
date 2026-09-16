import "./globals.css";

export const metadata = {
  title: "Where the Wildflowers Grow",
  description: "A Wanderer's Atlas — A Portfolio by Drishti Madaan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white">{children}</body>
    </html>
  );
}
